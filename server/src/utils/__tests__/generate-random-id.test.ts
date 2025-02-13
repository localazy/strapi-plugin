import { generateRandomId } from '../generate-random-id';

describe('generateRandomId', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should generate an ID with default length of 16', () => {
    const id = generateRandomId();
    expect(id).toMatch(/^_[a-zA-Z0-9]{15}$/);
    expect(id.length).toBe(16);
  });

  it('should generate an ID with specified length', () => {
    const length = 8;
    const id = generateRandomId(length);
    expect(id).toMatch(/^_[a-zA-Z0-9]{7}$/);
    expect(id.length).toBe(8);
  });

  it('should always start with an underscore', () => {
    const id = generateRandomId();
    expect(id.startsWith('_')).toBe(true);
  });

  it('should generate different IDs when Math.random returns different values', () => {
    // First call
    const id1 = generateRandomId();

    // Mock different random value for second call
    jest.spyOn(Math, 'random').mockReturnValue(0.987654321);
    const id2 = generateRandomId();

    expect(id1).not.toBe(id2);
  });

  describe('edge cases', () => {
    it('should handle length of 0', () => {
      const id = generateRandomId(0);
      expect(id).toBe('_');
    });

    it('should handle negative length', () => {
      const id = generateRandomId(-5);
      expect(id).toBe('_');
    });

    it('should handle very large length', () => {
      const length = 100;
      const id = generateRandomId(length);
      expect(id.length).toBe(length);
      expect(id).toMatch(new RegExp(`^_[a-zA-Z0-9]{${length - 1}}$`));
    });
  });
});
