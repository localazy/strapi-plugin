import { cloneDeep, isPlainObject } from 'lodash-es';
import { projectBlocksFields } from '../blocks-to-translatable';
import { flattenObject } from '../flatten-object';
import { pickEntries } from '../pick-entries';
import { getPickPathsWithComponents } from '../transfer-setup-utils';
import { collectDownloadedContent, DownloadedLocalazyKey } from '../collect-downloaded-content';
import { buildLocalizedCreateEntry } from '../build-localized-create-entry';
import { parsedLocalazyEntryToUpdateEntry } from '../parsed-localazy-entry-to-update-entry';
import { parseLocalazyKey } from '../parse-localazy-key';

/**
 * Upload → translate → download round trip through the plugin's own transforms, for a schema
 * that puts json and blocks fields everywhere Strapi allows them: top level (two side by side),
 * single and repeatable components, components nested in components, dynamic zones, and
 * repeatable components nested in dynamic zone items. The expected result comes from an
 * independent walk over the schema (`translateBySetup`), not from the plugin code.
 */

const uid = 'api::page.page';
const documentId = 'page-doc-1';

// ---------------------------------------------------------------------------------------------
// Schema, Content Transfer Setup and source entry
// ---------------------------------------------------------------------------------------------

const models: any[] = [
  {
    uid,
    collectionName: 'pages',
    pluginOptions: { i18n: { localized: true } },
    attributes: {
      slug: { type: 'uid' },
      title: { type: 'string' },
      intro: { type: 'blocks' },
      body: { type: 'blocks' },
      meta: { type: 'json' },
      links: { type: 'json' },
      tags: { type: 'json' },
      seo: { type: 'component', repeatable: false, component: 'shared.seo' },
      faqs: { type: 'component', repeatable: true, component: 'shared.faq' },
      sections: {
        type: 'dynamiczone',
        components: ['sections.hero', 'sections.timeline', 'sections.gallery'],
      },
    },
  },
  { uid: 'shared.seo', attributes: { metaTitle: { type: 'string' }, summary: { type: 'blocks' } } },
  {
    uid: 'shared.faq',
    attributes: {
      question: { type: 'string' },
      answer: { type: 'blocks' },
      note: { type: 'component', repeatable: false, component: 'shared.note' },
    },
  },
  { uid: 'shared.note', attributes: { text: { type: 'blocks' }, author: { type: 'string' } } },
  {
    uid: 'sections.hero',
    attributes: { eyebrow: { type: 'string' }, heading: { type: 'blocks' }, line: { type: 'blocks' } },
  },
  {
    uid: 'sections.timeline',
    attributes: {
      title: { type: 'string' },
      stops: { type: 'component', repeatable: true, component: 'sections.stop' },
    },
  },
  {
    uid: 'sections.stop',
    attributes: {
      label: { type: 'string' },
      notes: { type: 'blocks' },
      quote: { type: 'component', repeatable: false, component: 'sections.quote' },
      glyph: { type: 'relation', relation: 'oneToOne', target: 'api::glyph.glyph' },
    },
  },
  { uid: 'sections.quote', attributes: { text: { type: 'blocks' }, attribution: { type: 'string' } } },
  {
    uid: 'sections.gallery',
    attributes: { items: { type: 'component', repeatable: true, component: 'sections.item' } },
  },
  { uid: 'sections.item', attributes: { caption: { type: 'string' }, alt: { type: 'string' } } },
];

const setupModel: any = {
  __model__: true,
  slug: null,
  title: true,
  intro: true,
  body: true,
  meta: true,
  links: true,
  tags: true,
  seo: { metaTitle: true, summary: true },
  faqs: { question: true, answer: true, note: { text: true, author: true } },
  sections: [
    { __component__: 'sections.hero', eyebrow: true, heading: true, line: true },
    {
      __component__: 'sections.timeline',
      title: true,
      stops: { label: true, notes: true, quote: { text: true, attribution: true }, glyph: null },
    },
    { __component__: 'sections.gallery', items: { caption: true, alt: true } },
  ],
};
const contentTransferSetup = { has_setup: true, setup: [{ pages: setupModel }] };

