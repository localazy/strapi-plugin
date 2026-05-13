import type { Core } from '@strapi/strapi';
import ActivityLogsService from '../../services/activity-logs-service';
import { KEY, ActivityLogs } from '../../db/model/activity-logs';

type FakeStore = {
  get: (args: { key: string }) => Promise<ActivityLogs | null>;
  set: (args: { key: string; value: ActivityLogs }) => Promise<void>;
};

const buildFakeStrapi = (initial: ActivityLogs | null = { sessions: [] }) => {
  let state: ActivityLogs | null = initial ? JSON.parse(JSON.stringify(initial)) : null;
  const warn = jest.fn();
  const store: FakeStore = {
    get: async ({ key }) => (key === KEY ? state : null),
    set: async ({ key, value }) => {
      if (key === KEY) {
        state = JSON.parse(JSON.stringify(value));
      }
    },
  };
  const strapi = {
    store: () => store,
    log: { warn, info: jest.fn(), error: jest.fn() },
  } as unknown as Core.Strapi;
  return {
    strapi,
    warn,
    getState: () => state,
  };
};

describe('activity-logs-service.recordAttemptedEntry(ies)', () => {
  it('appends a single attempted entry under the existing mutex and auto-stamps attemptedAt', async () => {
    const seed: ActivityLogs = {
      sessions: [
        {
          id: 's1',
          eventType: 'upload',
          status: 'in-progress',
          startedAt: 1,
          initiatedBy: 'tester',
          summary: '',
          entries: [],
        },
      ],
    };
    const { strapi, getState } = buildFakeStrapi(seed);
    const service = ActivityLogsService({ strapi });

    const before = Date.now();
    await service.recordAttemptedEntry('s1', {
      uid: 'api::a.a',
      documentId: 'd1',
      locale: 'fr',
      status: 'success',
    });
    const after = Date.now();

    const session = getState()!.sessions.find((s) => s.id === 's1')!;
    expect(session.attemptedEntries).toHaveLength(1);
    expect(session.attemptedEntries![0].uid).toBe('api::a.a');
    expect(session.attemptedEntries![0].documentId).toBe('d1');
    expect(session.attemptedEntries![0].locale).toBe('fr');
    expect(session.attemptedEntries![0].status).toBe('success');
    expect(session.attemptedEntries![0].attemptedAt).toBeGreaterThanOrEqual(before);
    expect(session.attemptedEntries![0].attemptedAt).toBeLessThanOrEqual(after);
  });

  it('batch-appends via recordAttemptedEntries', async () => {
    const seed: ActivityLogs = {
      sessions: [
        {
          id: 's1',
          eventType: 'upload',
          status: 'in-progress',
          startedAt: 1,
          initiatedBy: 'tester',
          summary: '',
          entries: [],
        },
      ],
    };
    const { strapi, getState } = buildFakeStrapi(seed);
    const service = ActivityLogsService({ strapi });

    await service.recordAttemptedEntries('s1', [
      { uid: 'api::a.a', documentId: 'd1', locale: 'fr', status: 'success' },
      { uid: 'api::a.a', documentId: 'd2', locale: 'fr', status: 'failed', errorMessage: 'boom' },
    ]);

    const session = getState()!.sessions.find((s) => s.id === 's1')!;
    expect(session.attemptedEntries).toHaveLength(2);
    expect(session.attemptedEntries![1]).toMatchObject({
      uid: 'api::a.a',
      documentId: 'd2',
      locale: 'fr',
      status: 'failed',
      errorMessage: 'boom',
    });
  });

  it('no-ops (does not throw) when the session id is unknown', async () => {
    const seed: ActivityLogs = { sessions: [] };
    const { strapi, getState } = buildFakeStrapi(seed);
    const service = ActivityLogsService({ strapi });

    await expect(
      service.recordAttemptedEntry('does-not-exist', {
        uid: 'api::a.a',
        documentId: 'd1',
        locale: 'fr',
        status: 'success',
      })
    ).resolves.toBeUndefined();
    await expect(
      service.recordAttemptedEntries('does-not-exist', [
        { uid: 'api::a.a', documentId: 'd2', locale: 'fr', status: 'success' },
      ])
    ).resolves.toBeUndefined();
    expect(getState()!.sessions).toEqual([]);
  });

  it('serializes concurrent writers via the existing mutex (no lost updates)', async () => {
    const seed: ActivityLogs = {
      sessions: [
        {
          id: 's1',
          eventType: 'upload',
          status: 'in-progress',
          startedAt: 1,
          initiatedBy: 'tester',
          summary: '',
          entries: [],
        },
      ],
    };
    const { strapi, getState } = buildFakeStrapi(seed);
    const service = ActivityLogsService({ strapi });

    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        service.recordAttemptedEntry('s1', {
          uid: 'api::a.a',
          documentId: `d${i}`,
          locale: 'fr',
          status: 'success',
        })
      )
    );

    const session = getState()!.sessions.find((s) => s.id === 's1')!;
    expect(session.attemptedEntries).toHaveLength(10);
    const docIds = session.attemptedEntries!.map((e) => e.documentId).sort();
    expect(docIds).toEqual(Array.from({ length: 10 }, (_, i) => `d${i}`).sort());
  });

  it('caps the array at 5000 records per session and warns once', async () => {
    const seed: ActivityLogs = {
      sessions: [
        {
          id: 's1',
          eventType: 'upload',
          status: 'in-progress',
          startedAt: 1,
          initiatedBy: 'tester',
          summary: '',
          entries: [],
        },
      ],
    };
    const { strapi, warn, getState } = buildFakeStrapi(seed);
    const service = ActivityLogsService({ strapi });

    const big = Array.from({ length: 5050 }, (_, i) => ({
      uid: 'api::a.a',
      documentId: `d${i}`,
      locale: 'fr' as const,
      status: 'success' as const,
    }));
    await service.recordAttemptedEntries('s1', big);

    let session = getState()!.sessions.find((s) => s.id === 's1')!;
    expect(session.attemptedEntries).toHaveLength(5000);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0] as string).toContain('attemptedEntries cap');

    // Second batch should silently drop (no double-warn).
    await service.recordAttemptedEntries('s1', [
      { uid: 'api::a.a', documentId: 'extra', locale: 'fr', status: 'success' },
    ]);
    session = getState()!.sessions.find((s) => s.id === 's1')!;
    expect(session.attemptedEntries).toHaveLength(5000);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
