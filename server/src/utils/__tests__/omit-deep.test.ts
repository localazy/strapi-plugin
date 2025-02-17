import { omitDeep } from '../omit-deep';

describe('omitDeep', () => {
  describe('object handling', () => {
    it('should remove specified keys from a simple object', () => {
      const input = {
        id: 1,
        name: 'test',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      };

      const result = omitDeep(input, ['createdAt', 'updatedAt']);

      expect(result).toEqual({
        id: 1,
        name: 'test',
      });
    });

    it('should remove keys from nested objects', () => {
      const input = {
        id: 1,
        name: 'test',
        metadata: {
          createdAt: '2024-01-01',
          author: {
            id: 2,
            createdAt: '2024-01-01',
            name: 'John',
          },
        },
      };

      const result = omitDeep(input, ['createdAt']);

      expect(result).toEqual({
        id: 1,
        name: 'test',
        metadata: {
          author: {
            id: 2,
            name: 'John',
          },
        },
      });
    });
  });

  describe('array handling', () => {
    it('should remove specified keys from array of objects', () => {
      const input = [
        { id: 1, name: 'first', createdAt: '2024-01-01' },
        { id: 2, name: 'second', createdAt: '2024-01-02' },
      ];

      const result = omitDeep(input, ['createdAt']);

      expect(result).toEqual([
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
      ]);
    });

    it('should handle nested arrays', () => {
      const input = {
        items: [
          { id: 1, metadata: [{ createdAt: '2024-01-01', value: 'test' }] },
          { id: 2, metadata: [{ createdAt: '2024-01-02', value: 'test2' }] },
        ],
      };

      const result = omitDeep(input, ['createdAt']);

      expect(result).toEqual({
        items: [
          { id: 1, metadata: [{ value: 'test' }] },
          { id: 2, metadata: [{ value: 'test2' }] },
        ],
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined values', () => {
      const input = {
        id: 1,
        nullField: null,
        undefinedField: undefined,
        nested: {
          createdAt: '2024-01-01',
          nullNested: null,
        },
      };

      const result = omitDeep(input, ['createdAt']);

      expect(result).toEqual({
        id: 1,
        nullField: null,
        undefinedField: undefined,
        nested: {
          nullNested: null,
        },
      });
    });

    it('should handle empty objects and arrays', () => {
      const input = {
        emptyObject: {},
        emptyArray: [],
        nested: {
          createdAt: '2024-01-01',
          emptyNested: {},
        },
      };

      const result = omitDeep(input, ['createdAt']);

      expect(result).toEqual({
        emptyObject: {},
        emptyArray: [],
        nested: {
          emptyNested: {},
        },
      });
    });

    it('should handle non-object values', () => {
      const input = {
        string: 'test',
        number: 42,
        boolean: true,
        createdAt: '2024-01-01',
      };

      const result = omitDeep(input, ['createdAt']);

      expect(result).toEqual({
        string: 'test',
        number: 42,
        boolean: true,
      });
    });

    it('should handle multiple keys to omit', () => {
      const input = {
        id: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
        metadata: {
          createdAt: '2024-01-01',
          updatedAt: '2024-01-02',
          version: 1,
        },
      };

      const result = omitDeep(input, ['createdAt', 'updatedAt']);

      expect(result).toEqual({
        id: 1,
        metadata: {
          version: 1,
        },
      });
    });
  });

  describe('special cases', () => {
    it('should preserve object references when no changes needed', () => {
      const nestedObj = { value: 'test' };
      const input = {
        id: 1,
        nested: nestedObj,
      };

      const result = omitDeep(input, ['createdAt']);

      expect(result.nested).toEqual(nestedObj);
    });

    it('should handle circular references', () => {
      const circular: any = {
        id: 1,
        createdAt: '2024-01-01',
      };
      circular.self = circular;

      const result = omitDeep(circular, ['createdAt']);

      expect(result.id).toBe(1);
      expect(result.createdAt).toBeUndefined();
      expect(result.self.id).toBe(1);
      expect(result.self.createdAt).toBeUndefined();
    });
  });
});
