import { getJsonFieldSegmentIndex } from '../../functions/should-set-downloaded-property';
import { collectDownloadedContent } from '../collect-downloaded-content';
import { parseLocalazyKey } from '../parse-localazy-key';
import { parsedLocalazyEntryToCreateEntry } from '../parsed-localazy-entry-to-create-entry';

/**
 * Regression cover for downloading json/blocks fields that are not alone at the top level of an
 * entry: two blocks fields in one component, and blocks inside components nested in a dynamic
 * zone. Shapes mirror a real Strapi 5 "About" single type.
 */

const uid = 'api::about.about';
const documentId = 'zi29ijoosccc2qg7a1tr7h3j';

const paragraph = (...children: Record<string, unknown>[]) => ({ type: 'paragraph', children });
const text = (value: string, marks: Record<string, unknown> = {}) => ({ type: 'text', text: value, ...marks });

const models = [
  {
    uid,
    collectionName: 'about',
    attributes: {
      beats: { type: 'dynamiczone', components: ['about.hero', 'about.timeline', 'about.today'] },
    },
  },
  {
    uid: 'about.hero',
    attributes: { chapter: { type: 'string' }, title: { type: 'blocks' }, line: { type: 'blocks' } },
  },
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
      notes: { type: 'blocks' },
      quote: { type: 'component', repeatable: false, component: 'about.quote' },
    },
  },
  { uid: 'about.quote', attributes: { text: { type: 'blocks' }, attribution: { type: 'string' } } },
  {
    uid: 'about.today',
    attributes: {
      bridge: { type: 'blocks' },
      counter: { type: 'blocks' },
      work: { type: 'component', repeatable: false, component: 'about.side' },
    },
  },
  { uid: 'about.side', attributes: { lead: { type: 'string' }, text: { type: 'blocks' }, aside: { type: 'blocks' } } },
];

// Content Transfer Setup as the plugin stores it for this model
const modelContentTransferSetup: any = {
  __model__: true,
  beats: [
    { __component__: 'about.hero', chapter: true, title: true, line: true },
    {
      __component__: 'about.timeline',
      title: true,
      stops: { label: true, notes: true, quote: { text: true, attribution: true } },
    },
    {
      __component__: 'about.today',
      bridge: true,
      counter: true,
      work: { lead: true, text: true, aside: true },
    },
  ],
};

// Source-locale entry (Czech) as read by the download service, with DB ids
const baseEntry = {
  documentId,
  beats: [
    {
      __component: 'about.hero',
      id: 1,
      chapter: 'Úvod',
      title: [paragraph(text('Jsem obklopen přírodou. '), text('Ztrácím pojem o čase.', { bold: true }))],
      line: [paragraph(text('Stav flow, který rád zažívám nejčastěji…'))],
    },
    {
      __component: 'about.timeline',
      id: 3,
      title: 'Komu za to vděčím?',
      stops: [
        { id: 10, label: 'Děčín', notes: [paragraph(text('Odtud pocházím.'))] },
        {
          id: 11,
          label: 'První fotoaparát',
          notes: [paragraph(text('Malý stříbrný Canon.'))],
          quote: { id: 7, text: [paragraph(text('Máš hezký sloh.'))], attribution: 'Mamka' },
        },
      ],
    },
    {
      __component: 'about.today',
      id: 2,
      bridge: [paragraph(text('Je třeba udržet rovnováhu.'))],
      counter: [paragraph(text('Práce mi umožňuje objevovat.'))],
      work: { id: 4, lead: 'Práce', text: [paragraph(text('Bavím se logikou.'))], aside: [paragraph(text('V týmu.'))] },
    },
  ],
};

// Downloaded English keys, in the order the upload produced them
const downloadedKeys: Record<string, string> = {
  'beats[1;about.hero].chapter': 'Introduction',
  'beats[1;about.hero].title[0].children[0].text': "I'm surrounded by nature. ",
  'beats[1;about.hero].title[0].children[1].text': 'I lose track of time.',
  'beats[1;about.hero].line[0].children[0].text': 'That flow state I love slipping into…',
  'beats[3;about.timeline].title': 'Who do I owe it to?',
  'beats[3;about.timeline].stops[10].label': 'Děčín',
  'beats[3;about.timeline].stops[10].notes[0].children[0].text': 'This is where I come from.',
  'beats[3;about.timeline].stops[11].label': 'My first camera',
  'beats[3;about.timeline].stops[11].notes[0].children[0].text': 'A small silver Canon.',
  'beats[3;about.timeline].stops[11].quote[7].text[0].children[0].text': 'You have a nice way with words.',
  'beats[3;about.timeline].stops[11].quote[7].attribution': 'Mum',
  'beats[2;about.today].bridge[0].children[0].text': 'It is about balance.',
  'beats[2;about.today].counter[0].children[0].text': 'My work lets me explore.',
  'beats[2;about.today].work[4].lead': 'Work',
  'beats[2;about.today].work[4].text[0].children[0].text': 'I enjoy logic.',
  'beats[2;about.today].work[4].aside[0].children[0].text': 'In the team.',
};

