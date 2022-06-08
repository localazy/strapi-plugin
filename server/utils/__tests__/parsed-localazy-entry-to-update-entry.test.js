"use strict";

const parsedLocalazyEntryToUpdateEntry = require("../parsed-localazy-entry-to-update-entry");
const allModelsWithMultimedia = require("../../tests/fixtures/all-models-with-multimedia");
const allModels = require("../../tests/fixtures/all-models");
const stringifiedBookCs = require("../../tests/fixtures/stringified-book-with-multimedia-components-cs");
const stringifiedRestaurantDe = require("../../tests/fixtures/stringified-restaurant-de");
const currentBookEntry = require("../../tests/fixtures/strapi-book-with-multimedia-components-cs");
const restaurantsEntries = require("../../tests/fixtures/restaurants-entries");

describe("parsed-localazy-entry-to-update-entry.js", () => {
  it("should return transformed book entry to strapi update entry structure", () => {
    // SETUP
    const uid = "api::book.book";
    const entry = JSON.parse(stringifiedBookCs);

    // EXECUTE
    const result = parsedLocalazyEntryToUpdateEntry(
      allModelsWithMultimedia,
      entry,
      currentBookEntry,
      uid
    );

    // VERIFY
    const expected = {
      id: 29,
      Title: "Kniha s obálkou 2",
      Author: null,
      Pages: null,
      non_localizable_name: "Non localizable book for kids",
      additional_info: {
        id: 38,
        rich_description: "RD",
        history: "H 2",
        excerpt: "E",
        test_variants: {
          id: 38,
          name: "Nejsou k dispozici žádné varianty, proč?",
        },
      },
      seo_setup: [
        {
          id: 21,
          seo_desc: "nastavení 1",
          main_image: null,
          rest: null,
        },
        {
          id: 22,
          seo_desc: "nastavení 2",
          main_image: null,
          rest: null,
        },
      ],
    };

    expect(result).toEqual(expected);
  });
  it.only("should return transformed restaurant entry to strapi update entry structure", () => {
    // SETUP
    const uid = "api::restaurant.restaurant";
    const entry = JSON.parse(stringifiedRestaurantDe);
    const currentRestaurantEntry = restaurantsEntries[2];

    // EXECUTE
    const result = parsedLocalazyEntryToUpdateEntry(
      allModels,
      entry,
      currentRestaurantEntry,
      uid
    );

    // VERIFY
    const expected = {
      city: "Testow",
      country: "Test Rep.",
      description: "Mit einer großartigen Beschreibung",
      descs: {
        excerpt: "Est. 2022",
        history: "Est. 2022, mit Sitz in NY, NY",
        id: 3,
        rich_description: "Ein weiteres Restaurant desc",
        test_variants: {
          id: 5,
          name: "so etwas nicht...",
        },
      },
      id: 3,
      recipes: [
        {
          id: 3,
          ingredients: [
            {
              id: 2,
              name: "Rindfleisch",
              pcs: 4,
              required: false,
            },
            {
              id: 3,
              name: "Wasser",
              pcs: 1,
              required: true,
            },
          ],
          name: "Rinderbrühe",
          variants: {
            id: 4,
            name: "Red, yellow, green",
          },
        },
        {
          id: 2,
          ingredients: [
            {
              id: 4,
              name: "Tomate",
              pcs: 1,
              required: true,
            },
            {
              id: 5,
              name: "Suppe",
              pcs: 2,
              required: true,
            },
          ],
          name: "Tomatensuppe",
          variants: {
            name: "Rot, gelb, grün",
          },
        },
        {
          id: 4,
          ingredients: [
            {
              id: 6,
              name: "Rindfleisch",
              pcs: 1,
              required: true,
            },
            {
              id: 7,
              name: "Pfeffer",
              pcs: 4,
              required: null,
            },
            {
              id: 8,
              name: "Pfeffer-Gewürze",
              pcs: 1,
              required: true,
            },
            {
              id: 9,
              name: "Wasser",
              pcs: 1,
              required: null,
            },
          ],
          name: "Gulasch",
          variants: null,
        },
      ],
      street: "Testowa",
      title: "Volles Restaurant",
    };

    expect(result).toEqual(expected);
  });
});
