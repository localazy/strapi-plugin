import { getFullPopulateObject } from '../get-full-populate-object';

describe('getFullPopulateObject', () => {
  let mockStrapi;

  beforeEach(() => {
    mockStrapi = {
      getModel: jest.fn(),
      plugin: jest.fn(() => ({
        config: jest.fn().mockReturnValue(true),
      })),
    };
    global.strapi = mockStrapi;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('basic functionality', () => {
    it('should return true when depth is 1 or less', () => {
      expect(getFullPopulateObject('test-model', 1)).toBe(true);
      expect(getFullPopulateObject('test-model', 0)).toBe(true);
    });

    it('should return undefined for admin::user model when skipCreatorFields is true', () => {
      expect(getFullPopulateObject('admin::user')).toBeUndefined();
    });

    it('should return true for admin::user model when skipCreatorFields is false', () => {
      mockStrapi.getModel.mockReturnValue({
        uid: 'admin::user',
        attributes: {
          name: { type: 'string' },
        },
      });
      mockStrapi.plugin.mockReturnValue({
        config: jest.fn().mockReturnValue(false),
      });
      const result = getFullPopulateObject('admin::user');
      expect(result).toBe(true);
    });

    it('should return undefined when model is not found', () => {
      mockStrapi.getModel.mockReturnValue(undefined);
      expect(getFullPopulateObject('non-existent-model')).toBeUndefined();
    });
  });

  describe('model attributes handling', () => {
    it('should handle upload file model specially', () => {
      mockStrapi.getModel.mockReturnValue({
        uid: 'plugin::upload.file',
        attributes: {
          related: 'should-be-removed',
          name: { type: 'string' },
          url: { type: 'string' },
        },
      });

      const result = getFullPopulateObject('plugin::upload.file');
      expect(result).toEqual(true);
    });

    it('should respect ignore list', () => {
      mockStrapi.getModel.mockReturnValue({
        collectionName: 'test',
        attributes: {
          title: { type: 'string' },
          ignored: { type: 'string' },
          alsoIgnored: { type: 'relation' },
        },
      });

      const result = getFullPopulateObject('test-model', 5, ['ignored', 'alsoIgnored']);
      expect(result).toEqual(true); // No populate needed as other fields are primitive
    });
  });

  describe('field types handling', () => {
    it('should handle component type', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'test-model') {
          return {
            collectionName: 'test',
            attributes: {
              profile: {
                type: 'component',
                component: 'default.profile',
              },
            },
          };
        }
        if (uid === 'default.profile') {
          return {
            collectionName: 'profile',
            attributes: {
              name: { type: 'string' },
            },
          };
        }
        return undefined;
      });

      const result = getFullPopulateObject('test-model');
      expect(result).toEqual({
        populate: {
          profile: true,
        },
      });
    });

    it('should handle dynamiczone type', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'test-model') {
          return {
            collectionName: 'test',
            attributes: {
              content: {
                type: 'dynamiczone',
                components: ['default.text', 'default.image'],
              },
            },
          };
        }

        const components = {
          'default.text': {
            collectionName: 'text',
            attributes: { content: { type: 'string' } },
          },
          'default.image': {
            collectionName: 'image',
            attributes: { url: { type: 'string' } },
          },
        };
        return components[uid];
      });

      const result = getFullPopulateObject('test-model');
      expect(result).toEqual({
        populate: {
          content: {
            on: {
              'default.text': true,
              'default.image': true,
            },
          },
        },
      });
    });

    it('should handle relation type', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'test-model') {
          return {
            collectionName: 'test',
            attributes: {
              author: {
                type: 'relation',
                target: 'api::author.author',
              },
            },
          };
        }
        if (uid === 'api::author.author') {
          return {
            collectionName: 'author',
            attributes: {
              name: { type: 'string' },
            },
          };
        }
        return undefined;
      });

      const result = getFullPopulateObject('test-model');
      expect(result).toEqual({
        populate: {
          author: true,
        },
      });
    });

    it('should handle localizations relation with depth limit', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'test-model') {
          return {
            collectionName: 'test',
            attributes: {
              localizations: {
                type: 'relation',
                target: 'api::test.test',
              },
            },
          };
        }
        return undefined;
      });

      const result = getFullPopulateObject('test-model', 5);
      expect(result).toEqual({
        populate: {
          localizations: true,
        },
      });
    });

    it('should handle media type', () => {
      mockStrapi.getModel.mockReturnValue({
        collectionName: 'test',
        attributes: {
          image: {
            type: 'media',
          },
        },
      });

      const result = getFullPopulateObject('test-model');
      expect(result).toEqual({
        populate: {
          image: true,
        },
      });
    });
  });

  describe('depth control', () => {
    it('should respect maxDepth parameter for nested structures', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'test-model') {
          return {
            collectionName: 'test',
            attributes: {
              level1: {
                type: 'component',
                component: 'test.level1',
              },
            },
          };
        }
        if (uid === 'test.level1') {
          return {
            collectionName: 'level1',
            attributes: {
              level2: {
                type: 'component',
                component: 'test.level2',
              },
            },
          };
        }
        return undefined;
      });

      const result = getFullPopulateObject('test-model', 2);
      expect(result).toEqual({
        populate: {
          level1: true,
        },
      });
    });
  });
});
