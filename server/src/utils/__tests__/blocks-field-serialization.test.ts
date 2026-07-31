import { serializeBlocksFields, parseBlocksFieldValue } from '../blocks-field-serialization';

const storyAst = [
  {
    type: 'heading',
    level: 2,
    children: [{ type: 'text', text: 'Title', bold: true }],
  },
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'Hello ' },
      { type: 'link', url: 'https://localazy.com', children: [{ type: 'text', text: 'world' }] },
    ],
  },
];

describe('blocks-field-serialization', () => {
  describe('serializeBlocksFields', () => {
    it('serializes a top-level blocks field into a single JSON string', () => {
      const model = { attributes: { title: { type: 'string' }, story: { type: 'blocks' } } };
      const entry = { title: 'Post', story: storyAst };

      const result = serializeBlocksFields(entry, model, () => undefined);

      expect(result.title).toBe('Post');
      expect(typeof result.story).toBe('string');
      expect(JSON.parse(result.story)).toEqual(storyAst);
    });

    it('does not mutate the source entry', () => {
      const model = { attributes: { story: { type: 'blocks' } } };
      const entry = { story: storyAst };

      serializeBlocksFields(entry, model, () => undefined);

      expect(Array.isArray(entry.story)).toBe(true);
    });

    it('leaves non-blocks fields untouched', () => {
      const model = {
        attributes: { title: { type: 'string' }, body: { type: 'json' }, count: { type: 'integer' } },
      };
      const entry = { title: 'Post', body: { a: 1 }, count: 3 };

      const result = serializeBlocksFields(entry, model, () => undefined);

      expect(result).toEqual(entry);
    });

    it('skips null and undefined blocks values', () => {
      const model = { attributes: { story: { type: 'blocks' } } };

      expect(serializeBlocksFields({ story: null }, model, () => undefined)).toEqual({ story: null });
      expect(serializeBlocksFields({}, model, () => undefined)).toEqual({});
    });

    it('serializes blocks nested inside a repeatable component', () => {
      const getModel = (uid: string) =>
        uid === 'basic.section' ? { attributes: { body: { type: 'blocks' } } } : undefined;
      const model = {
        attributes: { sections: { type: 'component', component: 'basic.section', repeatable: true } },
      };
      const entry = {
        sections: [
          { id: 1, body: storyAst },
          { id: 2, body: storyAst },
        ],
      };

      const result = serializeBlocksFields(entry, model, getModel);

      expect(typeof result.sections[0].body).toBe('string');
      expect(JSON.parse(result.sections[1].body)).toEqual(storyAst);
    });

    it('serializes blocks nested inside a dynamic zone', () => {
      const getModel = (uid: string) =>
        uid === 'blocks.rich' ? { attributes: { content: { type: 'blocks' } } } : undefined;
      const model = { attributes: { body: { type: 'dynamiczone', components: ['blocks.rich'] } } };
      const entry = { body: [{ id: 7, __component: 'blocks.rich', content: storyAst }] };

      const result = serializeBlocksFields(entry, model, getModel);

      expect(typeof result.body[0].content).toBe('string');
      expect(JSON.parse(result.body[0].content)).toEqual(storyAst);
    });
  });

  describe('parseBlocksFieldValue', () => {
    it('parses a serialized blocks string back into the AST', () => {
      expect(parseBlocksFieldValue(JSON.stringify(storyAst))).toEqual(storyAst);
    });

    it('round-trips identically', () => {
      const serialized = JSON.stringify(storyAst);
      expect(parseBlocksFieldValue(serialized)).toEqual(storyAst);
    });

    it('passes through an already-parsed array', () => {
      expect(parseBlocksFieldValue(storyAst)).toEqual(storyAst);
    });

    it('returns undefined for malformed JSON', () => {
      expect(parseBlocksFieldValue('{not json')).toBeUndefined();
    });

    it('returns undefined when the parsed value is not a blocks array', () => {
      expect(parseBlocksFieldValue(JSON.stringify({ type: 'paragraph' }))).toBeUndefined();
      expect(parseBlocksFieldValue('42')).toBeUndefined();
    });

    it('returns undefined for non-string, non-array input', () => {
      expect(parseBlocksFieldValue(null)).toBeUndefined();
      expect(parseBlocksFieldValue(undefined)).toBeUndefined();
      expect(parseBlocksFieldValue(5)).toBeUndefined();
    });
  });
});
