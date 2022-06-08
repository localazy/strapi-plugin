"use strict";

const pickEntries = require("../pick-entries");
const restaurantFlattened = require("../../tests/fixtures/restaurant-flattened");
const collectionFlattened = require("../../tests/fixtures/collection-flattened");
const restaurantsPickPaths = require("../../tests/fixtures/restaurants-pick-paths");

describe("pick entries test suite", () => {
  it("should return picked entries from 1 restaurant", () => {
    // SETUP
    const entry = restaurantFlattened;
    const pickPaths = [
      "api::restaurant.restaurant.title",
      "api::restaurant.restaurant.description",
      "api::restaurant.restaurant.street",
      "api::restaurant.restaurant.city",
      "api::restaurant.restaurant.country",
      "api::restaurant.restaurant.id",
    ];

    // EXECUTE
    const result = pickEntries(entry, pickPaths);

    // VERIFY
    const expected = {
      "api::restaurant.restaurant[3].city": "Testow",
      "api::restaurant.restaurant[3].country": "Test Rep.",
      "api::restaurant.restaurant[3].description":
        "With some great description",
      "api::restaurant.restaurant[3].street": "Testowa",
      "api::restaurant.restaurant[3].title": "Full Restaurant",
    };
    expect(result).toEqual(expected);
  });

  it("should return picked entries from collection", () => {
    // SETUP
    const entry = collectionFlattened;
    const pickPaths = restaurantsPickPaths("api::restaurant.restaurant");

    // EXECUTE
    const result = pickEntries(entry, pickPaths);

    // VERIFY
    const expected = {
      "api::restaurant.restaurant[1].description": "Restaurant 1 description",
      "api::restaurant.restaurant[1].descs[1].rich_description":
        "restaurant 1 rich_desc",
      "api::restaurant.restaurant[1].title": "Restaurant 1",
      "api::restaurant.restaurant[2].description": "Restaurant 2 description",
      "api::restaurant.restaurant[2].title": "Restaurant 2",
      "api::restaurant.restaurant[3].city": "Testow",
      "api::restaurant.restaurant[3].country": "Test Rep.",
      "api::restaurant.restaurant[3].description":
        "With some great description",
      "api::restaurant.restaurant[3].descs[3].excerpt": "Est. 2022",
      "api::restaurant.restaurant[3].descs[3].history":
        "Est. 2022, based in NY, NY",
      "api::restaurant.restaurant[3].descs[3].rich_description":
        "Another restaurant desc",
      "api::restaurant.restaurant[3].descs[3].test_variants[5].name":
        "no such thing...",
      "api::restaurant.restaurant[3].recipes[2].ingredients[4].name": "Beef",
      "api::restaurant.restaurant[3].recipes[2].ingredients[5].name": "Water",
      "api::restaurant.restaurant[3].recipes[2].name": "Beef Broth",
      "api::restaurant.restaurant[3].recipes[3].ingredients[2].name": "Tomato",
      "api::restaurant.restaurant[3].recipes[3].ingredients[3].name": "Soup",
      "api::restaurant.restaurant[3].recipes[3].name": "Tomato Soup",
      "api::restaurant.restaurant[3].recipes[3].variants[4].name":
        "Red, yellow, green",
      "api::restaurant.restaurant[3].recipes[4].ingredients[6].name":
        "Beef meat",
      "api::restaurant.restaurant[3].recipes[4].ingredients[7].name": "Pepper",
      "api::restaurant.restaurant[3].recipes[4].ingredients[8].name":
        "Pepper spices",
      "api::restaurant.restaurant[3].recipes[4].ingredients[9].name": "Water",
      "api::restaurant.restaurant[3].recipes[4].name": "Goulash",
      "api::restaurant.restaurant[3].street": "Testowa",
      "api::restaurant.restaurant[3].title": "Full Restaurant",
    };
    expect(result).toEqual(expected);
  });
});
