"use strict";

const parsedLocalazyEntryToCreateEntry = require("../parsed-localazy-entry-to-create-entry");
const allModels = require("../../tests/fixtures/strapi-plugin-all-models");
const simpleMenuWithMediaModel = require("../../tests/fixtures/parsed-localazy-entry-to-create-entry-restaurant-simple-menu");
const cookbookModel = require("../../tests/fixtures/parsed-localazy-entry-to-create-entry-cookbook");

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
});
