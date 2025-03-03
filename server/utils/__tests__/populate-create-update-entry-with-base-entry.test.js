"use strict";

const allModels = require("../../tests/fixtures/strapi-plugin-all-models");
const simpleFlatSimpleModel = require("../../tests/fixtures/populate-create-update-entry-with-base-entry-restaurant-simple-flat-simple");
const simpleFlatWithMediaModel = require("../../tests/fixtures/populate-create-update-entry-with-base-entry-restaurant-simple-flat-with-media");
const simpleMenuWithMediaModel = require("../../tests/fixtures/populate-create-update-entry-with-base-entry-restaurant-simple-menu-with-media");
const simpleMenuEmptyModel = require("../../tests/fixtures/populate-create-update-entry-with-base-entry-restaurant-simple-menu-empty");
const sampleJSONModel = require("../../tests/fixtures/populate-create-update-entry-with-base-entry-sample-json");
const cookbookModel = require("../../tests/fixtures/populate-create-update-entry-with-base-entry-cookbook");
const cookbookEmptyRecipesModel = require("../../tests/fixtures/populate-create-update-entry-with-base-entry-cookbook-empty-recipes");
const sampleJSONWithDZsModel = require("../../tests/fixtures/populate-create-update-entry-with-base-entry-sample-json-dz");
const lessonWithDZsModel = require("../../tests/fixtures/populate-create-update-entry-with-base-entry-lesson-dz");

const populateCreateUpdateEntryWithBaseEntry = require("../populate-create-update-entry-with-base-entry");



const mocks = require("../../../test/helpers/mocks");

