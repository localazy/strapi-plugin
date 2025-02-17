import { getFullPopulateLocalazyUploadObject } from '../get-full-populate-localazy-upload-object';
import type { UID } from '@strapi/strapi';

describe('getFullPopulateLocalazyUploadObject', () => {
  let mockStrapi;

  beforeEach(() => {
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
      expect(getFullPopulateLocalazyUploadObject('api::test.test' as UID.ContentType, 1)).toBe(true);
      expect(getFullPopulateLocalazyUploadObject('api::test.test' as UID.ContentType, 0)).toBe(true);
    });

    it('should return undefined for admin::user model', () => {
      expect(getFullPopulateLocalazyUploadObject('admin::user' as UID.ContentType)).toBeUndefined();
    });

    it('should return undefined for upload.file model', () => {
      expect(getFullPopulateLocalazyUploadObject('plugin::upload.file' as UID.ContentType)).toBeUndefined();
    });

    it('should return undefined when model is not found', () => {
      mockStrapi.getModel.mockReturnValue(undefined);
      expect(getFullPopulateLocalazyUploadObject('non-existent-model' as UID.ContentType)).toBeUndefined();
    });
  });

  describe('model attributes handling', () => {
    it('should ignore specified fields', () => {
      mockStrapi.getModel.mockReturnValue({
        collectionName: 'test',
        attributes: {
          title: { type: 'string' },
          locale: { type: 'string' },
          localizations: { type: 'relation' },
          createdAt: { type: 'datetime' },
          createdBy: { type: 'relation' },
          updatedAt: { type: 'datetime' },
          updatedBy: { type: 'relation' },
          publishedAt: { type: 'datetime' },
        },
      });

      const result = getFullPopulateLocalazyUploadObject('api::test.test' as UID.ContentType);
      expect(result).toEqual(true); // No populate object needed as all fields are ignored
    });

    it('should handle upload file model specially', () => {
      mockStrapi.getModel.mockReturnValue({
        uid: 'plugin::upload.file',
        attributes: {
          related: 'should-be-removed',
          name: { type: 'string' },
          url: { type: 'string' },
        },
      });

      const result = getFullPopulateLocalazyUploadObject('plugin::upload.file' as UID.ContentType);
      expect(result).toBeUndefined();
    });
  });

  describe('field types handling', () => {
    it('should handle component type', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'api::test.test') {
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

      const result = getFullPopulateLocalazyUploadObject('api::test.test' as UID.ContentType);
      expect(result).toEqual({
        populate: {
          profile: true,
        },
      });
    });

    it('should handle dynamiczone type', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'api::test.test') {
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

      const result = getFullPopulateLocalazyUploadObject('api::test.test' as UID.ContentType);
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

    it('should skip relation fields', () => {
      mockStrapi.getModel.mockReturnValue({
        collectionName: 'test',
        attributes: {
          title: { type: 'string' },
          author: {
            type: 'relation',
            target: 'api::author.author',
          },
        },
      });

      const result = getFullPopulateLocalazyUploadObject('api::test.test' as UID.ContentType);
      expect(result).toEqual(true); // No populate needed as relation is skipped
    });

    it('should skip media fields', () => {
      mockStrapi.getModel.mockReturnValue({
        collectionName: 'test',
        attributes: {
          title: { type: 'string' },
          image: {
            type: 'media',
          },
        },
      });

      const result = getFullPopulateLocalazyUploadObject('api::test.test' as UID.ContentType);
      expect(result).toEqual(true); // No populate needed as media is skipped
    });
  });

  describe('depth control', () => {
    it('should respect maxDepth parameter', () => {
      mockStrapi.getModel.mockImplementation((uid) => {
        if (uid === 'api::test.test') {
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

      const result = getFullPopulateLocalazyUploadObject('api::test.test' as UID.ContentType, 2);
      expect(result).toEqual({
        populate: {
          level1: true,
        },
      });
    });
  });
});
