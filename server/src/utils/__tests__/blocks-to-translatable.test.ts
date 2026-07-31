import { cloneDeep } from 'lodash-es';
import { projectBlocksFields, projectBlocksValue, overlayBlocksTranslation } from '../blocks-to-translatable';

// A source AST that exercises every structural case the AC calls out:
// marks, links, headings, nested lists, images, quotes and code blocks.
const sourceAst = [
  {
    type: 'heading',
    level: 2,
    children: [{ text: 'Title', bold: true }],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Hello ' },
      { text: 'brave', italic: true },
      { type: 'link', url: 'https://localazy.com', children: [{ text: 'world' }] },
    ],
  },
  {
    type: 'list',
    format: 'unordered',
    children: [
      { type: 'list-item', children: [{ text: 'first' }] },
      {
        type: 'list-item',
        children: [
          { text: 'second' },
          {
            type: 'list',
            format: 'ordered',
            children: [{ type: 'list-item', children: [{ text: 'nested' }] }],
          },
        ],
      },
    ],
  },
  {
    type: 'image',
    image: { url: 'https://cdn.example/pic.png', alternativeText: 'pic', documentId: 'abc' },
    children: [{ text: '' }],
  },
  {
    type: 'quote',
    children: [{ text: 'quoted' }],
  },
  {
    type: 'code',
    children: [{ text: 'const a = 1;' }],
  },
];

// Turn a projected skeleton into a "translated" one by mapping every text leaf through `fn`.
const translateSkeleton = (nodes: any, fn: (text: string) => string): any =>
  nodes.map((node: any) => {
    const next: any = {};
    if (typeof node.text === 'string') {
      next.text = fn(node.text);
    }
    if (Array.isArray(node.children)) {
      next.children = translateSkeleton(node.children, fn);
    }
    return next;
  });

const collectTexts = (nodes: any[]): string[] =>
  nodes.flatMap((node) => [
    ...(typeof node.text === 'string' ? [node.text] : []),
    ...(Array.isArray(node.children) ? collectTexts(node.children) : []),
  ]);

