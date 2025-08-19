import { dropPropertyDeep, dropPropertyDeepWithSkip, dropDocumentIdExceptMedia } from '../drop-property-deep';

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

  describe('with skipPredicates', () => {
    it('should skip objects that match predicates', () => {
      const isSpecialObject = (obj: any) => obj?.special === true;

      const input = {
        regular: { id: 1, toRemove: 'value' },
        special: { id: 2, toRemove: 'keep', special: true },
        nested: {
          regularNested: { id: 3, toRemove: 'value' },
          specialNested: { id: 4, toRemove: 'keep', special: true },
        },
      };

      const expected = {
        regular: { id: 1 },
        special: { id: 2, toRemove: 'keep', special: true },
        nested: {
          regularNested: { id: 3 },
          specialNested: { id: 4, toRemove: 'keep', special: true },
        },
      };

      expect(dropPropertyDeepWithSkip(input, 'toRemove', true, [isSpecialObject])).toEqual(expected);
    });
  });
});

describe('dropDocumentIdExceptMedia', () => {
  it('should drop documentId from regular objects but keep it in media objects', () => {
    const input = {
      regularObject: {
        id: 1,
        documentId: 'doc1',
        name: 'Regular Object',
      },
      mediaObject: {
        id: 2,
        documentId: 'doc2',
        name: 'image.jpg',
        url: '/uploads/image.jpg',
        mime: 'image/jpeg',
        ext: '.mp4',
      },
      nested: {
        regularNested: {
          id: 3,
          documentId: 'doc3',
          title: 'Nested Object',
        },
        mediaNested: {
          id: 4,
          documentId: 'doc4',
          name: 'photo.png',
          url: '/uploads/photo.png',
          mimeType: 'image/png',
          ext: '.png',
        },
      },
    };

    const expected = {
      regularObject: {
        id: 1,
        name: 'Regular Object',
      },
      mediaObject: {
        id: 2,
        documentId: 'doc2',
        name: 'image.jpg',
        url: '/uploads/image.jpg',
        mime: 'image/jpeg',
        ext: '.mp4',
      },
      nested: {
        regularNested: {
          id: 3,
          title: 'Nested Object',
        },
        mediaNested: {
          id: 4,
          documentId: 'doc4',
          name: 'photo.png',
          url: '/uploads/photo.png',
          mimeType: 'image/png',
          ext: '.png',
        },
      },
    };

    expect(dropDocumentIdExceptMedia(input)).toEqual(expected);
  });

  it('should handle arrays with media objects', () => {
    const input = {
      items: [
        { id: 1, documentId: 'doc1', title: 'Regular' },
        { id: 2, documentId: 'doc2', name: 'file.pdf', url: '/uploads/file.pdf', mime: 'application/pdf', ext: '.pdf' },
      ],
    };

    const expected = {
      items: [
        { id: 1, title: 'Regular' },
        { id: 2, documentId: 'doc2', name: 'file.pdf', url: '/uploads/file.pdf', mime: 'application/pdf', ext: '.pdf' },
      ],
    };

    expect(dropDocumentIdExceptMedia(input)).toEqual(expected);
  });
});
