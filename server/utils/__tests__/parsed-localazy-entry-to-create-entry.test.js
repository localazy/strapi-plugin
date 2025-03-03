"use strict";

const parsedLocalazyEntryToCreateEntry = require("../parsed-localazy-entry-to-create-entry");
const allModels = require("../../tests/fixtures/strapi-plugin-all-models");
const simpleMenuWithMediaModel = require("../../tests/fixtures/parsed-localazy-entry-to-create-entry-restaurant-simple-menu");
const cookbookModel = require("../../tests/fixtures/parsed-localazy-entry-to-create-entry-cookbook");
const lessonDZModel = require("../../tests/fixtures/parsed-localazy-entry-to-create-entry-lesson-dz");
const pageDZModel = require("../../tests/fixtures/parsed-localazy-entry-to-create-entry-page-dz");

describe("parsed-localazy-entry-to-create-entry.js", () => {
  it("should return transformed 'restaurant-simple-menu' entry to strapi create entry structure", () => {
    // EXECUTE
    const result = parsedLocalazyEntryToCreateEntry(
      allModels,
      simpleMenuWithMediaModel.parsedLocalazyEntry,
      simpleMenuWithMediaModel.baseEntry,
      simpleMenuWithMediaModel.uid,
      simpleMenuWithMediaModel.locale
    );

    // VERIFY
    const expected = {
      createEntry: {
        name: "hlad, okno",
        description: "Orientální pouliční jídlo v ústech rychlé a snadné!",
        locale: "cs",
      },
      dynamicZoneComponentKeys: []
    };

    expect(result).toEqual(expected);
  });
  it("should return transformed 'cookbook' entry to strapi create entry structure", () => {
    // EXECUTE
    const result = parsedLocalazyEntryToCreateEntry(
      allModels,
      cookbookModel.parsedLocalazyEntry,
      cookbookModel.baseEntry,
      cookbookModel.uid,
      cookbookModel.locale
    );

    // VERIFY
    const expected = {
      createEntry: {
        title: "Pro každý den v roce",
        recipes: [
          {
            name: "Bramborový salát",
            __component: "food.cookbook-item",
            recipe: "Oloupejte brambory, smíchejte je se všemi ingrediencemi a máte hotovo. Bon apetit!",
            author_name: "Mr. Bramborová hlava",
            gallery: [
              {
                image_title: "Syrové brambory",
                __component: "food.gallery-item",
                image_description: "Čerstvý!",
              },
              {
                image_title: "Salát",
                __component: "food.gallery-item",
                image_description: "Mňam!",
              },
            ],
            ingredients: [
              {
                name: "Brambory",
                __component: "food.recipe-ingredient",
                unit: "kg",
              },
              {
                name: "Hrášek",
                __component: "food.recipe-ingredient",
                unit: "plechovka",
              },
              {
                name: "Kukuřice",
                __component: "food.recipe-ingredient",
                unit: "plechovka",
              },
              {
                name: "Mayo",
                __component: "food.recipe-ingredient",
                unit: "lžíce",
              },
              {
                name: "Sýr",
                __component: "food.recipe-ingredient",
                unit: "blok",
              },
              {
                name: "Apple",
                __component: "food.recipe-ingredient",
                unit: "ks",
              },
            ],
          },
        ],
        gallery: {
          __component: "food.gallery",
          annotation: "Podívejte se na naše chutné jídlo, pak čtěte dál a ponořte se do kulinářského nebe!",
          main_image: {
            __component: "food.gallery-item",
            image_title: "Kuchařka",
            image_description: "Brožura II",
          },
          gallery: [
            {
              image_description: "Brožura a listy a vidlice.",
              __component: "food.gallery-item",
            },
            {
              image_title: "Koření",
              __component: "food.gallery-item",
            },
          ],
        },
        locale: "cs",
      },
      dynamicZoneComponentKeys: [],
    };

    expect(result).toEqual(expected);
  });

  it("should return transformed 'lesson' entry including Dynamic Zones to strapi create entry structure (for existing entry)", () => {
    // EXECUTE
    const result = parsedLocalazyEntryToCreateEntry(
      allModels,
      lessonDZModel.parsedLocalazyEntry,
      lessonDZModel.baseEntry,
      lessonDZModel.uid,
    );

    // VERIFY
    const expected = {
      createEntry: {
        title: "Test: Přidání",
        description: "Otestujte si své dovednosti, které jsme se naučili v předchozí lekci.",
        lesson_type: [
          {
            title: "Zvolte správnou odpověď",
            __component: "lesson.quiz",
            questions: [
              {
                question: "1 + 1 = ",
                __component: "lesson.survey-question",
              },
              {
                question: "5 + 15 = ",
                __component: "lesson.survey-question",
              },
              {
                question: "Kolik šálků je na fotografii?",
                __component: "lesson.survey-question",
              },
            ],
            answers: [
              {
                correct_answer: "2",
                __component: "lesson.answers",
              },
              {
                correct_answer: "20",
                __component: "lesson.answers",
              },
              {
                correct_answer: "15",
                __component: "lesson.answers",
              },
            ],
          },
        ],
      },
      dynamicZoneComponentKeys: [
        {
          key: "lesson_type.0.__component",
          component: "lesson.quiz",
        },
      ]
    };

    expect(result).toEqual(expected);
  });

  it("should return transformed 'page' entry including Dynamic Zones to strapi create entry structure (for non-existing entry)", () => {
    // EXECUTE
    const { createEntry } = parsedLocalazyEntryToCreateEntry(
      allModels,
      pageDZModel.parsedLocalazyEntry,
      pageDZModel.baseEntry,
      pageDZModel.uid,
      pageDZModel.locale,
    );

    // VERIFY
    const expected = {
      title: "Software IP Intelligence",
      slug: "ip-intelligence-software",
      path: "/ip-intelligence software",
      seo: {
        __component: "seo.seo",
        title: "Software IP Intelligence",
        description: "Popis stránky IP Intelligence Software.",
        canonical: "ip-intelligence-software",
      },
      hero: {
        __component: "global.hero",
        preTitle: "Inteligentní software před IP",
        title: "Inteligentní software před IP",
        text: "Text softwaru Hero Pre-IP Intelligence",
        animatedText: {
          __component: "hero.animated-text",
          items: [
            {
              text: "hej",
              __component: "hero.animated-text-items",
            },
            {
              text: "Člověk",
              __component: "hero.animated-text-items",
            },
            {
              text: "Úžasné",
              __component: "hero.animated-text-items",
            },
            {
              text: "Práce!",
              __component: "hero.animated-text-items",
            },
          ],
        },
      },
      components: [
        undefined,
        {
          items: [
            {
              text: "Funkce One",
              __component: "global.feature",
            },
            {
              text: "Funkce dva",
              __component: "global.feature",
            },
            {
              text: "Funkce tři",
              __component: "global.feature",
            },
          ],
        },
      ],
      locale: "cs",
    };

    expect(createEntry).toEqual(expected);
  });
});
