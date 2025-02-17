import { flattenObject } from '../flatten-object';

describe('flattenObject', () => {
  describe('primitive values', () => {
    it('should return primitive values as is', () => {
      expect(flattenObject('test')).toBe('test');
      expect(flattenObject(42)).toBe(42);
      expect(flattenObject(true)).toBe(true);
    });
  });

  describe('simple objects', () => {
    it('should flatten a simple object', () => {
      const input = {
        name: 'test',
        age: 25,
        active: true,
      };
      const expected = {
        name: 'test',
        age: 25,
        active: true,
      };
      expect(flattenObject(input)).toEqual(expected);
    });

    it('should skip id and documentId properties', () => {
      const input = {
        id: 1,
        documentId: 'doc1',
        name: 'test',
      };
      const expected = {
        name: 'test',
      };
      expect(flattenObject(input)).toEqual(expected);
    });
  });

  describe('nested objects', () => {
    it('should flatten nested objects with documentId', () => {
      const input = {
        user: {
          documentId: 'user1',
          profile: {
            name: 'John',
            age: 30,
          },
        },
      };
      const expected = {
        'user[user1].profile.name': 'John',
        'user[user1].profile.age': 30,
      };
      expect(flattenObject(input)).toEqual(expected);
    });

    it('should flatten nested objects with id', () => {
      const input = {
        user: {
          id: 123,
          profile: {
            name: 'John',
            age: 30,
          },
        },
      };
      const expected = {
        'user[123].profile.name': 'John',
        'user[123].profile.age': 30,
      };
      expect(flattenObject(input)).toEqual(expected);
    });
  });

  describe('arrays', () => {
    it('should flatten arrays using index when no id/documentId present', () => {
      const input = {
        items: [{ name: 'item1' }, { name: 'item2' }],
      };
      const expected = {
        'items[0].name': 'item1',
        'items[1].name': 'item2',
      };
      expect(flattenObject(input)).toEqual(expected);
    });

    it('should flatten arrays using documentId when present', () => {
      const input = {
        items: [
          { documentId: 'doc1', name: 'item1' },
          { documentId: 'doc2', name: 'item2' },
        ],
      };
      const expected = {
        'items[doc1].name': 'item1',
        'items[doc2].name': 'item2',
      };
      expect(flattenObject(input)).toEqual(expected);
    });

    it('should flatten arrays using id when present', () => {
      const input = {
        items: [
          { id: 1, name: 'item1' },
          { id: 2, name: 'item2' },
        ],
      };
      const expected = {
        'items[1].name': 'item1',
        'items[2].name': 'item2',
      };
      expect(flattenObject(input)).toEqual(expected);
    });
  });

  describe('dynamic zones', () => {
    it('should handle dynamic zone components', () => {
      const input = {
        content: [
          {
            id: 1,
            __component: 'basic.text',
            text: 'Hello',
          },
          {
            id: 2,
            __component: 'basic.image',
            url: 'image.jpg',
          },
        ],
      };
      const expected = {
        'content[1;basic.text].text': 'Hello',
        'content[1;basic.text].__component': 'basic.text',
        'content[2;basic.image].url': 'image.jpg',
        'content[2;basic.image].__component': 'basic.image',
      };
      expect(flattenObject(input)).toEqual(expected);
    });
  });

  describe('complex nested structures', () => {
    it('should handle deeply nested structures with mixed types', () => {
      const input = {
        user: {
          documentId: 'user1',
          profile: {
            name: 'John',
            addresses: [
              {
                id: 1,
                type: 'home',
                details: {
                  street: 'Main St',
                },
              },
              {
                id: 2,
                type: 'work',
                details: {
                  street: 'Work St',
                },
              },
            ],
          },
        },
      };
      const expected = {
        'user[user1].profile.name': 'John',
        'user[user1].profile.addresses[1].type': 'home',
        'user[user1].profile.addresses[1].details.street': 'Main St',
        'user[user1].profile.addresses[2].type': 'work',
        'user[user1].profile.addresses[2].details.street': 'Work St',
      };
      expect(flattenObject(input)).toEqual(expected);
    });
  });

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      expect(flattenObject({})).toEqual({});
    });

    it('should handle empty arrays', () => {
      expect(flattenObject([])).toEqual({});
    });

    it('should skip null values', () => {
      const input = {
        name: null,
        details: {
          age: null,
        },
      };
      const expected = {};
      expect(flattenObject(input)).toEqual(expected);
    });

    it('should handle undefined values', () => {
      const input = {
        name: undefined,
        details: {
          age: undefined,
        },
      };
      const expected = {
        name: undefined,
        'details.age': undefined,
      };
      expect(flattenObject(input)).toEqual(expected);
    });
  });
});
