import isGenerallyApplicableContentType from '../is-generally-applicable-content-type';

describe('isGenerallyApplicableContentType', () => {
  describe('unsupported UID prefixes', () => {
    it('should return false for strapi core models', () => {
      const model = {
        uid: 'strapi::core.something',
        modelType: 'contentType',
        __schema__: {},
      };
      expect(isGenerallyApplicableContentType(model)).toBe(false);
    });

    it('should return false for users-permissions models', () => {
      const model = {
        uid: 'plugin::users-permissions.user',
        modelType: 'contentType',
        __schema__: {},
      };
      expect(isGenerallyApplicableContentType(model)).toBe(false);
    });
  });

  describe('model type validation', () => {
    it('should return true for valid content types', () => {
      const model = {
        uid: 'api::article.article',
        modelType: 'contentType',
        __schema__: {},
      };
      expect(isGenerallyApplicableContentType(model)).toBe(true);
    });

    it('should return true for valid components', () => {
      const model = {
        uid: 'component::blog.post',
        modelType: 'component',
        __schema__: {},
      };
      expect(isGenerallyApplicableContentType(model)).toBe(true);
    });

    it('should return false for unsupported model types', () => {
      const model = {
        uid: 'api::article.article',
        modelType: 'unsupportedType',
        __schema__: {},
      };
      expect(isGenerallyApplicableContentType(model)).toBe(false);
    });
  });

  describe('schema validation', () => {
    it('should return false when __schema__ is missing', () => {
      const model = {
        uid: 'api::article.article',
        modelType: 'contentType',
      };
      expect(isGenerallyApplicableContentType(model)).toBe(false);
    });

    it('should return false when __schema__ is null', () => {
      const model = {
        uid: 'api::article.article',
        modelType: 'contentType',
        __schema__: null,
      };
      expect(isGenerallyApplicableContentType(model)).toBe(false);
    });
  });

  describe('plugin options', () => {
    it('should respect content-type-builder visibility when set to false', () => {
      const model = {
        uid: 'api::article.article',
        modelType: 'contentType',
        __schema__: {},
        pluginOptions: {
          'content-type-builder': {
            visible: false,
          },
        },
      };
      expect(isGenerallyApplicableContentType(model)).toBe(false);
    });

    it('should respect content-type-builder visibility when set to true', () => {
      const model = {
        uid: 'api::article.article',
        modelType: 'contentType',
        __schema__: {},
        pluginOptions: {
          'content-type-builder': {
            visible: true,
          },
        },
      };
      expect(isGenerallyApplicableContentType(model)).toBe(true);
    });

    it('should return true when pluginOptions is missing', () => {
      const model = {
        uid: 'api::article.article',
        modelType: 'contentType',
        __schema__: {},
      };
      expect(isGenerallyApplicableContentType(model)).toBe(true);
    });

    it('should return true when content-type-builder options are missing', () => {
      const model = {
        uid: 'api::article.article',
        modelType: 'contentType',
        __schema__: {},
        pluginOptions: {
          'something-else': {},
        },
      };
      expect(isGenerallyApplicableContentType(model)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle models with minimal required properties', () => {
      const model = {
        uid: 'api::minimal.model',
        modelType: 'contentType',
        __schema__: {},
      };
      expect(isGenerallyApplicableContentType(model)).toBe(true);
    });

    it('should handle models with all possible properties', () => {
      const model = {
        uid: 'api::full.model',
        modelType: 'contentType',
        __schema__: { attributes: {} },
        pluginOptions: {
          'content-type-builder': {
            visible: true,
          },
          'other-plugin': {
            someOption: true,
          },
        },
        attributes: {},
        options: {},
      };
      expect(isGenerallyApplicableContentType(model)).toBe(true);
    });
  });
});
