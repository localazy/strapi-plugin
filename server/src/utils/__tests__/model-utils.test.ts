import { getAttribute, isComponent, isDynamicZone, isRepeatable, isRelation, findModel } from '../model-utils';

describe('model-utils', () => {
  describe('getAttribute', () => {
    const model = {
      attributes: {
        title: { type: 'string' },
        description: { type: 'text' },
        image: { type: 'media' },
      },
    };

    it('should return attribute object for existing attribute', () => {
      expect(getAttribute(model, 'title')).toEqual({ type: 'string' });
      expect(getAttribute(model, 'description')).toEqual({ type: 'text' });
    });

    it('should return undefined for non-existing attribute', () => {
      expect(getAttribute(model, 'nonexistent')).toBeUndefined();
    });

    it('should return undefined for empty model', () => {
      expect(getAttribute({}, 'title')).toBeUndefined();
      expect(getAttribute(null, 'title')).toBeUndefined();
      expect(getAttribute(undefined, 'title')).toBeUndefined();
    });
  });

  describe('isComponent', () => {
    it('should return true for component attributes', () => {
      expect(isComponent({ type: 'component', component: 'basic.quote' })).toBe(true);
    });

    it('should return false for non-component attributes', () => {
      expect(isComponent({ type: 'string' })).toBe(false);
      expect(isComponent({ type: 'media' })).toBe(false);
      expect(isComponent({ type: 'relation' })).toBe(false);
    });
  });

  describe('isDynamicZone', () => {
    it('should return true for dynamiczone attributes', () => {
      expect(isDynamicZone({ type: 'dynamiczone', components: ['basic.quote', 'basic.image'] })).toBe(true);
    });

    it('should return false for non-dynamiczone attributes', () => {
      expect(isDynamicZone({ type: 'string' })).toBe(false);
      expect(isDynamicZone({ type: 'component' })).toBe(false);
      expect(isDynamicZone({ type: 'relation' })).toBe(false);
    });
  });

  describe('isRepeatable', () => {
    it('should return true for repeatable components', () => {
      expect(isRepeatable({ type: 'component', repeatable: true })).toBe(true);
    });

    it('should return false for non-repeatable components', () => {
      expect(isRepeatable({ type: 'component', repeatable: false })).toBe(false);
      expect(isRepeatable({ type: 'component' })).toBe(false);
    });

    it('should return false for non-component attributes', () => {
      expect(isRepeatable({ type: 'string' })).toBe(false);
      expect(isRepeatable({ type: 'dynamiczone' })).toBe(false);
      expect(isRepeatable({ type: 'relation', repeatable: true })).toBe(false);
    });
  });

  describe('isRelation', () => {
    it('should return true for relation attributes except upload.file', () => {
      expect(isRelation({ type: 'relation', target: 'api::category.category' })).toBe(true);
      expect(isRelation({ type: 'relation', target: 'api::tag.tag' })).toBe(true);
    });

    it('should return false for upload.file relations', () => {
      expect(isRelation({ type: 'relation', target: 'plugin::upload.file' })).toBe(false);
    });

    it('should return false for non-relation attributes', () => {
      expect(isRelation({ type: 'string' })).toBe(false);
      expect(isRelation({ type: 'component' })).toBe(false);
      expect(isRelation({ type: 'dynamiczone' })).toBe(false);
    });
  });

  describe('findModel', () => {
    const models = [
      { uid: 'api::article.article', attributes: {} },
      { uid: 'api::category.category', attributes: {} },
      { uid: 'api::author.author', attributes: {} },
    ];

    it('should find model by uid', () => {
      expect(findModel(models, 'api::article.article')).toEqual(models[0]);
      expect(findModel(models, 'api::category.category')).toEqual(models[1]);
    });

    it('should return undefined for non-existing model', () => {
      expect(findModel(models, 'api::nonexistent.model')).toBeUndefined();
    });

    it('should handle empty models array', () => {
      expect(findModel([], 'api::article.article')).toBeUndefined();
    });
  });
});
