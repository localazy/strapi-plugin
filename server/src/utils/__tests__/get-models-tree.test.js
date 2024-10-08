"use strict";

const getModelsTree = require("../get-models-tree");
const allModels = require("../../tests/fixtures/all-models");

it("should return the tree for restaurants", () => {
  // SETUP
  const object = allModels;

  // EXECUTE
  const result = getModelsTree(object);

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

it("should return a tree all all models", () => {
  // SETUP
  const object = allModels;

  // EXECUTE
  const result = getModelsTree(object);

  // VERIFY
  const expected = [
    {
      tokens: {
        __model__: true,
        access_token: false,
      },
    },
    {
      testtokens: {
        __model__: true,
        at: false,
      },
    },
    {
      up_users: {
        __model__: true,
        username: false,
        email: false,
        provider: false,
        password: null,
        resetPasswordToken: false,
        confirmationToken: false,
        confirmed: null,
        blocked: null,
        role: null,
      },
    },
    {
      books: {
        __model__: true,
        Title: false,
        Author: false,
        Pages: null,
        additional_info: {
          rich_description: false,
          history: false,
          excerpt: false,
          test_variants: {
            name: false,
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
    {
      components_food_ingredient_variants: {
        __model__: true,
        name: false,
      },
    },
    {
      components_food_ingredients: {
        __model__: true,
        name: false,
        pcs: null,
        required: null,
      },
    },
    {
      components_food_pub_component_1s: {
        __model__: true,
        rich_description: false,
        history: false,
        excerpt: false,
        test_variants: {
          name: false,
        },
      },
    },
    {
      components_food_recipes: {
        __model__: true,
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
    },
  ];
  expect(result).toEqual(expected);
});
