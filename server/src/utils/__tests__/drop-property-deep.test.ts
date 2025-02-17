import { dropPropertyDeep } from '../drop-property-deep';

describe('dropPropertyDeep', () => {
  describe('with primitive values', () => {
    it('should return primitive values unchanged', () => {
      expect(dropPropertyDeep(42, 'test')).toBe(42);
      expect(dropPropertyDeep('string', 'test')).toBe('string');
      expect(dropPropertyDeep(true, 'test')).toBe(true);
      expect(dropPropertyDeep(null, 'test')).toBe(null);
    });
  });

  describe('with arrays', () => {
    it('should handle arrays of primitives', () => {
      const input = [1, 2, 3];
      expect(dropPropertyDeep(input, 'test')).toEqual([1, 2, 3]);
    });

    it('should remove objects containing the specified property from non-root arrays', () => {
      const input = {
        items: [{ id: 1, test: 'remove' }, { id: 2 }, { id: 3, test: 'remove' }],
      };
      const expected = {
        items: [{ id: 2 }],
      };
      expect(dropPropertyDeep(input, 'test')).toEqual(expected);
    });

    it('should keep objects with specified property in root array', () => {
      const input = [{ id: 1, test: 'keep' }, { id: 2 }, { id: 3, test: 'keep' }];
      const expected = [{}, { id: 2 }, {}];
      expect(dropPropertyDeep(input, 'test')).toEqual(expected);
    });

    it('should handle nested arrays', () => {
      const input = [[{ id: 1, test: 'remove' }], [{ id: 2 }], [{ id: 3, test: 'remove' }]];
      const expected = [[], [{ id: 2 }], []];
      expect(dropPropertyDeep(input, 'test')).toEqual(expected);
    });
  });

  describe('with objects', () => {
    it('should handle flat objects, but not in the root', () => {
      const input = {
        id: 1,
        name: 'test',
        toRemove: 'value',
      };
      const expected = {
        id: 1,
        name: 'test',
        toRemove: 'value',
      };
      expect(dropPropertyDeep(input, 'toRemove')).toEqual(expected);
    });

    it('should handle nested objects', () => {
      const input = {
        id: 1,
        nested: {
          id: 2,
          toRemove: 'value',
          deeper: {
            id: 3,
            toRemove: 'value',
          },
        },
      };
      const expected = {
        id: 1,
        nested: {},
      };
      expect(dropPropertyDeep(input, 'toRemove')).toEqual(expected);
    });

    it('should handle objects with array properties', () => {
      const input = {
        id: 1,
        items: [{ id: 1, toRemove: 'value' }, { id: 2 }, { id: 3, toRemove: 'value' }],
      };
      const expected = {
        id: 1,
        items: [{ id: 2 }],
      };
      expect(dropPropertyDeep(input, 'toRemove')).toEqual(expected);
    });
  });

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      expect(dropPropertyDeep({}, 'test')).toEqual({});
    });

    it('should handle empty arrays', () => {
      expect(dropPropertyDeep([], 'test')).toEqual([]);
    });

    it('should handle undefined', () => {
      expect(dropPropertyDeep(undefined, 'test')).toBeUndefined();
    });

    it('should preserve object references when no changes needed', () => {
      const input = { id: 1, name: 'test' };
      const result = dropPropertyDeep(input, 'nonexistent');
      expect(result).toEqual(input);
    });
  });
});