describe('blocks-to-translatable', () => {
  describe('projectBlocksValue', () => {
    it('keeps only text leaves and their nesting, dropping all structure and formatting', () => {
      const skeleton = projectBlocksValue(sourceAst);
      const serialized = JSON.stringify(skeleton);

      // structure / formatting must NOT leak into the translatable payload
      expect(serialized).not.toContain('bold');
      expect(serialized).not.toContain('italic');
      expect(serialized).not.toContain('heading');
      expect(serialized).not.toContain('url');
      expect(serialized).not.toContain('localazy.com');
      expect(serialized).not.toContain('level');

      // every translatable text leaf survives, in order
      expect(collectTexts(skeleton)).toEqual([
        'Title',
        'Hello ',
        'brave',
        'world',
        'first',
        'second',
        'nested',
        '',
        'quoted',
        'const a = 1;',
      ]);
    });

    it('projects a structural node with no text into an empty node (no segment)', () => {
      const skeleton = projectBlocksValue([{ type: 'thematic-break' }]);
      expect(skeleton).toEqual([{}]);
    });

    it('passes through non-array input untouched', () => {
      expect(projectBlocksValue(null)).toBeNull();
    });
  });

  describe('projectBlocksFields', () => {
    it('projects a top-level blocks field and leaves other fields untouched', () => {
      const model = { attributes: { title: { type: 'string' }, story: { type: 'blocks' } } };
      const entry = { title: 'Post', story: sourceAst };

      const result = projectBlocksFields(entry, model, () => undefined);

      expect(result.title).toBe('Post');
      expect(JSON.stringify(result.story)).not.toContain('bold');
      expect(collectTexts(result.story)).toContain('Title');
    });

    it('does not mutate the source entry', () => {
      const model = { attributes: { story: { type: 'blocks' } } };
      const entry = { story: sourceAst };
      const before = cloneDeep(entry);

      projectBlocksFields(entry, model, () => undefined);

      expect(entry).toEqual(before);
    });

    it('skips null and undefined blocks values', () => {
      const model = { attributes: { story: { type: 'blocks' } } };
      expect(projectBlocksFields({ story: null }, model, () => undefined)).toEqual({ story: null });
      expect(projectBlocksFields({}, model, () => undefined)).toEqual({});
    });

    it('projects blocks nested inside a repeatable component', () => {
      const getModel = (uid: string) =>
        uid === 'basic.section' ? { attributes: { body: { type: 'blocks' } } } : undefined;
      const model = {
        attributes: { sections: { type: 'component', component: 'basic.section', repeatable: true } },
      };
      const entry = { sections: [{ id: 1, body: sourceAst }] };

      const result = projectBlocksFields(entry, model, getModel);

      expect(JSON.stringify(result.sections[0].body)).not.toContain('bold');
      expect(collectTexts(result.sections[0].body)).toContain('Title');
    });

    it('projects blocks nested inside a dynamic zone', () => {
      const getModel = (uid: string) =>
        uid === 'blocks.rich' ? { attributes: { content: { type: 'blocks' } } } : undefined;
      const model = { attributes: { body: { type: 'dynamiczone', components: ['blocks.rich'] } } };
      const entry = { body: [{ id: 7, __component: 'blocks.rich', content: sourceAst }] };

      const result = projectBlocksFields(entry, model, getModel);

      expect(JSON.stringify(result.body[0].content)).not.toContain('url');
      expect(collectTexts(result.body[0].content)).toContain('world');
    });
  });

  describe('overlayBlocksTranslation', () => {
    it('round-trips byte-identically when the translation equals the source', () => {
      const skeleton = projectBlocksValue(sourceAst);
      const rebuilt = overlayBlocksTranslation(sourceAst, skeleton);
      expect(rebuilt).toEqual(sourceAst);
    });

    it('injects translated text while preserving marks, links, headings, lists, images, quotes and code', () => {
      const skeleton = projectBlocksValue(sourceAst);
      const translated = translateSkeleton(skeleton, (t) => (t === '' ? '' : `[${t}]`));

      const rebuilt = overlayBlocksTranslation(sourceAst, translated)!;

      // structure preserved
      expect(rebuilt[0]).toMatchObject({ type: 'heading', level: 2 });
      expect(rebuilt[0].children[0]).toEqual({ text: '[Title]', bold: true });
      expect(rebuilt[1].children[1]).toEqual({ text: '[brave]', italic: true });
      expect(rebuilt[1].children[2]).toMatchObject({ type: 'link', url: 'https://localazy.com' });
      expect(rebuilt[1].children[2].children[0]).toEqual({ text: '[world]' });
      // nested list text translated, nesting preserved
      expect(rebuilt[2].children[1].children[1].children[0].children[0]).toEqual({ text: '[nested]' });
      // quote + code translated
      expect(rebuilt[4].children[0]).toEqual({ text: '[quoted]' });
      expect(rebuilt[5].children[0]).toEqual({ text: '[const a = 1;]' });
    });

    it('carries the source image node (media + empty text leaf) through untouched', () => {
      const skeleton = projectBlocksValue(sourceAst);
      const rebuilt = overlayBlocksTranslation(sourceAst, skeleton)!;

      expect(rebuilt[3]).toEqual(sourceAst[3]);
    });

    it('falls back to source text for text leaves with no translation', () => {
      // only the first block is translated; the rest of the skeleton is empty
      const partial = { '0': { children: [{ text: 'Titre' }] } };

      const rebuilt = overlayBlocksTranslation(sourceAst, partial)!;

      expect(rebuilt[0].children[0]).toEqual({ text: 'Titre', bold: true });
      // untranslated paragraph keeps the source text
      expect(rebuilt[1].children[0]).toEqual({ text: 'Hello ' });
    });

    it('accepts a skeleton keyed by numeric string positions (the download shape)', () => {
      const translated = {
        '0': { children: [{ text: 'Titre' }] },
        '1': {
          children: [{ text: 'Bonjour ' }, { text: 'courageux' }, { children: [{ text: 'monde' }] }],
        },
      };

      const rebuilt = overlayBlocksTranslation(sourceAst, translated)!;

      expect(rebuilt[0].children[0]).toEqual({ text: 'Titre', bold: true });
      expect(rebuilt[1].children[1]).toEqual({ text: 'courageux', italic: true });
      expect(rebuilt[1].children[2].children[0]).toEqual({ text: 'monde' });
    });

    it('returns undefined when there is no source AST to overlay onto', () => {
      expect(overlayBlocksTranslation(undefined, { '0': { text: 'x' } })).toBeUndefined();
      expect(overlayBlocksTranslation('not-an-array', {})).toBeUndefined();
      expect(overlayBlocksTranslation(null, {})).toBeUndefined();
    });
  });
});
