import getPickedFlattenKeysForHookEntry from '../get-picked-flatten-keys-for-hook-entry';
import { getUploadKeysForEntries } from '../get-upload-keys-for-entries';

/**
 * The automated upload (on create/update) and deprecation (on delete) must send exactly the keys
 * the manual upload sends: blocks projected to their text leaves, dynamic zone fields included,
 * and entries excluded from translation left out.
 */

const uid = 'api::about.about';
const documentId = 'about-doc';

const models: Record<string, any> = {
  [uid]: {
    uid,
    collectionName: 'about',
    attributes: {
      title: { type: 'string' },
      story: { type: 'blocks' },
      meta: { type: 'json' },
      seo: { type: 'component', repeatable: false, component: 'shared.seo' },
      beats: { type: 'dynamiczone', components: ['about.hero', 'about.timeline'] },
    },
  },
  'shared.seo': { uid: 'shared.seo', attributes: { summary: { type: 'blocks' }, metaTitle: { type: 'string' } } },
  'about.hero': { uid: 'about.hero', attributes: { chapter: { type: 'string' }, line: { type: 'blocks' } } },
  'about.timeline': {
    uid: 'about.timeline',
    attributes: { stops: { type: 'component', repeatable: true, component: 'about.stop' } },
  },
  'about.stop': { uid: 'about.stop', attributes: { label: { type: 'string' }, notes: { type: 'blocks' } } },
};

const setupModel = {
  __model__: true,
  title: true,
  story: true,
  meta: true,
  seo: { summary: true, metaTitle: true },
  beats: [
    { __component__: 'about.hero', chapter: true, line: true },
    { __component__: 'about.timeline', stops: { label: true, notes: true } },
  ],
};

const paragraph = (...children: any[]) => ({ type: 'paragraph', children });
const entry = {
  documentId,
  locale: 'cs',
  title: 'O mně',
  story: [
    paragraph(
      { type: 'text', text: 'Ahoj ' },
      { type: 'text', text: 'světe', bold: true },
      { type: 'link', url: 'https://localazy.com', children: [{ type: 'text', text: 'odkaz' }] }
    ),
  ],
  meta: { og: { title: 'Titulek' } },
  seo: { id: 4, metaTitle: 'O mně | Web', summary: [paragraph({ type: 'text', text: 'Shrnutí' })] },
  beats: [
    { __component: 'about.hero', id: 1, chapter: 'Úvod', line: [paragraph({ type: 'text', text: 'Řádek' })] },
    {
      __component: 'about.timeline',
      id: 3,
      stops: [{ id: 10, label: 'Děčín', notes: [paragraph({ type: 'text', text: 'Odtud pocházím.' })] }],
    },
  ],
};

let excluded: string[] = [];

jest.mock('../../core', () => ({
  getPluginSettingsService: () => ({
    getContentTransferSetup: async () => ({ has_setup: true, setup: [{ about: setupModel }] }),
  }),
  getLocalazyUserService: () => ({ getUser: async () => ({ accessToken: 'token', project: { id: 'project' } }) }),
  getLocalazyPubAPIService: () => ({
    getProject: async () => ({ sourceLanguage: 1, languages: [{ id: 1, code: 'cs' }] }),
  }),
  getStrapiI18nService: () => ({ getLocales: async () => [{ code: 'cs', isDefault: true }] }),
  getEntryExclusionService: () => ({ getContentTypeExclusions: async () => excluded }),
}));

jest.mock('../../services/helpers/plugin-settings-service-helper', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    setup: async () => undefined,
    shouldAllowAutomatedCreatedTrigger: () => true,
    shouldAllowAutomatedUpdatedTrigger: () => true,
    shouldAllowDeprecateOnDeletion: () => true,
  })),
}));

describe('getPickedFlattenKeysForHookEntry', () => {
  const originalStrapi = { ...(global as any).strapi };

  beforeEach(() => {
    excluded = [];
    Object.assign((global as any).strapi, {
      documents: jest.fn(() => ({ findOne: jest.fn(async () => JSON.parse(JSON.stringify(entry))) })),
      getModel: (modelUid: string) => models[modelUid],
      contentTypes: { [uid]: models[uid] },
      components: Object.fromEntries(Object.entries(models).filter(([key]) => key !== uid)),
    });
  });

  afterEach(() => {
    Object.assign((global as any).strapi, originalStrapi);
  });

  const params = (action: string) => ({
    context: { action, contentType: { uid, collectionName: 'about' } } as any,
    documentId,
    locale: 'cs',
  });

  it.each(['create', 'update', 'delete'])('on %s, sends the same keys as the manual upload', async (action) => {
    const result = await getPickedFlattenKeysForHookEntry(params(action));

    const manualUploadKeys = getUploadKeysForEntries({
      entries: [entry],
      modelUid: uid,
      transferSetupModelProps: setupModel,
      getModel: (modelUid) => models[modelUid],
    });
    expect(result.pickedFlatten).toEqual(expect.objectContaining(manualUploadKeys));
    expect(Object.keys(result.pickedFlatten).filter((key) => !key.endsWith('[limit]'))).toEqual(
      Object.keys(manualUploadKeys)
    );

    expect(result.pickedFlatten).toMatchObject({
      [`${uid}[${documentId}].story[0].children[1].text`]: 'světe',
      [`${uid}[${documentId}].story[0].children[2].children[0].text`]: 'odkaz',
      [`${uid}[${documentId}].seo[4].summary[0].children[0].text`]: 'Shrnutí',
      [`${uid}[${documentId}].beats[1;about.hero].line[0].children[0].text`]: 'Řádek',
      [`${uid}[${documentId}].beats[3;about.timeline].stops[10].notes[0].children[0].text`]: 'Odtud pocházím.',
    });
    // blocks structure is never uploaded as text
    expect(Object.keys(result.pickedFlatten).some((key) => /\.(type|bold|url)$/.test(key))).toBe(false);
  });

  it('skips entries excluded from translation', async () => {
    excluded = [documentId];
    expect(await getPickedFlattenKeysForHookEntry(params('update'))).toBeUndefined();
  });
});