const t = (type: string, text: string, marks: Record<string, unknown> = {}) => ({ type, text, ...marks });
const p = (...children: any[]) => ({ type: 'paragraph', children });

const buildSourceEntry = () => ({
  documentId,
  locale: 'cs',
  slug: 'o-mne',
  title: 'O mně',
  intro: [
    { type: 'heading', level: 2, children: [t('text', 'Nadpis úvodu')] },
    p(t('text', 'Jsem obklopen přírodou. '), t('text', 'Ztrácím pojem o čase.', { bold: true })),
    p(t('text', 'Druhý odstavec.')),
  ],
  body: [
    p(
      t('text', 'Více na '),
      { type: 'link', url: 'https://localazy.com', children: [t('text', 'Localazy')] },
      t('text', ' a jinde.')
    ),
    {
      type: 'list',
      format: 'unordered',
      children: [
        { type: 'list-item', children: [t('text', 'První bod')] },
        { type: 'list-item', children: [t('text', 'Druhý bod', { italic: true })] },
      ],
    },
    { type: 'quote', children: [t('text', 'Citát v těle.')] },
    { type: 'image', image: { url: '/uploads/a.jpg', alternativeText: 'a' }, children: [t('text', '')] },
  ],
  meta: {
    keywords: ['příroda', 'fotografie'],
    og: { title: 'Sdílený titulek' },
    years: { '2024': 'Rok cest', '2025': 'Rok doma' }, // numeric keys stay object keys
    author: { id: 7, name: 'Autor', active: true }, // flattened as `author[7].name`
    count: 3,
  },
  links: [{ id: 5, label: 'Instagram', url: 'https://instagram.com' }, { label: 'Kontakt' }], // `links[5]`, `links[1]`
  tags: ['příroda', 'fotografie'],
  seo: { id: 91, metaTitle: 'O mně | Web', summary: [p(t('text', 'Shrnutí stránky.'))] },
  faqs: [
    {
      id: 31,
      question: 'Proč?',
      answer: [p(t('text', 'Protože '), t('text', 'chci.', { bold: true }))],
      note: { id: 51, text: [p(t('text', 'Poznámka k otázce.'))], author: 'Autor' },
    },
    { id: 32, question: 'Kdy?', answer: [p(t('text', 'Brzy.'))] },
  ],
  sections: [
    {
      __component: 'sections.hero',
      id: 7,
      eyebrow: 'Úvod',
      heading: [p(t('text', 'Jsem obklopen přírodou. '), t('text', 'Ztrácím pojem o čase.', { bold: true }))],
      line: [p(t('text', 'Stav flow, který rád zažívám…'))],
    },
    {
      __component: 'sections.timeline',
      id: 3,
      title: 'Má cesta',
      stops: [
        { id: 10, label: 'Děčín', notes: [p(t('text', 'Odtud pocházím.'))], glyph: { id: 1, documentId: 'g-river' } },
        {
          id: 11,
          label: 'První fotoaparát',
          notes: [p(t('text', 'Malý stříbrný Canon.')), p(t('text', 'Druhý odstavec poznámek.'))],
          quote: { id: 70, text: [p(t('text', 'Máš hezký sloh.'))], attribution: 'Mamka' },
          glyph: { id: 2, documentId: 'g-camera' },
        },
        { id: 12, label: 'Krkonoše', notes: [p(t('text', 'Sem mě brávala babička.'))], glyph: null },
      ],
    },
    {
      __component: 'sections.gallery',
      id: 4,
      items: [
        { id: 20, caption: 'První fotka', alt: 'popis 1' },
        { id: 21, caption: '', alt: '' }, // nothing to translate in this item
        { id: 22, caption: 'Třetí fotka', alt: 'popis 3' },
      ],
    },
  ],
});

