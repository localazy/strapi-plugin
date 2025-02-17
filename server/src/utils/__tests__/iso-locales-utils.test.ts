import { isoStrapiToLocalazy, isoLocalazyToStrapi } from '../iso-locales-utils';

describe('iso-locales-utils', () => {
  describe('isoStrapiToLocalazy', () => {
    it('should handle simple language codes', () => {
      expect(isoStrapiToLocalazy('en')).toBe('en');
      expect(isoStrapiToLocalazy('cs')).toBe('cs');
      expect(isoStrapiToLocalazy('fr')).toBe('fr');
    });

    it('should convert language with region', () => {
      expect(isoStrapiToLocalazy('en-US')).toBe('en_US');
      expect(isoStrapiToLocalazy('pt-BR')).toBe('pt_BR');
      expect(isoStrapiToLocalazy('zh-CN')).toBe('zh_CN');
    });

    it('should handle language with script', () => {
      expect(isoStrapiToLocalazy('zh-Hant')).toBe('zh#Hant');
      expect(isoStrapiToLocalazy('sr-Latn')).toBe('sr#Latn');
    });

    it('should handle language with region and script', () => {
      expect(isoStrapiToLocalazy('zh-Hant-TW')).toBe('zh_TW#Hant');
      expect(isoStrapiToLocalazy('sr-Latn-RS')).toBe('sr_RS#Latn');
    });

    describe('edge cases', () => {
      it('should return null for empty input', () => {
        expect(isoStrapiToLocalazy('')).toBeNull();
        expect(isoStrapiToLocalazy(null as any)).toBeNull();
        expect(isoStrapiToLocalazy(undefined as any)).toBeNull();
      });
    });
  });

  describe('isoLocalazyToStrapi', () => {
    it('should handle simple language codes', () => {
      expect(isoLocalazyToStrapi('en')).toBe('en');
      expect(isoLocalazyToStrapi('cs')).toBe('cs');
      expect(isoLocalazyToStrapi('fr')).toBe('fr');
    });

    it('should convert language with region', () => {
      expect(isoLocalazyToStrapi('en_US')).toBe('en-US');
      expect(isoLocalazyToStrapi('pt_BR')).toBe('pt-BR');
      expect(isoLocalazyToStrapi('zh_CN')).toBe('zh-CN');
    });

    it('should handle language with script', () => {
      expect(isoLocalazyToStrapi('zh#Hant')).toBe('zh-Hant');
      expect(isoLocalazyToStrapi('sr#Latn')).toBe('sr-Latn');
    });

    it('should handle language with region and script', () => {
      expect(isoLocalazyToStrapi('zh_TW#Hant')).toBe('zh-Hant-TW');
      expect(isoLocalazyToStrapi('sr_RS#Latn')).toBe('sr-Latn-RS');
    });
  });

  describe('bidirectional conversion', () => {
    const testCases = [
      ['en', 'en'],
      ['en-US', 'en_US'],
      ['zh-Hant', 'zh#Hant'],
      ['zh-Hant-TW', 'zh_TW#Hant'],
    ];

    testCases.forEach(([strapi, localazy]) => {
      it(`should convert ${strapi} <-> ${localazy} correctly`, () => {
        // Strapi -> Localazy -> Strapi
        expect(isoLocalazyToStrapi(isoStrapiToLocalazy(strapi) as string)).toBe(strapi);

        // Localazy -> Strapi -> Localazy
        expect(isoStrapiToLocalazy(isoLocalazyToStrapi(localazy) as string)).toBe(localazy);
      });
    });
  });
});
