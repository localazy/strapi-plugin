const { isoStrapiToLocalazy, isoLocalazyToStrapi } = require("../iso-locales-utils");

describe("iso-locales-utils.js", () => {
  describe("transform Strapi ISO to Localazy ISO", () => {
    it("should transform codes containing lang only", () => {
      // setup
      const input = ["en", "fr", "de", "es", "it", "ja", "ko", "pt", "ru", "zh"];

      // execute
      const output = input.map((item) => isoStrapiToLocalazy(item));

      // verify
      const expected = input;
      expect(output).toEqual(expected);
    });

    it("should transform codes containing lang-region", () => {
      // setup
      const input = ["en-US", "fr-CA", "de-DE", "es-ES", "it-IT", "ja-JP", "ko-KR", "pt-BR", "ru-RU", "zh-CN"];

      // execute
      const output = input.map((item) => isoStrapiToLocalazy(item));

      // verify
      const expected = ["en_US", "fr_CA", "de_DE", "es_ES", "it_IT", "ja_JP", "ko_KR", "pt_BR", "ru_RU", "zh_CN"];
      expect(output).toEqual(expected);
    });

    it("should transform codes containing lang-script", () => {
      // setup
      const input = ["en-Latn", "fr-Latn", "de-Latn", "es-Latn", "it-Latn", "ja-Latn", "ko-Latn", "pt-Latn", "ru-Latn", "zh-Latn"];

      // execute
      const output = input.map((item) => isoStrapiToLocalazy(item));

      // verify
      const expected = ["en#Latn", "fr#Latn", "de#Latn", "es#Latn", "it#Latn", "ja#Latn", "ko#Latn", "pt#Latn", "ru#Latn", "zh#Latn"];
      expect(output).toEqual(expected);
    });

    it("should transform codes containing lang-script-region", () => {
      // setup
      const input = ["en-Latn-US", "fr-Latn-CA", "de-Latn-DE", "es-Latn-ES", "it-Latn-IT", "ja-Latn-JP", "ko-Latn-KR", "pt-Latn-BR", "ru-Latn-RU", "zh-Hant-CN"];

      // execute
      const output = input.map((item) => isoStrapiToLocalazy(item));

      // verify
      const expected = ["en_US#Latn", "fr_CA#Latn", "de_DE#Latn", "es_ES#Latn", "it_IT#Latn", "ja_JP#Latn", "ko_KR#Latn", "pt_BR#Latn", "ru_RU#Latn", "zh_CN#Hant"];
      expect(output).toEqual(expected);
    });
  });

  describe("transform Strapi ISO to Localazy ISO", () => {
    it("should transform codes containing lang only", () => {
      // setup
      const input = ["en", "fr", "de", "es", "it", "ja", "ko", "pt", "ru", "zh"];

      // execute
      const output = input.map((item) => isoLocalazyToStrapi(item));

      // verify
      const expected = input;
      expect(output).toEqual(expected);
    });

    it("should transform codes containing lang-region", () => {
      // setup
      const input = ["en_US", "fr_CA", "de_DE", "es_ES", "it_IT", "ja_JP", "ko_KR", "pt_BR", "ru_RU", "zh_CN"];

      // execute
      const output = input.map((item) => isoLocalazyToStrapi(item));

      // verify
      const expected = ["en-US", "fr-CA", "de-DE", "es-ES", "it-IT", "ja-JP", "ko-KR", "pt-BR", "ru-RU", "zh-CN"];
      expect(output).toEqual(expected);
    });

    it("should transform codes containing lang-script", () => {
      // setup
      const input = ["en#Latn", "fr#Latn", "de#Latn", "es#Latn", "it#Latn", "ja#Latn", "ko#Latn", "pt#Latn", "ru#Latn", "zh#Latn"];

      // execute
      const output = input.map((item) => isoLocalazyToStrapi(item));

      // verify
      const expected = ["en-Latn", "fr-Latn", "de-Latn", "es-Latn", "it-Latn", "ja-Latn", "ko-Latn", "pt-Latn", "ru-Latn", "zh-Latn"];
      expect(output).toEqual(expected);
    });

    it("should transform codes containing lang-script-region", () => {
      // setup
      const input = ["en_US#Latn", "fr_CA#Latn", "de_DE#Latn", "es_ES#Latn", "it_IT#Latn", "ja_JP#Latn", "ko_KR#Latn", "pt_BR#Latn", "ru_RU#Latn", "zh_CN#Hant"];

      // execute
      const output = input.map((item) => isoLocalazyToStrapi(item));
      // verify
      const expected = ["en-Latn-US", "fr-Latn-CA", "de-Latn-DE", "es-Latn-ES", "it-Latn-IT", "ja-Latn-JP", "ko-Latn-KR", "pt-Latn-BR", "ru-Latn-RU", "zh-Hant-CN"];
      expect(output).toEqual(expected);
    });
  });
});