// ---------------------------------------------------------------------------------------------
// Independent oracle: translate every string the setup enables, walking the schema
// ---------------------------------------------------------------------------------------------

const getModel = (modelUid: string) => models.find((model) => model.uid === modelUid);

const mapStrings = (value: any, fn: (text: string) => string): any => {
  if (typeof value === 'string') return value ? fn(value) : value;
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, fn));
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, fn)]));
  return value;
};

const mapBlocksText = (nodes: any[], fn: (text: string) => string): any[] =>
  nodes.map((node) => {
    const mapped = { ...node };
    if (typeof node.text === 'string' && node.text) mapped.text = fn(node.text);
    if (Array.isArray(node.children)) mapped.children = mapBlocksText(node.children, fn);
    return mapped;
  });

const translateBySetup = (value: any, model: any, setup: any, fn: (text: string) => string): any => {
  if (!value) return value;
  const result = { ...value };
  for (const [name, attribute] of Object.entries<any>(model.attributes)) {
    const fieldSetup = setup?.[name];
    const fieldValue = value[name];
    if (!fieldSetup || fieldValue === undefined || fieldValue === null) continue;
    if (attribute.type === 'blocks') result[name] = mapBlocksText(fieldValue, fn);
    else if (attribute.type === 'json') result[name] = mapStrings(fieldValue, fn);
    else if (attribute.type === 'component') {
      const componentModel = getModel(attribute.component);
      result[name] = attribute.repeatable
        ? fieldValue.map((item) => translateBySetup(item, componentModel, fieldSetup, fn))
        : translateBySetup(fieldValue, componentModel, fieldSetup, fn);
    } else if (attribute.type === 'dynamiczone') {
      result[name] = fieldValue.map((item) =>
        translateBySetup(
          item,
          getModel(item.__component),
          fieldSetup.find((c) => c.__component__ === item.__component),
          fn
        )
      );
    } else if (fieldSetup === true && typeof fieldValue === 'string') {
      result[name] = fieldValue ? fn(fieldValue) : fieldValue;
    }
  }
  return result;
};

const IGNORED_KEYS = ['id', 'documentId', 'locale', 'localizations', 'glyph', '__component', 'publishedAt'];
const normalize = (value: any): any => {
  if (Array.isArray(value)) return value.map(normalize);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !IGNORED_KEYS.includes(key))
        .map(([key, v]) => [key, normalize(v)])
    );
  }
  return value;
};

// ---------------------------------------------------------------------------------------------
// Pipeline: the plugin's upload transforms, a fake Localazy, the plugin's download transforms
// ---------------------------------------------------------------------------------------------

const upload = (sourceEntry: any): Record<string, string> => {
  const projected = projectBlocksFields(sourceEntry, getModel(uid), getModel);
  const flat = flattenObject({ [uid]: projected });
  const pickPaths = getPickPathsWithComponents(setupModel).map((path) => `${uid}.${path}`);
  const picked = pickEntries(flat, pickPaths);
  // Localazy stores no empty source strings
  return Object.fromEntries(Object.entries(picked).filter(([, v]) => typeof v === 'string' && v !== '')) as any;
};

const toLocalazyKeys = (uploaded: Record<string, string>, translate: (key: string, value: string) => string) =>
  Object.entries(uploaded).map(
    ([key, value], index): DownloadedLocalazyKey => ({
      id: `k${index}:${key}`,
      key: [key],
      value: translate(key, value),
    })
  );

const download = (keys: DownloadedLocalazyKey[], processedKeys: Record<string, Record<string, number>> = {}) =>
  collectDownloadedContent({
    languages: [{ isoStrapi: 'en', keys }],
    processedKeys,
    contentTransferSetup,
    models,
    parseLocalazyKey,
  });

const EN = (text: string) => `[en] ${text}`;

