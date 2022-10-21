"use strict";

const parsedLocalazyEntryToCreateEntry = require("../parsed-localazy-entry-to-create-entry");
const allModels = require("../../tests/fixtures/strapi-plugin-all-models");
const simpleMenuWithMediaModel = require("../../tests/fixtures/parsed-localazy-entry-to-create-entry-restaurant-simple-menu");
const cookbookModel = require("../../tests/fixtures/parsed-localazy-entry-to-create-entry-cookbook");
const lessonDZModel = require("../../tests/fixtures/parsed-localazy-entry-to-create-entry-lesson-dz");
const sampleJSONDZModel = require("../../tests/fixtures/parsed-localazy-entry-to-create-entry-sample-json-dz");

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

  it("should return transformed 'lesson' entry including Dynamic Zones to strapi create entry structure", () => {
    // EXECUTE
    const result = parsedLocalazyEntryToCreateEntry(
      allModels,
      lessonDZModel.parsedLocalazyEntry,
      lessonDZModel.baseEntry,
      lessonDZModel.uid,
      lessonDZModel.locale
    );

    // VERIFY
    const expected = {
      createEntry: {
        title: "Test: Sčítání",
        description: "Otestujte si své dovednosti, které jsme se naučili v předchozí lekci.",
        lesson_type: [
          {
            title: "Vyberte správnou odpověď",
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
                question: "Kolik pohárů je na fotce?",
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
        locale: "cs",
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

  it("should return transformed 'sample-json' entry including Dynamic Zones to strapi create entry structure", () => {
    // EXECUTE
    const result = parsedLocalazyEntryToCreateEntry(
      allModels,
      sampleJSONDZModel.parsedLocalazyEntry,
      sampleJSONDZModel.baseEntry,
      sampleJSONDZModel.uid,
    );

    // VERIFY
    const expected = {
      createEntry: {
        purpose: "Bar",
        repeatable_component_property: [
          {
            name: "Položka 1",
            __component: "restaurant.menu-item",
            description: "Nějaký popis",
          },
          {
            name: "Položka 2",
            __component: "restaurant.menu-item",
            description: "Nějaký další popis",
          },
        ],
        dynamic_property: [
          {
            image_title: "Nějaký název obrázku",
            __component: "food.gallery-item",
            image_description: "Nějaký popis obrázku",
          },
          {
            name: "Přísada I",
            __component: "food.recipe-ingredient",
          },
          {
            name: "První položka CB",
            __component: "food.cookbook-item",
            author_name: "Já",
            ingredients: [
              {
                name: "První Ingr DZ",
                __component: "food.recipe-ingredient",
              },
            ],
            gallery: [
              {
                image_title: "Obrázek G Jedna",
                __component: "food.gallery-item",
                image_description: "Obrázek G Popis Jedna",
              },
            ],
          },
          {
            name: "Druhá přísada",
            __component: "food.recipe-ingredient",
          },
        ],
      },
      dynamicZoneComponentKeys: [
        {
          key: "dynamic_property.2.__component",
          component: "food.cookbook-item",
        },
        {
          key: "dynamic_property.0.__component",
          component: "food.gallery-item",
        },
        {
          key: "dynamic_property.1.__component",
          component: "food.recipe-ingredient",
        },
        {
          key: "dynamic_property.3.__component",
          component: "food.recipe-ingredient",
        },
      ]
    };

    expect(result).toEqual(expected);
  });
});
