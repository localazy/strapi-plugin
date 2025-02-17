import { intlDisplayName } from '../intl-display-name';

describe('intlDisplayName', () => {
  let originalIntl: typeof Intl;

  beforeAll(() => {
    // Store original Intl object
    originalIntl = global.Intl;
  });

  afterAll(() => {
    // Restore original Intl object
    global.Intl = originalIntl;
  });

  beforeEach(() => {
    // Mock Intl.DisplayNames
    global.Intl = {
      ...originalIntl,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      DisplayNames: jest.fn().mockImplementation(function (locales, options) {
        return {
          of: jest.fn((code) => {
            // Mock responses for specific language codes
            const languages = {
              en: 'English',
              es: 'Spanish',
              fr: 'French',
              de: 'German',
              cs: 'Czech',
              zh: 'Chinese',
              ja: 'Japanese',
            };
            return languages[code] || null;
          }),
        };
      }),
    } as any;
  });

  it('should return English language name for valid ISO code', () => {
    expect(intlDisplayName('en')).toBe('English');
    expect(intlDisplayName('es')).toBe('Spanish');
    expect(intlDisplayName('fr')).toBe('French');
  });

  it('should initialize DisplayNames with English locale', () => {
    intlDisplayName('en');
    expect(Intl.DisplayNames).toHaveBeenCalledWith(['en'], { type: 'language' });
  });

  it('should handle non-existent language codes', () => {
    expect(intlDisplayName('xx')).toBeNull();
  });

  it('should handle case sensitivity', () => {
    expect(intlDisplayName('EN')).toBe('English');
    expect(intlDisplayName('En')).toBe('English');
    expect(intlDisplayName('eN')).toBe('English');
  });

  it('should handle language codes with regions', () => {
    expect(intlDisplayName('en-US')).toBe('English');
    expect(intlDisplayName('es-ES')).toBe('Spanish');
    expect(intlDisplayName('fr-FR')).toBe('French');
  });

  it('should handle language codes with scripts', () => {
    expect(intlDisplayName('zh-Hans')).toBe('Chinese');
    expect(intlDisplayName('zh-Hant')).toBe('Chinese');
  });

  describe('error handling', () => {
    it('should handle invalid input gracefully', () => {
      expect(intlDisplayName('')).toBeNull();
      expect(intlDisplayName('1')).toBeNull();
      expect(intlDisplayName('***')).toBeNull();
    });

    it('should handle undefined input', () => {
      expect(intlDisplayName(undefined as any)).toBeNull();
    });

    it('should handle null input', () => {
      expect(intlDisplayName(null as any)).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle three-letter ISO codes', () => {
      const mockDisplayNames = {
        of: jest.fn((code) => {
          const languages = {
            eng: 'English',
            spa: 'Spanish',
            fra: 'French',
          };
          return languages[code] || null;
        }),
      };

      // Use Object.defineProperty to override read-only property
      Object.defineProperty(global.Intl, 'DisplayNames', {
        value: jest.fn().mockImplementation(() => mockDisplayNames),
        writable: true,
        configurable: true,
      });

      expect(intlDisplayName('eng')).toBe('English');
      expect(intlDisplayName('spa')).toBe('Spanish');
      expect(intlDisplayName('fra')).toBe('French');
    });

    it('should handle when Intl.DisplayNames is not available', () => {
      // Simulate environment where Intl.DisplayNames is not available
      global.Intl = {
        ...originalIntl,
        DisplayNames: undefined,
      } as any;

      expect(() => intlDisplayName('en')).toThrow();
    });
  });
});