// The localized entry as Strapi stores it: same structure, its own component ids
const reId = (value: any, offset = 1000): any => {
  if (Array.isArray(value)) return value.map((item) => reId(item, offset));
  if (isPlainObject(value)) {
    const result = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, reId(v, offset)]));
    if (typeof value.id === 'number' && !value.documentId) result.id = value.id + offset;
    return result;
  }
  return value;
};

const update = async (translatedModel: any, currentEntry: any, sourceEntry: any) =>
  parsedLocalazyEntryToUpdateEntry(models, translatedModel, currentEntry, currentEntry, sourceEntry, uid, 'en');

describe('transfer round trip (upload → translate → download)', () => {
  const originalDocuments = (global as any).strapi.documents;

  beforeEach(() => {
    // relation lookups resolve on a later tick, like the database
    (global as any).strapi.documents = jest.fn(() => ({
      findOne: jest.fn(
        ({ documentId: id }) => new Promise((resolve) => setTimeout(() => resolve({ documentId: id }), 2))
      ),
    }));
  });

  afterEach(() => {
    (global as any).strapi.documents = originalDocuments;
  });

  it('uploads exactly one key per translatable leaf, wherever the field lives', () => {
    const keys = Object.keys(upload(buildSourceEntry()));
    expect(keys).toEqual(
      expect.arrayContaining([
        `${uid}[${documentId}].intro[1].children[1].text`,
        `${uid}[${documentId}].body[0].children[1].children[0].text`,
        `${uid}[${documentId}].meta.og.title`,
        `${uid}[${documentId}].seo[91].summary[0].children[0].text`,
        `${uid}[${documentId}].faqs[31].note[51].text[0].children[0].text`,
        `${uid}[${documentId}].sections[7;sections.hero].line[0].children[0].text`,
        `${uid}[${documentId}].sections[3;sections.timeline].stops[11].quote[70].text[0].children[0].text`,
        `${uid}[${documentId}].sections[4;sections.gallery].items[22].alt`,
      ])
    );
    expect(keys.some((key) => key.includes('.slug'))).toBe(false);
    expect(keys.some((key) => key.includes('items[21]'))).toBe(false);
  });

  it('creates a localization with every leaf translated in place and the structure untouched', () => {
    const source = buildSourceEntry();
    const { parsedLocalazyContent } = download(toLocalazyKeys(upload(source), (_, value) => EN(value)));

    const created = buildLocalizedCreateEntry(models, parsedLocalazyContent.en[uid][documentId], source, uid, 'en');

    expect(normalize(created)).toEqual(normalize(translateBySetup(source, getModel(uid), setupModel, EN)));
    expect(created.sections.map((s) => s.__component)).toEqual(source.sections.map((s) => s.__component));
  });

  it('updates an existing localization to the same result, keeping relations', async () => {
    const source = buildSourceEntry();
    const expected = translateBySetup(source, getModel(uid), setupModel, EN);
    const current = reId(cloneDeep(expected));
    const { parsedLocalazyContent } = download(toLocalazyKeys(upload(source), (_, value) => EN(value)));

    const updated = await update(parsedLocalazyContent.en[uid][documentId], current, source);

    expect(normalize(updated)).toEqual(normalize(expected));
    expect(updated.sections[1].stops.map((stop) => stop.glyph)).toEqual([['g-river'], ['g-camera'], null]);
  });

  it('incremental: rewrites only what changed, keeping every other translation and item in place', async () => {
    const source = buildSourceEntry();
    const expected = translateBySetup(source, getModel(uid), setupModel, EN);
    const current = reId(cloneDeep(expected));

    const changedKeys = [
      `${uid}[${documentId}].sections[3;sections.timeline].stops[11].notes[1].children[0].text`,
      `${uid}[${documentId}].sections[3;sections.timeline].stops[12].label`,
      `${uid}[${documentId}].sections[4;sections.gallery].items[22].caption`,
      `${uid}[${documentId}].intro[1].children[0].text`,
    ];
    const keys = toLocalazyKeys(upload(source), (key, value) =>
      changedKeys.includes(key) ? `[en v2] ${value}` : EN(value)
    );
    // everything was downloaded before at event 1; the changed keys are at event 2 now
    const processedKeys = { en: Object.fromEntries(keys.map((key) => [key.id, 1])) };
    keys.forEach((key) => (key.event = changedKeys.includes(key.key[0]) ? 2 : 1));

    const { parsedLocalazyContent } = download(keys, processedKeys);
    const updated = await update(parsedLocalazyContent.en[uid][documentId], current, source);

    const v2 = cloneDeep(expected);
    v2.sections[1].stops[1].notes[1].children[0].text = '[en v2] Druhý odstavec poznámek.';
    v2.sections[1].stops[2].label = '[en v2] Krkonoše';
    v2.sections[2].items[2].caption = '[en v2] Třetí fotka';
    v2.intro[1].children[0].text = '[en v2] Jsem obklopen přírodou. ';
    expect(normalize(updated)).toEqual(normalize(v2));
  });

  it('keeps languages apart when several are downloaded at once', () => {
    const source = buildSourceEntry();
    const uploaded = upload(source);
    const PL = (text: string) => `[pl] ${text}`;
    const { parsedLocalazyContent } = collectDownloadedContent({
      languages: [
        { isoStrapi: 'en', keys: toLocalazyKeys(uploaded, (_, value) => EN(value)) },
        { isoStrapi: 'pl', keys: toLocalazyKeys(uploaded, (_, value) => PL(value)) },
      ],
      processedKeys: {},
      contentTransferSetup,
      models,
      parseLocalazyKey,
    });

    for (const [iso, fn] of [
      ['en', EN],
      ['pl', PL],
    ] as const) {
      const created = buildLocalizedCreateEntry(models, parsedLocalazyContent[iso][uid][documentId], source, uid, iso);
      expect(normalize(created)).toEqual(normalize(translateBySetup(source, getModel(uid), setupModel, fn)));
    }
  });

  it('incremental: an untouched entry is not rewritten at all', () => {
    const source = buildSourceEntry();
    const keys = toLocalazyKeys(upload(source), (_, value) => EN(value)).map((key) => ({ ...key, event: 1 }));
    const processedKeys = { en: Object.fromEntries(keys.map((key) => [key.id, 1])) };

    const { parsedLocalazyContent, entryKeySourceMap } = download(keys, processedKeys);

    expect(parsedLocalazyContent).toEqual({});
    expect(entryKeySourceMap).toEqual({});
  });

  it('follows source structure changes (marks, removed paragraphs) when updating', async () => {
    const before = buildSourceEntry();
    const current = reId(translateBySetup(before, getModel(uid), setupModel, EN));

    const source = buildSourceEntry();
    delete (source.intro[1].children[1] as any).bold; // bold dropped in the source
    source.intro.pop(); // last paragraph deleted in the source
    source.sections[1].stops[1].notes.pop(); // a paragraph deleted inside a nested component

    const { parsedLocalazyContent } = download(toLocalazyKeys(upload(source), (_, value) => EN(value)));
    const updated = await update(parsedLocalazyContent.en[uid][documentId], current, source);

    expect(normalize(updated)).toEqual(normalize(translateBySetup(source, getModel(uid), setupModel, EN)));
  });

  it('ignores keys still active in Localazy for content removed from the source', () => {
    const source = buildSourceEntry();
    const uploaded = upload(source);
    const stale = {
      [`${uid}[${documentId}].links[9].label`]: 'Odstraněný odkaz',
      [`${uid}[${documentId}].meta.og.description`]: 'Odstraněný popis',
      [`${uid}[${documentId}].intro[7].children[0].text`]: 'Odstraněný odstavec',
      [`${uid}[${documentId}].sections[3;sections.timeline].stops[99].label`]: 'Odstraněná zastávka',
      [`${uid}[${documentId}].sections[42;sections.hero].eyebrow`]: 'Odstraněná sekce',
    };
    const { parsedLocalazyContent } = download(toLocalazyKeys({ ...uploaded, ...stale }, (_, value) => EN(value)));

    const created = buildLocalizedCreateEntry(models, parsedLocalazyContent.en[uid][documentId], source, uid, 'en');

    expect(normalize(created)).toEqual(normalize(translateBySetup(source, getModel(uid), setupModel, EN)));
  });

  it('rebuilds lists whose layout changed in the source (dynamic zone item removed, stop inserted)', async () => {
    const before = buildSourceEntry();
    const current = reId(translateBySetup(before, getModel(uid), setupModel, EN));

    const source = buildSourceEntry();
    source.sections.shift(); // the hero is removed: the timeline is now first
    source.sections[0].stops.splice(1, 0, {
      id: 13,
      label: 'Nová zastávka',
      notes: [p(t('text', 'Vložená poznámka.'))],
      glyph: { id: 3, documentId: 'g-new' },
    } as any);

    const { parsedLocalazyContent } = download(toLocalazyKeys(upload(source), (_, value) => EN(value)));
    const updated = await update(parsedLocalazyContent.en[uid][documentId], current, source);

    expect(normalize(updated)).toEqual(normalize(translateBySetup(source, getModel(uid), setupModel, EN)));
    expect(updated.sections.map((s) => s.__component)).toEqual(['sections.timeline', 'sections.gallery']);
    // rebuilt items are new components: no ids of the source locale's components
    expect(updated.sections.every((s) => s.id === undefined)).toBe(true);
    expect(updated.sections[0].stops.map((stop) => stop.glyph)).toEqual([['g-river'], ['g-new'], ['g-camera'], null]);
  });

  it('incremental after a reorder in the source: every stop gets its own translation', async () => {
    const before = buildSourceEntry();
    const current = reId(translateBySetup(before, getModel(uid), setupModel, EN));

    const source = buildSourceEntry();
    const [river, camera, mountains] = source.sections[1].stops;
    source.sections[1].stops = [mountains, river, camera];

    // only the river stop's label changed since the last download
    const changedKey = `${uid}[${documentId}].sections[3;sections.timeline].stops[10].label`;
    const keys = toLocalazyKeys(upload(source), (key, value) => (key === changedKey ? `[en v2] ${value}` : EN(value)));
    const processedKeys = { en: Object.fromEntries(keys.map((key) => [key.id, 1])) };
    keys.forEach((key) => (key.event = key.key[0] === changedKey ? 2 : 1));

    const { parsedLocalazyContent } = download(keys, processedKeys);
    const updated = await update(parsedLocalazyContent.en[uid][documentId], current, source);

    const stops = updated.sections[1].stops;
    expect(stops.map((stop) => stop.label)).toEqual(['[en] Krkonoše', '[en v2] Děčín', '[en] První fotoaparát']);
    expect(stops.map((stop) => normalize(stop.notes))).toEqual(
      [mountains, river, camera].map((stop) => normalize(mapBlocksText(stop.notes, EN)))
    );
    // relations set in the source follow the source; a stop without one keeps whatever its localized
    // slot had (the plugin never clears localized relations), as a same-length reorder is undetectable
    expect(stops.slice(1).map((stop) => stop.glyph)).toEqual([['g-river'], ['g-camera']]);
  });

  it('writes json arrays as arrays even when the localization has none yet', async () => {
    const source = buildSourceEntry();
    const current = reId(translateBySetup(source, getModel(uid), setupModel, EN));
    current.links = null;
    current.tags = [];

    const { parsedLocalazyContent } = download(toLocalazyKeys(upload(source), (_, value) => EN(value)));
    const updated = await update(parsedLocalazyContent.en[uid][documentId], current, source);

    expect(Object.keys(updated.links)).toEqual(['0', '1']);
    expect(Object.keys(updated.tags)).toEqual(['0', '1']);
    expect(updated.links).toEqual(translateBySetup(source, getModel(uid), setupModel, EN).links);
    expect(updated.tags).toEqual(['[en] příroda', '[en] fotografie']);
  });
});
