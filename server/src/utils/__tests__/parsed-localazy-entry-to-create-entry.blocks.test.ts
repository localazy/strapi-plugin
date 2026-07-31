import { parsedLocalazyEntryToCreateEntry } from '../parsed-localazy-entry-to-create-entry';

const uid = 'api::article.article';

const sourceStory = [
  { type: 'heading', level: 2, children: [{ text: 'Title', bold: true }] },
  {
    type: 'paragraph',
    children: [{ text: 'Hello ' }, { type: 'link', url: 'https://localazy.com', children: [{ text: 'world' }] }],
  },
];

const models = [
  {
    uid,
    attributes: {
      title: { type: 'string' },
      story: { type: 'blocks' },
    },
  },
];

describe('parsedLocalazyEntryToCreateEntry — blocks download wiring', () => {
  it('overlays the translated text skeleton onto the source AST, keeping structure and formatting', () => {
    // Shape produced by the download JSON accumulation: numeric-string positions, text-only leaves.
    const translatedModel = {
      title: 'Titre',
      story: {
        '0': { children: [{ text: 'Titre du bloc' }] },
        '1': {
          children: [{ text: 'Bonjour ' }, { children: [{ text: 'monde' }] }],
        },
      },
    };
    const baseEntry = { title: 'Post', story: sourceStory };

    const { createEntry } = parsedLocalazyEntryToCreateEntry(models, translatedModel, baseEntry, uid, 'fr');

    expect(createEntry.title).toBe('Titre');
    expect(createEntry.story).toEqual([
      { type: 'heading', level: 2, children: [{ text: 'Titre du bloc', bold: true }] },
      {
        type: 'paragraph',
        children: [{ text: 'Bonjour ' }, { type: 'link', url: 'https://localazy.com', children: [{ text: 'monde' }] }],
      },
    ]);
    expect(createEntry.locale).toBe('fr');
  });

  it('round-trips byte-identically when the translation equals the source', () => {
    const translatedModel = {
      story: {
        '0': { children: [{ text: 'Title' }] },
        '1': { children: [{ text: 'Hello ' }, { children: [{ text: 'world' }] }] },
      },
    };
    const baseEntry = { story: sourceStory };

    const { createEntry } = parsedLocalazyEntryToCreateEntry(models, translatedModel, baseEntry, uid);

    expect(createEntry.story).toEqual(sourceStory);
  });

  it('skips a blocks field with no source AST rather than writing an invalid document', () => {
    const translatedModel = { story: { '0': { children: [{ text: 'Titre' }] } } };
    const baseEntry = { title: 'Post' }; // no source story

    const { createEntry } = parsedLocalazyEntryToCreateEntry(models, translatedModel, baseEntry, uid);

    expect(createEntry.story).toBeUndefined();
  });
});
