import getModelsTree from "../get-models-tree";

const allModels = require("../../../../tests/fixtures/all-models");
const restaurantModel = require("../../../../tests/fixtures/restaurant-model");

it("should return the tree for restaurants", () => {
  // SETUP
  const object = allModels;
  const localizableModels = [restaurantModel];

  // EXECUTE
  const result = getModelsTree(object, localizableModels);

  // VERIFY
  const restaurantModelsTree = result.find((model) => model.restaurants);
  const expected = {
    restaurants: {
      __model__: true,
      title: false,
      description: false,
      books: null,
      recipes: {
        name: false,
        ingredients: {
          name: false,
          pcs: null,
          required: null,
        },
        variants: {
          name: false,
        },
      },
      descs: {
        rich_description: false,
        history: false,
        excerpt: false,
        test_variants: {
          name: false,
        },
      },
      street: false,
      city: false,
      country: false,
    },
  };
  expect(restaurantModelsTree).toEqual(expected);
});

it("should return a tree for all models", () => {
  // SETUP
  const localizableModels = allModels.filter(
    (model) => model.modelType === "contentType"
  );
  const object = allModels;

  // EXECUTE
  const result = getModelsTree(object, localizableModels);

  // VERIFY
  const expected = [
    {
      tokens: {
        __model__: true,
        access_token: null,
      },
    },
    {
      testtokens: {
        __model__: true,
        at: null,
      },
    },
    {
      up_users: {
        __model__: true,
        username: null,
        email: null,
        provider: null,
        password: null,
        resetPasswordToken: null,
        confirmationToken: null,
        confirmed: null,
        blocked: null,
        role: null,
      },
    },
    {
      books: {
        __model__: true,
        Title: false,
        Author: null,
        Pages: null,
        additional_info: {
          rich_description: null,
          history: null,
          excerpt: null,
          test_variants: {
            name: null,
          },
        },
      },
    },
    {
      restaurants: {
        __model__: true,
        title: false,
        description: false,
        books: null,
        recipes: {
          name: false,
          ingredients: {
            name: false,
            pcs: null,
            required: null,
          },
          variants: {
            name: false,
          },
        },
        descs: {
          rich_description: false,
          history: false,
          excerpt: false,
          test_variants: {
            name: false,
          },
        },
        street: false,
        city: false,
        country: false,
      },
    },
  ];
  expect(result).toEqual(expected);
});
