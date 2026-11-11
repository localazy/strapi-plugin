import { set } from 'lodash-es';
import { flattenObject } from '../flatten-object';
import { parseLocalazyKey } from '../parse-localazy-key';
import { overlayJsonTranslation } from '../overlay-json-translation';
import {
  locateDownloadedField,
  ShouldSetDownloadedPropertyReturnType,
} from '../../functions/should-set-downloaded-property';

/** Upload a json value the way the plugin does, translate every string, and rebuild it. */
const roundTrip = (source: any, translate: (text: string) => string) => {
  const flat = flattenObject({ 'api::x.x': { documentId: 'doc', data: source } });
  const translated: any = {};
  for (const [key, value] of Object.entries<any>(flat)) {
    const { rest } = parseLocalazyKey(key);
    // rest[0] is the field (`data`); the leaf path inside the value follows
    set(translated, rest.slice(1), typeof value === 'string' ? translate(value) : value);
  }
  return overlayJsonTranslation(source, translated);
};

const EN = (text: string) => `EN ${text}`;

describe('overlayJsonTranslation', () => {
  it.each([
    ['a nested object', { og: { title: 'Titulek' }, count: 3, active: true, none: null }],
    ['numeric keys', { years: { '2024': 'Rok cest', '2025': 'Rok doma' } }],
    ['objects with ids', { author: { id: 7, name: 'Autor' } }],
    ['array items with ids', [{ id: 5, label: 'Instagram' }, { label: 'Kontakt' }, { documentId: 'x1', label: 'Web' }]],
    ['a top-level array of strings', ['příroda', 'fotografie']],
    ['nested arrays', { matrix: [['a', 'b'], ['c']] }],
    ['an object with its own id', { id: 9, title: 'Titulek', items: [{ text: 'Položka' }] }],
  ])('rebuilds %s with the same shape and every string translated', (_, source) => {
    const expected = JSON.parse(
      JSON.stringify(source, (key, value) =>
        typeof value === 'string' && !['documentId'].includes(key) ? EN(value) : value
      )
    );
    expect(roundTrip(source, EN)).toEqual(expected);
  });

  it('keeps the source text for untranslated leaves and ignores leaves no longer in the source', () => {
    const source = { og: { title: 'Titulek', description: 'Popis' }, links: [{ label: 'A' }] };
    const translated = {
      og: { title: 'Title', removed: 'X' },
      links: { '0': { label: 'A2' }, '3': { label: 'gone' } },
    };

    expect(overlayJsonTranslation(source, translated)).toEqual({
      og: { title: 'Title', description: 'Popis' },
      links: [{ label: 'A2' }],
    });
  });

  it('returns undefined without a source value, and never translates non-strings', () => {
    expect(overlayJsonTranslation(undefined, { a: 'x' })).toBeUndefined();
    expect(overlayJsonTranslation(null, { a: 'x' })).toBeUndefined();
    expect(overlayJsonTranslation({ n: 1, b: false }, { n: '2', b: 'true' })).toEqual({ n: 1, b: false });
  });
});

describe('locateDownloadedField', () => {
  const setup: any = { __model__: true, title: true, tags: true, meta: true, seo: { data: true, title: true } };
  const rest = (key: string) => parseLocalazyKey(`api::x.x[doc].${key}`).rest;

  it.each([
    ['title', ShouldSetDownloadedPropertyReturnType.YES, 0],
    ['seo[3].title', ShouldSetDownloadedPropertyReturnType.YES, 2],
    ['tags[0]', ShouldSetDownloadedPropertyReturnType.JSON, 0],
    ['meta.years.2024', ShouldSetDownloadedPropertyReturnType.JSON, 0],
    ['meta.author[7].name', ShouldSetDownloadedPropertyReturnType.JSON, 0],
    ['seo[3].data.items[0].label', ShouldSetDownloadedPropertyReturnType.JSON, 2],
    ['unknown', ShouldSetDownloadedPropertyReturnType.NO, -1],
  ])('%s → %s', (key, type, fieldSegmentIndex) => {
    expect(locateDownloadedField(setup, rest(key))).toEqual({ type, fieldSegmentIndex });
  });

  it('finds nothing for a model without setup', () => {
    expect(locateDownloadedField({ __model__: false } as any, rest('title')).type).toBe(
      ShouldSetDownloadedPropertyReturnType.NO
    );
  });
});
