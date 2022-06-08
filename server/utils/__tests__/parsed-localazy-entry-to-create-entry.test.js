"use strict";

const parsedLocalazyEntryToCreateEntry = require("../parsed-localazy-entry-to-create-entry");
const allModels = require("../../tests/fixtures/all-models");
const stringifiedRestaurantCs = require("../../tests/fixtures/stringified-restaurant-cs");
const stringifiedBookCs = require("../../tests/fixtures/stringified-book-cs");

describe("parsed-localazy-entry-to-create-entry.js", () => {
  it("should return transformed restaurant entry to strapi create entry structure", () => {
    // SETUP
    const uid = "api::restaurant.restaurant";
    const entry = JSON.parse(stringifiedRestaurantCs);

    const locale = "cs";

    // EXECUTE
    const result = parsedLocalazyEntryToCreateEntry(
      allModels,
      entry,
      uid,
      locale
    );

    // VERIFY
    const expected = {
      locale: "cs",
      title: "Plná restaurace",
      description: "S nějakým skvělým popisem",
      recipes: [
        // is repeatable - array
        {
          // id: 2,
          __component: "food.recipe",
          name: "Hovězí vývar",
          ingredients: [
            // is repeatable - array
            {
              // id: 4,
              __component: "food.ingredients",
              name: "Hovězí",
            },
            {
              // id: 5,
              __component: "food.ingredients",
              name: "Voda",
            },
          ],
        },
        {
          // id: 3,
          __component: "food.recipe",
          name: "Rajčatová polévka",
          ingredients: [
            // is repeatable - array
            {
              // id: 2,
              __component: "food.ingredients",
              name: "rajče",
            },
            {
              // id: 3,
              __component: "food.ingredients",
              name: "Polévka",
            },
          ],
          variants: {
            // is not repeatable - object
            // id: 4,
            __component: "food.ingredient-variants",
            name: "Červená, žlutá, zelená",
          },
        },
        {
          // id: 4,
          __component: "food.recipe",
          name: "Guláš",
          ingredients: [
            // is repeatable - array
            {
              // id: 6,
              __component: "food.ingredients",
              name: "Hovězí maso",
            },
            {
              // id: 7,
              __component: "food.ingredients",
              name: "Pepř",
            },
            {
              // id: 8,
              __component: "food.ingredients",
              name: "pepř, koření",
            },
            {
              // id: 9,
              __component: "food.ingredients",
              name: "Voda",
            },
          ],
        },
      ],
      descs: {
        // is not repeatable - object
        // id: 3,
        __component: "food.pub-component-1",
        rich_description: "Další restaurace desc",
        history: "Est. 2022, se sídlem v NY, NY",
        excerpt: "Est. 2022",
        test_variants: {
          // is not repeatable - object
          // id: 5,
          __component: "food.ingredient-variants",
          name: "nic takového...",
        },
      },
    };
    expect(result).toEqual(expected);
  });
  it("should return transformed book entry to strapi create entry structure", () => {
    // SETUP
    const uid = "api::book.book";
    const entry = JSON.parse(stringifiedBookCs);

    const locale = "cs";

    // EXECUTE
    const result = parsedLocalazyEntryToCreateEntry(
      allModels,
      entry,
      uid,
      locale
    );

    // VERIFY
    const expected = {
      locale: "cs",
      Title: "Moje první dětská kniha",
      additional_info: {
        __component: "food.pub-component-1",
        rich_description:
          "# H1\n## H2\n#### H4\n\n** Jedna** _dva_ <u>tři</u>... a možná ještě více pohádek...",
        history: "Není tu žádný...",
        excerpt: "Krátký výňatek",
        test_variants: {
          __component: "food.ingredient-variants",
          name: "toto je finální verze",
        },
      },
    };

    expect(result).toEqual(expected);
  });
});
