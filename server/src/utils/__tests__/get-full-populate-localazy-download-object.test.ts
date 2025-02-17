import { getFullPopulateLocalazyDownloadObject } from '../get-full-populate-localazy-download-object';

describe('getFullPopulateLocalazyDownloadObject', () => {
  let mockStrapi;

  beforeEach(() => {
    // Mock the global strapi object
    mockStrapi = {
      getModel: jest.fn(),
    };
    global.strapi = mockStrapi;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('basic functionality', () => {
    it('should return true when depth is 1 or less', () => {
      expect(getFullPopulateLocalazyDownloadObject('test', 1)).toBe(true);
      expect(getFullPopulateLocalazyDownloadObject('test', 0)).toBe(true);
    });

    it('should return true for admin::user model', () => {
      expect(getFullPopulateLocalazyDownloadObject('admin::user')).toBe(true);
    });

    it('should return undefined when model is not found', () => {
      mockStrapi.getModel.mockReturnValue(undefined);
      expect(getFullPopulateLocalazyDownloadObject('non-existent-model')).toBeUndefined();
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

      const result = getFullPopulateLocalazyDownloadObject('plugin::upload.file');
      expect(result).toEqual(true);
    });

    it('should ignore specified fields', () => {
      mockStrapi.getModel.mockReturnValue({
        collectionName: 'test',
        attributes: {
          title: { type: 'string' },
          localizations: { type: 'relation' },
          createdAt: { type: 'datetime' },
          updatedAt: { type: 'datetime' },
          publishedAt: { type: 'datetime' },
        },
      });

      const result = getFullPopulateLocalazyDownloadObject('test');
      expect(result).toEqual(true); // No populate object needed as all fields are ignored
    });
  });

  describe('field types handling', () => {
    it('should handle component type', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'test') {
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

      const result = getFullPopulateLocalazyDownloadObject('test');
      expect(result).toEqual({
        populate: {
          profile: true,
        },
      });
    });

    it('should handle dynamiczone type', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'test') {
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

      const result = getFullPopulateLocalazyDownloadObject('test');
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

    it('should handle relation type with depth limit', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'test') {
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
              posts: { type: 'relation', target: 'api::post.post' },
            },
          };
        }
        return undefined;
      });

      const result = getFullPopulateLocalazyDownloadObject('test');
      expect(result).toEqual({
        populate: {
          author: true,
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
      const result = getFullPopulateLocalazyDownloadObject('test');
      expect(result).toEqual({
        populate: {
          image: true,
        },
      });
    });
  });

  describe('depth control', () => {
    it('should respect maxDepth parameter', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'test') {
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
              name: { type: 'string' },
            },
          };
        }
        return undefined;
      });

      const result = getFullPopulateLocalazyDownloadObject('test', 2);
      expect(result).toEqual({
        populate: {
          level1: true,
        },
      });
    });

    it('should use default depth when not specified', () => {
      mockStrapi.getModel.mockReturnValue({
        collectionName: 'test',
        attributes: {
          field: { type: 'string' },
        },
      });

      getFullPopulateLocalazyDownloadObject('test');
      expect(mockStrapi.getModel).toHaveBeenCalled();
    });
  });
});
