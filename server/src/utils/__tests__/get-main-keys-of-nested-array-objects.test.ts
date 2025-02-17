import { getMainKeysOfNestedArrayObjects } from '../get-main-keys-of-nested-array-objects';

describe('getMainKeysOfNestedArrayObjects', () => {
  it('should extract first key from each object in array', () => {
    const input = [{ name: 'John' }, { age: 25 }, { city: 'New York' }];

    const result = getMainKeysOfNestedArrayObjects(input);
    expect(result).toEqual(['name', 'age', 'city']);
  });

  it('should handle objects with multiple keys by taking only the first one', () => {
    const input = [
      { name: 'John', age: 25 },
      { city: 'New York', country: 'USA' },
      { id: 1, type: 'user', role: 'admin' },
    ];

    const result = getMainKeysOfNestedArrayObjects(input);
    expect(result).toEqual(['name', 'city', 'id']);
  });

  it('should handle empty objects', () => {
    const input = [{}, { name: 'John' }, {}];

    const result = getMainKeysOfNestedArrayObjects(input);
    expect(result).toEqual([undefined, 'name', undefined]);
  });

  it('should handle an empty array', () => {
    const input: any[] = [];

    const result = getMainKeysOfNestedArrayObjects(input);
    expect(result).toEqual([]);
  });

  it('should handle nested objects', () => {
    const input = [
      { user: { name: 'John', age: 25 } },
      { settings: { theme: 'dark' } },
      { data: { id: 1, values: [1, 2, 3] } },
    ];

    const result = getMainKeysOfNestedArrayObjects(input);
    expect(result).toEqual(['user', 'settings', 'data']);
  });

  it('should handle objects with Symbol keys', () => {
    const symbolKey = Symbol('test');
    const input = [{ [symbolKey]: 'value' }, { name: 'John' }];

    const result = getMainKeysOfNestedArrayObjects(input);
    expect(result).toEqual([symbolKey, 'name']);
  });
});