// the part of a key after the document id, as the download parses it
const parseRest = (key: string) => parseLocalazyKey(`${uid}[${documentId}].${key}`).rest;

const buildParsedContent = (keys: Record<string, string>) =>
  collectDownloadedContent({
    languages: [
      {
        isoStrapi: 'en',
        keys: Object.entries(keys).map(([key, value], index) => ({
          id: `k${index}`,
          key: [`${uid}[${documentId}].${key}`],
          value,
        })),
      },
    ],
    processedKeys: {},
    contentTransferSetup: { has_setup: true, setup: [{ about: modelContentTransferSetup }] },
    models,
    parseLocalazyKey,
  }).parsedLocalazyContent;

describe('getJsonFieldSegmentIndex', () => {
  it.each([
    ['beats[1;about.hero].title[0].children[0].text', 2],
    ['beats[1;about.hero].line[0].children[0].text', 2],
    ['beats[3;about.timeline].stops[10].notes[0].children[0].text', 4],
    ['beats[3;about.timeline].stops[11].quote[7].text[0].children[0].text', 6],
    ['beats[2;about.today].work[4].aside[0].children[0].text', 4],
  ])('finds the field segment of %s', (key, expected) => {
    expect(getJsonFieldSegmentIndex(modelContentTransferSetup, parseRest(key))).toBe(expected);
  });

  it('handles json fields outside dynamic zones, including inside components', () => {
    const setup: any = { __model__: true, meta: true, seo: { structuredData: true } };
    expect(getJsonFieldSegmentIndex(setup, parseRest('meta.author.name'))).toBe(0);
    expect(getJsonFieldSegmentIndex(setup, parseRest('seo[5].structuredData.items[0].label'))).toBe(2);
  });

  it('returns -1 for plain fields, disabled fields and unknown components', () => {
    expect(getJsonFieldSegmentIndex(modelContentTransferSetup, parseRest('beats[1;about.hero].chapter'))).toBe(-1);
    expect(getJsonFieldSegmentIndex(modelContentTransferSetup, parseRest('beats[9;about.gone].x[0].text'))).toBe(-1);
  });
});

describe('downloading json/blocks fields next to each other and inside nested components', () => {
  const parsed = buildParsedContent(downloadedKeys);
  const { createEntry } = parsedLocalazyEntryToCreateEntry(models, parsed['en'][uid][documentId], baseEntry, uid, 'en');
  const [hero, timeline, today] = createEntry.beats;

  it('keeps two blocks fields of one component apart', () => {
    expect(hero.title).toEqual([
      paragraph(text("I'm surrounded by nature. "), text('I lose track of time.', { bold: true })),
    ]);
    expect(today.bridge).toEqual([paragraph(text('It is about balance.'))]);
    expect(today.counter).toEqual([paragraph(text('My work lets me explore.'))]);
  });

  it('translates the second blocks field instead of leaving it in the source language', () => {
    expect(hero.line).toEqual([paragraph(text('That flow state I love slipping into…'))]);
  });

  it('writes blocks inside repeatable components nested in a dynamic zone, keeping their siblings', () => {
    expect(timeline.title).toBe('Who do I owe it to?');
    expect(timeline.stops).toHaveLength(2);
    expect(timeline.stops[0]).toMatchObject({ label: 'Děčín', notes: [paragraph(text('This is where I come from.'))] });
    expect(timeline.stops[1]).toMatchObject({
      label: 'My first camera',
      notes: [paragraph(text('A small silver Canon.'))],
      quote: { text: [paragraph(text('You have a nice way with words.'))], attribution: 'Mum' },
    });
  });

  it('writes blocks inside single components nested in a dynamic zone', () => {
    expect(today.work).toMatchObject({
      lead: 'Work',
      text: [paragraph(text('I enjoy logic.'))],
      aside: [paragraph(text('In the team.'))],
    });
  });
});
