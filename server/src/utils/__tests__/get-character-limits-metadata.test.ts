import { getCharacterLimitsMetadata } from '../get-character-limits-metadata';

describe('getCharacterLimitsMetadata', () => {
  let mockStrapi;

  beforeEach(() => {
    mockStrapi = {
      contentTypes: {},
      components: {},
    };
    global.strapi = mockStrapi;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return empty metadata when model is not found', () => {
    const flattenedContent = {
      'api::article.article.doc1.title': 'Hello',
    };

    const result = getCharacterLimitsMetadata(flattenedContent, 'api::article.article');
    expect(result).toEqual({});
  });

  it('should return metadata with limit for fields that have maxLength', () => {
    mockStrapi.contentTypes['api::article.article'] = {
      attributes: {
        title: { type: 'string', maxLength: 100 },
        description: { type: 'text' },
      },
    };

    const flattenedContent = {
      'api::article.article.doc1.title': 'Hello',
      'api::article.article.doc1.description': 'World',
    };

    const result = getCharacterLimitsMetadata(flattenedContent, 'api::article.article');
    expect(result).toEqual({
      '@meta:api::article.article.doc1.title': { limit: 100 },
    });
  });

  it('should not include metadata for fields without maxLength', () => {
    mockStrapi.contentTypes['api::article.article'] = {
      attributes: {
        title: { type: 'string' },
        description: { type: 'text' },
      },
    };

    const flattenedContent = {
      'api::article.article.doc1.title': 'Hello',
      'api::article.article.doc1.description': 'World',
    };

    const result = getCharacterLimitsMetadata(flattenedContent, 'api::article.article');
    expect(result).toEqual({});
  });

  it('should resolve maxLength through component schemas', () => {
    mockStrapi.contentTypes['api::article.article'] = {
      attributes: {
        title: { type: 'string', maxLength: 50 },
        seo: { type: 'component', component: 'shared.seo' },
      },
    };
    mockStrapi.components['shared.seo'] = {
      attributes: {
        metaTitle: { type: 'string', maxLength: 60 },
        metaDescription: { type: 'text' },
      },
    };

    const flattenedContent = {
      'api::article.article.doc1.title': 'Hello',
      'api::article.article.doc1.seo[1].metaTitle': 'SEO Title',
      'api::article.article.doc1.seo[1].metaDescription': 'SEO Description',
    };

    const result = getCharacterLimitsMetadata(flattenedContent, 'api::article.article');
    expect(result).toEqual({
      '@meta:api::article.article.doc1.title': { limit: 50 },
      '@meta:api::article.article.doc1.seo[1].metaTitle': { limit: 60 },
    });
  });

  it('should resolve maxLength through dynamic zone component schemas', () => {
    mockStrapi.contentTypes['api::page.page'] = {
      attributes: {
        content: { type: 'dynamiczone', components: ['basic.text', 'basic.hero'] },
      },
    };
    mockStrapi.components['basic.text'] = {
      attributes: {
        body: { type: 'text', maxLength: 500 },
      },
    };
    mockStrapi.components['basic.hero'] = {
      attributes: {
        heading: { type: 'string', maxLength: 80 },
      },
    };

    const flattenedContent = {
      'api::page.page.doc1.content[1;basic.text].body': 'Some text',
      'api::page.page.doc1.content[2;basic.hero].heading': 'Hero Title',
    };

    const result = getCharacterLimitsMetadata(flattenedContent, 'api::page.page');
    expect(result).toEqual({
      '@meta:api::page.page.doc1.content[1;basic.text].body': { limit: 500 },
      '@meta:api::page.page.doc1.content[2;basic.hero].heading': { limit: 80 },
    });
  });

  it('should skip keys that do not start with the model uid', () => {
    mockStrapi.contentTypes['api::article.article'] = {
      attributes: {
        title: { type: 'string', maxLength: 100 },
      },
    };

    const flattenedContent = {
      'api::article.article.doc1.title': 'Hello',
      'api::other.other.doc2.name': 'Other',
    };

    const result = getCharacterLimitsMetadata(flattenedContent, 'api::article.article');
    expect(result).toEqual({
      '@meta:api::article.article.doc1.title': { limit: 100 },
    });
  });

  it('should handle multiple entries for the same field', () => {
    mockStrapi.contentTypes['api::article.article'] = {
      attributes: {
        title: { type: 'string', maxLength: 100 },
      },
    };

    const flattenedContent = {
      'api::article.article.doc1.title': 'Hello',
      'api::article.article.doc2.title': 'World',
    };

    const result = getCharacterLimitsMetadata(flattenedContent, 'api::article.article');
    expect(result).toEqual({
      '@meta:api::article.article.doc1.title': { limit: 100 },
      '@meta:api::article.article.doc2.title': { limit: 100 },
    });
  });

  it('should handle component model uid from components registry', () => {
    mockStrapi.components['shared.seo'] = {
      attributes: {
        metaTitle: { type: 'string', maxLength: 60 },
      },
    };

    const flattenedContent = {
      'shared.seo.1.metaTitle': 'Title',
    };

    const result = getCharacterLimitsMetadata(flattenedContent, 'shared.seo');
    expect(result).toEqual({
      '@meta:shared.seo.1.metaTitle': { limit: 60 },
    });
  });
});
