"use strict";

const buildPopulate = require("../build-populate");
const allModels = require("../../tests/fixtures/all-models");

it("should return basic populate if model does not exist", () => {
  // SETUP
  const models = allModels;

  // EXECUTE
  const modelUid = "some-non-existing-model";
  const result = buildPopulate(models, modelUid);

  // VERIFY
  const expected = {
    populate: "*",
  };
  expect(result).toEqual(expected);
});

it("should populate restaurant model correctly", () => {
  // SETUP
  const models = allModels;

  // EXECUTE
  const modelUid = "api::restaurant.restaurant";
  const result = buildPopulate(models, modelUid);

  // VERIFY
  const expected = {
    populate: "*",
    recipes: {
      populate: "*",
      ingredients: {
        populate: "*",
      },
      variants: {
        populate: "*",
      },
    },
    descs: {
      populate: "*",
      test_variants: {
        populate: "*",
      },
    },
  };
  expect(result).toEqual(expected);
});

it("should populate single type types model correctly", () => {
  // SETUP
  const models = allModels;

  // EXECUTE
  const modelUid = "plugin::localazy.token";
  const result = buildPopulate(models, modelUid);

  // VERIFY
  const expected = {
    populate: "*",
  };
  expect(result).toEqual(expected);
});

it("should populate book model correctly", () => {
  // SETUP
  const models = allModels;

  // EXECUTE
  const modelUid = "api::book.book";
  const result = buildPopulate(models, modelUid);

  // VERIFY
  const expected = {
    populate: "*",
    additional_info: {
      populate: "*",
      test_variants: {
        populate: "*",
      },
    },
  };
  expect(result).toEqual(expected);
});