describe("populate-create-update-entry-with-base-entry.js", () => {
  Object.defineProperty(global, "strapi", {
    value: mocks.strapi,
  });
  jest.spyOn(mocks.strapi.entityService, "findOne").mockImplementation(() => {
    return {
      id: 24,
      title: "Pro každý den v roce",
      localizations: [],
    }
  });

  it("should populate a 'restaurant-simple-flat' correctly", async () => {
    const populatedEntry = await populateCreateUpdateEntryWithBaseEntry(
      allModels,
      simpleFlatSimpleModel.updateEntry,
      simpleFlatSimpleModel.baseEntry,
      simpleFlatSimpleModel.fullyPopulatedLocalizedEntry,
      simpleFlatSimpleModel.uid,
      simpleFlatSimpleModel.locale,
    );

    const expected = {
      id: 47,
      name: "hlad, okno",
      description: "Orientální pouliční jídlo v ústech rychlé a snadné!",
      established_at: "2022-10-01",
      is_franchise: false,
      contact_email: "david@localazy.com",
      cuisine: "Thai",
      featured_image: null,
    };

    expect(populatedEntry).toEqual(expected);
  });

  it("should populate a 'restaurant-simple-flat' with media correctly", async () => {
    const populatedEntry = await populateCreateUpdateEntryWithBaseEntry(
      allModels,
      simpleFlatWithMediaModel.updateEntry,
      simpleFlatWithMediaModel.baseEntry,
      simpleFlatWithMediaModel.fullyPopulatedLocalizedEntry,
      simpleFlatWithMediaModel.uid,
      simpleFlatWithMediaModel.locale,
    );

    const expected = {
      id: 52,
      name: "Michelin",
      description: "Najbardziej wyszukana restauracja w Układzie Słonecznym. Sprawdź nasze menu stworzone przez jedynego Gordona Ramsaya.",
      established_at: "2002-06-23",
      is_franchise: true,
      contact_email: "david@localazy.com",
      cuisine: "French",
      featured_image: {
        id: 1,
        name: "jason-leung-poI7DelFiVA-unsplash.jpg",
        alternativeText: "jason-leung-poI7DelFiVA-unsplash.jpg",
        caption: "jason-leung-poI7DelFiVA-unsplash.jpg",
        width: 5596,
        height: 3731,
        formats: {
          thumbnail: {
            name: "thumbnail_jason-leung-poI7DelFiVA-unsplash.jpg",
            hash: "thumbnail_jason_leung_po_I7_Del_Fi_VA_unsplash_508d22c55b",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 234,
            height: 156,
            size: 11.74,
            url: "/uploads/thumbnail_jason_leung_po_I7_Del_Fi_VA_unsplash_508d22c55b.jpg",
          },
          large: {
            name: "large_jason-leung-poI7DelFiVA-unsplash.jpg",
            hash: "large_jason_leung_po_I7_Del_Fi_VA_unsplash_508d22c55b",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 1000,
            height: 666,
            size: 140.2,
            url: "/uploads/large_jason_leung_po_I7_Del_Fi_VA_unsplash_508d22c55b.jpg",
          },
          medium: {
            name: "medium_jason-leung-poI7DelFiVA-unsplash.jpg",
            hash: "medium_jason_leung_po_I7_Del_Fi_VA_unsplash_508d22c55b",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 750,
            height: 500,
            size: 86.32,
            url: "/uploads/medium_jason_leung_po_I7_Del_Fi_VA_unsplash_508d22c55b.jpg",
          },
          small: {
            name: "small_jason-leung-poI7DelFiVA-unsplash.jpg",
            hash: "small_jason_leung_po_I7_Del_Fi_VA_unsplash_508d22c55b",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 500,
            height: 333,
            size: 42.51,
            url: "/uploads/small_jason_leung_po_I7_Del_Fi_VA_unsplash_508d22c55b.jpg",
          },
        },
        hash: "jason_leung_po_I7_Del_Fi_VA_unsplash_508d22c55b",
        ext: ".jpg",
        mime: "image/jpeg",
        size: 3461.64,
        url: "/uploads/jason_leung_po_I7_Del_Fi_VA_unsplash_508d22c55b.jpg",
        previewUrl: null,
        provider: "local",
        provider_metadata: null,
      },
    };

    expect(populatedEntry).toEqual(expected);
  });

  // with menu
  it("should populate a 'restaurant-simple-menu' with menu and media correctly", async () => {
    const populatedEntry = await populateCreateUpdateEntryWithBaseEntry(
      allModels,
      simpleMenuWithMediaModel.updateEntry,
      simpleMenuWithMediaModel.baseEntry,
      simpleMenuWithMediaModel.fullyPopulatedLocalizedEntry,
      simpleMenuWithMediaModel.uid,
      simpleMenuWithMediaModel.locale,
    );

    const expected = {
      id: 37,
      name: "Głodne okno",
      description: "Orientalne jedzenie uliczne w ustach szybko i łatwo!",
      established_at: "2022-10-01",
      is_franchise: false,
      contact_email: "david@localazy.com",
      cuisine: "Thai",
      capacity: 68,
      our_story: "Za nami jest więcej**! Sprawdź naszą historię na [Localazy] (https://localazy.com).\n\n! [Logo_sq-01.png] (/uploads/Logo_sq_01_08b9bb6be1.png)",
      used_cookbooks: {
        id: 1,
      },
      menu: [
        {
          id: 40,
          name: "Zupa Curry",
          price: 5,
          currency: "$",
          description: "_Super pyszna zupa. _\n\n<u>Ostrzeżenie: Ostre jak diabli! </u>",
          is_available: true,
          food_gallery: [
            {
              id: 3,
              name: "emy-XoByiBymX20-unsplash.jpg",
              alternativeText: "emy-XoByiBymX20-unsplash.jpg",
              caption: "emy-XoByiBymX20-unsplash.jpg",
              width: 5184,
              height: 3456,
              formats: {
                thumbnail: {
                  name: "thumbnail_emy-XoByiBymX20-unsplash.jpg",
                  hash: "thumbnail_emy_Xo_Byi_Bym_X20_unsplash_a5d1373d3a",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 234,
                  height: 156,
                  size: 11.04,
                  url: "/uploads/thumbnail_emy_Xo_Byi_Bym_X20_unsplash_a5d1373d3a.jpg",
                },
                large: {
                  name: "large_emy-XoByiBymX20-unsplash.jpg",
                  hash: "large_emy_Xo_Byi_Bym_X20_unsplash_a5d1373d3a",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 1000,
                  height: 667,
                  size: 97.59,
                  url: "/uploads/large_emy_Xo_Byi_Bym_X20_unsplash_a5d1373d3a.jpg",
                },
                medium: {
                  name: "medium_emy-XoByiBymX20-unsplash.jpg",
                  hash: "medium_emy_Xo_Byi_Bym_X20_unsplash_a5d1373d3a",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 750,
                  height: 500,
                  size: 63.15,
                  url: "/uploads/medium_emy_Xo_Byi_Bym_X20_unsplash_a5d1373d3a.jpg",
                },
                small: {
                  name: "small_emy-XoByiBymX20-unsplash.jpg",
                  hash: "small_emy_Xo_Byi_Bym_X20_unsplash_a5d1373d3a",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 500,
                  height: 333,
                  size: 33.98,
                  url: "/uploads/small_emy_Xo_Byi_Bym_X20_unsplash_a5d1373d3a.jpg",
                },
              },
              hash: "emy_Xo_Byi_Bym_X20_unsplash_a5d1373d3a",
              ext: ".jpg",
              mime: "image/jpeg",
              size: 1411.68,
              url: "/uploads/emy_Xo_Byi_Bym_X20_unsplash_a5d1373d3a.jpg",
              previewUrl: null,
              provider: "local",
              provider_metadata: null,
            },
            {
              id: 4,
              name: "ting-tian-al9eh9QkdPA-unsplash.jpg",
              alternativeText: "ting-tian-al9eh9QkdPA-unsplash.jpg",
              caption: "ting-tian-al9eh9QkdPA-unsplash.jpg",
              width: 3840,
              height: 5760,
              formats: {
                thumbnail: {
                  name: "thumbnail_ting-tian-al9eh9QkdPA-unsplash.jpg",
                  hash: "thumbnail_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 104,
                  height: 156,
                  size: 6.06,
                  url: "/uploads/thumbnail_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
                },
                large: {
                  name: "large_ting-tian-al9eh9QkdPA-unsplash.jpg",
                  hash: "large_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 667,
                  height: 1000,
                  size: 202.98,
                  url: "/uploads/large_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
                },
                medium: {
                  name: "medium_ting-tian-al9eh9QkdPA-unsplash.jpg",
                  hash: "medium_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 500,
                  height: 750,
                  size: 120.06,
                  url: "/uploads/medium_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
                },
                small: {
                  name: "small_ting-tian-al9eh9QkdPA-unsplash.jpg",
                  hash: "small_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 333,
                  height: 500,
                  size: 54.32,
                  url: "/uploads/small_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
                },
              },
              hash: "ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
              ext: ".jpg",
              mime: "image/jpeg",
              size: 5952.03,
              url: "/uploads/ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
              previewUrl: null,
              provider: "local",
              provider_metadata: null,
            },
          ],
        },
      ],
      featured_image: null,
    };

    expect(populatedEntry).toEqual(expected);
  });

  it("should populate a 'restaurant-simple-menu' without menu correctly", async () => {
    const populatedEntry = await populateCreateUpdateEntryWithBaseEntry(
      allModels,
      simpleMenuEmptyModel.updateEntry,
      simpleMenuEmptyModel.baseEntry,
      simpleMenuEmptyModel.fullyPopulatedLocalizedEntry,
      simpleMenuEmptyModel.uid,
      simpleMenuEmptyModel.locale,
    );

    const expected = {
      id: 39,
      name: "Niebieska ostryga",
      description: "Widzisz jedzenie? Lepiej powiedzmy, że owoce morza!",
      established_at: "1822-07-09",
      is_franchise: null,
      contact_email: "david@localazy.com",
      cuisine: "Italian",
      capacity: 16,
      our_story: "Długa tradycja, mądrość przekazywana z pokolenia na pokolenie... Od 1822 roku.",
      supported_restaurants: [
        {
          id: 2,
        },
        {
          id: 1,
        },
      ],
      used_cookbooks: {
        id: 1,
      },
      menu: [
      ],
      featured_image: null,
    };

    expect(populatedEntry).toEqual(expected);
  });

  it("should populate a 'sample-json' correctly", async () => {
    const populatedEntry = await populateCreateUpdateEntryWithBaseEntry(
      allModels,
      sampleJSONModel.updateEntry,
      sampleJSONModel.baseEntry,
      sampleJSONModel.fullyPopulatedLocalizedEntry,
      sampleJSONModel.uid,
      sampleJSONModel.locale,
    );

    const expected = {
      id: 17,
      purpose: "Foo CZ",
      data: {
        foo: "bar",
        bar: {
          foo: "baz",
        },
      },
    };

    expect(populatedEntry).toEqual(expected);
  });

  it("should populate a 'cookbook' correctly", async () => {
    const populatedEntry = await populateCreateUpdateEntryWithBaseEntry(
      allModels,
      cookbookModel.updateEntry,
      cookbookModel.baseEntry,
      cookbookModel.fullyPopulatedLocalizedEntry,
      cookbookModel.uid,
      cookbookModel.locale,
    );

    const expected = {
      id: 24,
      title: "Pro každý den v roce",
      used_in_restaurants: [
        {
          id: 1,
        },
        {
          id: 3,
        },
      ],
      author_name: "David V.",
      pages: 365,
      recipes: [
        {
          id: 20,
          name: "Bramborový salát",
          recipe: "Oloupejte brambory, smíchejte je se všemi ingrediencemi a máte hotovo. Bon apetit!",
          estimated_cook_time: "00:30:00.000",
          difficulty: "easy",
          author_name: "Mr. Bramborová hlava",
          gallery: [
            {
              id: 100,
              image_title: "Syrové brambory",
              image_description: "Čerstvý!",
              image: {
                id: 6,
                name: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                alternativeText: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                caption: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                width: 2268,
                height: 4032,
                formats: {
                  thumbnail: {
                    name: "thumbnail_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                    hash: "thumbnail_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
                    ext: ".jpg",
                    mime: "image/jpeg",
                    path: null,
                    width: 88,
                    height: 156,
                    size: 5.35,
                    url: "/uploads/thumbnail_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
                  },
                  large: {
                    name: "large_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                    hash: "large_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
                    ext: ".jpg",
                    mime: "image/jpeg",
                    path: null,
                    width: 563,
                    height: 1000,
                    size: 108.15,
                    url: "/uploads/large_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
                  },
                  medium: {
                    name: "medium_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                    hash: "medium_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
                    ext: ".jpg",
                    mime: "image/jpeg",
                    path: null,
                    width: 422,
                    height: 750,
                    size: 65.52,
                    url: "/uploads/medium_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
                  },
                  small: {
                    name: "small_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                    hash: "small_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
                    ext: ".jpg",
                    mime: "image/jpeg",
                    path: null,
                    width: 281,
                    height: 500,
                    size: 34.23,
                    url: "/uploads/small_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
                  },
                },
                hash: "rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
                ext: ".jpg",
                mime: "image/jpeg",
                size: 1081.59,
                url: "/uploads/rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
                previewUrl: null,
                provider: "local",
                provider_metadata: null,
              },
            },
            {
              id: 101,
              image_title: "Salát",
              image_description: "Mňam!",
              image: {
                id: 7,
                name: "jeffrey-betts-PeyzQt7tMk0-unsplash.jpg",
                alternativeText: "jeffrey-betts-PeyzQt7tMk0-unsplash.jpg",
                caption: "jeffrey-betts-PeyzQt7tMk0-unsplash.jpg",
                width: 4608,
                height: 3456,
                formats: {
                  thumbnail: {
                    name: "thumbnail_jeffrey-betts-PeyzQt7tMk0-unsplash.jpg",
                    hash: "thumbnail_jeffrey_betts_Peyz_Qt7t_Mk0_unsplash_9650d628db",
                    ext: ".jpg",
                    mime: "image/jpeg",
                    path: null,
                    width: 208,
                    height: 156,
                    size: 9.03,
                    url: "/uploads/thumbnail_jeffrey_betts_Peyz_Qt7t_Mk0_unsplash_9650d628db.jpg",
                  },
                  large: {
                    name: "large_jeffrey-betts-PeyzQt7tMk0-unsplash.jpg",
                    hash: "large_jeffrey_betts_Peyz_Qt7t_Mk0_unsplash_9650d628db",
                    ext: ".jpg",
                    mime: "image/jpeg",
                    path: null,
                    width: 1000,
                    height: 750,
                    size: 102.77,
                    url: "/uploads/large_jeffrey_betts_Peyz_Qt7t_Mk0_unsplash_9650d628db.jpg",
                  },
                  medium: {
                    name: "medium_jeffrey-betts-PeyzQt7tMk0-unsplash.jpg",
                    hash: "medium_jeffrey_betts_Peyz_Qt7t_Mk0_unsplash_9650d628db",
                    ext: ".jpg",
                    mime: "image/jpeg",
                    path: null,
                    width: 750,
                    height: 563,
                    size: 66.26,
                    url: "/uploads/medium_jeffrey_betts_Peyz_Qt7t_Mk0_unsplash_9650d628db.jpg",
                  },
                  small: {
                    name: "small_jeffrey-betts-PeyzQt7tMk0-unsplash.jpg",
                    hash: "small_jeffrey_betts_Peyz_Qt7t_Mk0_unsplash_9650d628db",
                    ext: ".jpg",
                    mime: "image/jpeg",
                    path: null,
                    width: 500,
                    height: 375,
                    size: 35.17,
                    url: "/uploads/small_jeffrey_betts_Peyz_Qt7t_Mk0_unsplash_9650d628db.jpg",
                  },
                },
                hash: "jeffrey_betts_Peyz_Qt7t_Mk0_unsplash_9650d628db",
                ext: ".jpg",
                mime: "image/jpeg",
                size: 1664.79,
                url: "/uploads/jeffrey_betts_Peyz_Qt7t_Mk0_unsplash_9650d628db.jpg",
                previewUrl: null,
                provider: "local",
                provider_metadata: null,
              },
            },
          ],
          ingredients: [
            {
              id: 115,
              name: "Brambory",
              amount: 2,
              unit: "kg",
              is_required: true,
            },
            {
              id: 116,
              name: "Hrášek",
              amount: 0.5,
              unit: "plechovka",
              is_required: true,
            },
            {
              id: 117,
              name: "Kukuřice",
              amount: 0.5,
              unit: "plechovka",
              is_required: true,
            },
            {
              id: 118,
              name: "Majonéza",
              amount: 4,
              unit: "1",
              is_required: true,
            },
            {
              id: 119,
              name: "Sýr",
              amount: 1,
              unit: "1",
              is_required: true,
            },
            {
              id: 120,
              name: "Jablko",
              amount: 1,
              unit: "ks",
              is_required: true,
            },
          ],
        },
      ],
      gallery: {
        id: 24,
        optional_title: null,
        annotation: "Podívejte se na naše chutné jídlo, pak čtěte dál a ponořte se do kulinářského nebe!",
        main_image: {
          id: 102,
          image_title: "Kuchařka",
          image_description: "Booklet",
          image: {
            id: 9,
            name: "dan-gold-5O1ddenSM4g-unsplash.jpg",
            alternativeText: "dan-gold-5O1ddenSM4g-unsplash.jpg",
            caption: "dan-gold-5O1ddenSM4g-unsplash.jpg",
            width: 6000,
            height: 3376,
            formats: {
              thumbnail: {
                name: "thumbnail_dan-gold-5O1ddenSM4g-unsplash.jpg",
                hash: "thumbnail_dan_gold_5_O1dden_SM_4g_unsplash_5adef7d907",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 245,
                height: 138,
                size: 7.44,
                url: "/uploads/thumbnail_dan_gold_5_O1dden_SM_4g_unsplash_5adef7d907.jpg",
              },
              large: {
                name: "large_dan-gold-5O1ddenSM4g-unsplash.jpg",
                hash: "large_dan_gold_5_O1dden_SM_4g_unsplash_5adef7d907",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 1000,
                height: 563,
                size: 52.67,
                url: "/uploads/large_dan_gold_5_O1dden_SM_4g_unsplash_5adef7d907.jpg",
              },
              medium: {
                name: "medium_dan-gold-5O1ddenSM4g-unsplash.jpg",
                hash: "medium_dan_gold_5_O1dden_SM_4g_unsplash_5adef7d907",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 750,
                height: 422,
                size: 35.15,
                url: "/uploads/medium_dan_gold_5_O1dden_SM_4g_unsplash_5adef7d907.jpg",
              },
              small: {
                name: "small_dan-gold-5O1ddenSM4g-unsplash.jpg",
                hash: "small_dan_gold_5_O1dden_SM_4g_unsplash_5adef7d907",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 500,
                height: 281,
                size: 19.95,
                url: "/uploads/small_dan_gold_5_O1dden_SM_4g_unsplash_5adef7d907.jpg",
              },
            },
            hash: "dan_gold_5_O1dden_SM_4g_unsplash_5adef7d907",
            ext: ".jpg",
            mime: "image/jpeg",
            size: 972.68,
            url: "/uploads/dan_gold_5_O1dden_SM_4g_unsplash_5adef7d907.jpg",
            previewUrl: null,
            provider: "local",
            provider_metadata: null,
          },
        },
        gallery: [
          {
            id: 103,
            image_title: null,
            image_description: "Brožura, listy a vidlička.",
            image: {
              id: 11,
              name: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
              alternativeText: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
              caption: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
              width: 6127,
              height: 3844,
              formats: {
                thumbnail: {
                  name: "thumbnail_heather-ford-G4LFhuLXhLE-unsplash.jpg",
                  hash: "thumbnail_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 245,
                  height: 154,
                  size: 9.54,
                  url: "/uploads/thumbnail_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
                },
                large: {
                  name: "large_heather-ford-G4LFhuLXhLE-unsplash.jpg",
                  hash: "large_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 1000,
                  height: 628,
                  size: 117.56,
                  url: "/uploads/large_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
                },
                medium: {
                  name: "medium_heather-ford-G4LFhuLXhLE-unsplash.jpg",
                  hash: "medium_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 750,
                  height: 471,
                  size: 66.32,
                  url: "/uploads/medium_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
                },
                small: {
                  name: "small_heather-ford-G4LFhuLXhLE-unsplash.jpg",
                  hash: "small_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 500,
                  height: 314,
                  size: 31.42,
                  url: "/uploads/small_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
                },
              },
              hash: "heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
              ext: ".jpg",
              mime: "image/jpeg",
              size: 6971.47,
              url: "/uploads/heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
              previewUrl: null,
              provider: "local",
              provider_metadata: null,
            },
          },
          {
            id: 104,
            image_title: "Koření",
            image_description: null,
            image: {
              id: 10,
              name: "calum-lewis-vA1L1jRTM70-unsplash.jpg",
              alternativeText: "calum-lewis-vA1L1jRTM70-unsplash.jpg",
              caption: "calum-lewis-vA1L1jRTM70-unsplash.jpg",
              width: 3569,
              height: 5353,
              formats: {
                thumbnail: {
                  name: "thumbnail_calum-lewis-vA1L1jRTM70-unsplash.jpg",
                  hash: "thumbnail_calum_lewis_v_A1_L1j_RTM_70_unsplash_5aff3a8997",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 104,
                  height: 156,
                  size: 5.55,
                  url: "/uploads/thumbnail_calum_lewis_v_A1_L1j_RTM_70_unsplash_5aff3a8997.jpg",
                },
                large: {
                  name: "large_calum-lewis-vA1L1jRTM70-unsplash.jpg",
                  hash: "large_calum_lewis_v_A1_L1j_RTM_70_unsplash_5aff3a8997",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 667,
                  height: 1000,
                  size: 116.32,
                  url: "/uploads/large_calum_lewis_v_A1_L1j_RTM_70_unsplash_5aff3a8997.jpg",
                },
                medium: {
                  name: "medium_calum-lewis-vA1L1jRTM70-unsplash.jpg",
                  hash: "medium_calum_lewis_v_A1_L1j_RTM_70_unsplash_5aff3a8997",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 500,
                  height: 750,
                  size: 72.75,
                  url: "/uploads/medium_calum_lewis_v_A1_L1j_RTM_70_unsplash_5aff3a8997.jpg",
                },
                small: {
                  name: "small_calum-lewis-vA1L1jRTM70-unsplash.jpg",
                  hash: "small_calum_lewis_v_A1_L1j_RTM_70_unsplash_5aff3a8997",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 333,
                  height: 500,
                  size: 36.52,
                  url: "/uploads/small_calum_lewis_v_A1_L1j_RTM_70_unsplash_5aff3a8997.jpg",
                },
              },
              hash: "calum_lewis_v_A1_L1j_RTM_70_unsplash_5aff3a8997",
              ext: ".jpg",
              mime: "image/jpeg",
              size: 2305.97,
              url: "/uploads/calum_lewis_v_A1_L1j_RTM_70_unsplash_5aff3a8997.jpg",
              previewUrl: null,
              provider: "local",
              provider_metadata: null,
            },
          },
        ],
      },
    };

    expect(populatedEntry).toEqual(expected);
  });

  it("should populate a 'cookbook' without recipes correctly", async () => {
    const populatedEntry = await populateCreateUpdateEntryWithBaseEntry(
      allModels,
      cookbookEmptyRecipesModel.updateEntry,
      cookbookEmptyRecipesModel.baseEntry,
      cookbookEmptyRecipesModel.fullyPopulatedLocalizedEntry,
      cookbookEmptyRecipesModel.uid,
      cookbookEmptyRecipesModel.locale,
    );

    const expected = {
      id: 34,
      title: "Jedna cholernie pusta książka kucharska",
      author_name: "Jamie Oliver",
      pages: 0,
      recipes: [
      ],
      gallery: {
        id: 34,
        optional_title: "Jamie's cookbook",
        annotation: "Zupełnie nowy, zawiera zero przepisów. Stwórz własne!",
        main_image: {
          id: 140,
          image_title: "Knajpa",
          image_description: "Pub",
          image: {
            id: 12,
            name: "rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
            alternativeText: "rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
            caption: "rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
            width: 2839,
            height: 3785,
            formats: {
              thumbnail: {
                name: "thumbnail_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "thumbnail_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 117,
                height: 156,
                size: 5.26,
                url: "/uploads/thumbnail_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
              large: {
                name: "large_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "large_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 750,
                height: 1000,
                size: 114.8,
                url: "/uploads/large_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
              medium: {
                name: "medium_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "medium_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 562,
                height: 750,
                size: 69.07,
                url: "/uploads/medium_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
              small: {
                name: "small_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "small_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 375,
                height: 500,
                size: 35.47,
                url: "/uploads/small_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
            },
            hash: "rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
            ext: ".jpg",
            mime: "image/jpeg",
            size: 1736.7,
            url: "/uploads/rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
            previewUrl: null,
            provider: "local",
            provider_metadata: null,
          },
        },
        gallery: [
        ],
      },
    };

    expect(populatedEntry).toEqual(expected);
  });

  it("should populate a 'sample-json' including DZs correctly", async () => {
    const populatedEntry = await populateCreateUpdateEntryWithBaseEntry(
      allModels,
      sampleJSONWithDZsModel.updateEntry,
      sampleJSONWithDZsModel.baseEntry,
      sampleJSONWithDZsModel.fullyPopulatedLocalizedEntry,
      sampleJSONWithDZsModel.uid,
      sampleJSONWithDZsModel.locale,
    );

    const expected = {
      id: 24,
      purpose: "Bar",
      data: {
        bar: "baz",
      },
      dynamic_property: [
        {
          id: 170,
          image_title: "Nějaký název obrázku",
          image_description: "Nějaký popis obrázku",
          image: {
            id: 11,
            name: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
            alternativeText: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
            caption: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
            width: 6127,
            height: 3844,
            formats: {
              thumbnail: {
                name: "thumbnail_heather-ford-G4LFhuLXhLE-unsplash.jpg",
                hash: "thumbnail_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 245,
                height: 154,
                size: 9.54,
                url: "/uploads/thumbnail_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
              },
              large: {
                name: "large_heather-ford-G4LFhuLXhLE-unsplash.jpg",
                hash: "large_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 1000,
                height: 628,
                size: 117.56,
                url: "/uploads/large_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
              },
              medium: {
                name: "medium_heather-ford-G4LFhuLXhLE-unsplash.jpg",
                hash: "medium_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 750,
                height: 471,
                size: 66.32,
                url: "/uploads/medium_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
              },
              small: {
                name: "small_heather-ford-G4LFhuLXhLE-unsplash.jpg",
                hash: "small_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 500,
                height: 314,
                size: 31.42,
                url: "/uploads/small_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
              },
            },
            hash: "heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            size: 6971.47,
            url: "/uploads/heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
            previewUrl: null,
            provider: "local",
            provider_metadata: null,
          },
          __component: "food.gallery-item",
        },
        {
          id: 191,
          name: "Přísada I",
          amount: null,
          unit: null,
          is_required: true,
          __component: "food.recipe-ingredient",
        },
        {
          id: 36,
          name: "První položka CB",
          recipe: null,
          estimated_cook_time: "00:03:00.000",
          difficulty: "beginner",
          author_name: "Já",
          gallery: [
            {
              id: 171,
              image_title: "Obrázek G Jedna",
              image_description: "Obrázek G Popis Jedna",
            },
            {
              id: 172,
              image_title: "Img G Two",
              image_description: "Img G Desc Two",
            },
          ],
          ingredients: [
            {
              id: 193,
              name: "První Ingr DZ",
              amount: null,
              unit: null,
              is_required: true,
            },
          ],
          __component: "food.cookbook-item",
        },
        {
          id: 192,
          name: "Druhá přísada",
          amount: null,
          unit: null,
          is_required: true,
          __component: "food.recipe-ingredient",
        },
      ],
      repeatable_component_property: [
        {
          id: 61,
          name: "Položka 1",
          price: 1,
          currency: "CZK",
          description: "Nějaký popis",
          is_available: null,
          food_gallery: null,
        },
        {
          id: 62,
          name: "Položka 2",
          price: 2,
          currency: "CZK",
          description: "Nějaký další popis",
          is_available: null,
          food_gallery: [
            {
              id: 6,
              name: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              alternativeText: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              caption: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              width: 2268,
              height: 4032,
              formats: {
                thumbnail: {
                  name: "thumbnail_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                  hash: "thumbnail_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 88,
                  height: 156,
                  size: 5.35,
                  url: "/uploads/thumbnail_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
                },
                large: {
                  name: "large_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                  hash: "large_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 563,
                  height: 1000,
                  size: 108.15,
                  url: "/uploads/large_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
                },
                medium: {
                  name: "medium_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                  hash: "medium_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 422,
                  height: 750,
                  size: 65.52,
                  url: "/uploads/medium_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
                },
                small: {
                  name: "small_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
                  hash: "small_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 281,
                  height: 500,
                  size: 34.23,
                  url: "/uploads/small_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
                },
              },
              hash: "rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              size: 1081.59,
              url: "/uploads/rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
              previewUrl: null,
              provider: "local",
              provider_metadata: null,
            },
          ],
        },
      ],
    };

    expect(populatedEntry).toEqual(expected);
  });

  it("should populate a 'lesson' including DZs correctly", async () => {
    const populatedEntry = await populateCreateUpdateEntryWithBaseEntry(
      allModels,
      lessonWithDZsModel.updateEntry,
      lessonWithDZsModel.baseEntry,
      lessonWithDZsModel.fullyPopulatedLocalizedEntry,
      lessonWithDZsModel.uid,
      lessonWithDZsModel.locale,
    );

    const expected = {
      id: 4,
      title: "Test: Sčítání",
      start_time: "2022-10-01T13:00:00.000Z",
      duration: "02:00:00.000",
      description: "Otestujte si své dovednosti, které jsme se naučili v předchozí lekci.",
      lesson_type: [
        {
          id: 2,
          title: "Vyberte správnou odpověď",
          questions: [
            {
              id: 4,
              question: "1 + 1 = ",
              is_active: true,
              question_number: 1,
            },
            {
              id: 5,
              question: "5 + 15 = ",
              is_active: false,
              question_number: 2,
            },
            {
              id: 6,
              question: "Kolik pohárů je na fotce?",
              is_active: false,
              question_number: 3,
            },
          ],
          answers: [
            {
              id: 4,
              question_number: 1,
              correct_answer: "2",
            },
            {
              id: 5,
              question_number: 2,
              correct_answer: "20",
            },
            {
              id: 6,
              question_number: 3,
              correct_answer: "15",
            },
          ],
          __component: "lesson.quiz",
        },
      ],
    };

    expect(populatedEntry).toEqual(expected);
  });
});
