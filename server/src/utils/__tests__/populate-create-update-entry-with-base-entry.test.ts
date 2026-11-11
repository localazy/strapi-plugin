import { populateCreateUpdateEntryWithBaseEntry } from '../populate-create-update-entry-with-base-entry';

/**
 * Relations are resolved asynchronously (one document lookup each). The ones inside dynamic zone
 * items and repeatable components must be resolved before the populated entry is returned, or
 * they are written into the update payload while Strapi is already processing it.
 */

const uid = 'api::about.about';

const models = [
  { uid, attributes: { beats: { type: 'dynamiczone', components: ['about.timeline'] } } },
  {
    uid: 'about.timeline',
    attributes: {
      title: { type: 'string' },
      stops: { type: 'component', repeatable: true, component: 'about.stop' },
    },
  },
  {
    uid: 'about.stop',
    attributes: {
      label: { type: 'string' },
      glyph: { type: 'relation', relation: 'oneToOne', target: 'api::glyph.glyph' },
    },
  },
];

const baseEntry = {
  beats: [
    {
      __component: 'about.timeline',
      id: 3,
      title: 'Má cesta',
      stops: [
        { id: 10, label: 'Děčín', glyph: { id: 1, documentId: 'glyph-river' } },
        { id: 11, label: 'Krkonoše', glyph: { id: 2, documentId: 'glyph-mountain' } },
      ],
    },
  ],
};

const updateEntry = {
  beats: [
    {
      __component: 'about.timeline',
      title: 'My Journey',
      stops: [{ label: 'Děčín' }, { label: 'Krkonoše Mountains' }],
    },
  ],
};

describe('populateCreateUpdateEntryWithBaseEntry', () => {
  const originalDocuments = (global as any).strapi.documents;

  beforeEach(() => {
    (global as any).strapi.documents = jest.fn(() => ({
      // resolve on a later tick, like a database lookup
      findOne: jest.fn(({ documentId }) => new Promise((resolve) => setTimeout(() => resolve({ documentId }), 5))),
    }));
  });

  afterEach(() => {
    (global as any).strapi.documents = originalDocuments;
  });

  it('resolves relations inside repeatable components of dynamic zone items before returning', async () => {
    const populated = await populateCreateUpdateEntryWithBaseEntry(models, updateEntry, baseEntry, {}, uid, 'en');

    expect(populated.beats[0].stops[0]).toMatchObject({ label: 'Děčín', glyph: ['glyph-river'] });
    expect(populated.beats[0].stops[1]).toMatchObject({ label: 'Krkonoše Mountains', glyph: ['glyph-mountain'] });
  });
});
