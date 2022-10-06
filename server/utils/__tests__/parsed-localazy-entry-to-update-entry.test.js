"use strict";

const parsedLocalazyEntryToUpdateEntry = require("../parsed-localazy-entry-to-update-entry");
const allModelsWithMultimedia = require("../../tests/fixtures/all-models-with-multimedia");
const allModels = require("../../tests/fixtures/all-models");
const stringifiedBookCs = require("../../tests/fixtures/stringified-book-with-multimedia-components-cs");
const stringifiedRestaurantDe = require("../../tests/fixtures/stringified-restaurant-de");
const currentBookEntry = require("../../tests/fixtures/strapi-book-with-multimedia-components-cs");
const restaurantsEntries = require("../../tests/fixtures/restaurants-entries");

describe("parsed-localazy-entry-to-update-entry.js", () => {
  it("should return transformed book entry to strapi update entry structure", async () => {
    // SETUP
    const uid = "api::book.book";
    const entry = JSON.parse(stringifiedBookCs);

    // EXECUTE
    const result = await parsedLocalazyEntryToUpdateEntry(
      JSON.parse("[{\"kind\":\"singleType\",\"collectionName\":\"a_first_positioned_some_test_single_types\",\"info\":{\"singularName\":\"a-first-positioned-some-test-single-type\",\"pluralName\":\"a-first-positioned-some-test-single-types\",\"displayName\":\"a_first_positioned_some_test_single_type\"},\"options\":{\"draftAndPublish\":true},\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"attributes\":{\"label\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"createdAt\":{\"type\":\"datetime\"},\"updatedAt\":{\"type\":\"datetime\"},\"publishedAt\":{\"type\":\"datetime\",\"configurable\":false,\"writable\":true,\"visible\":false},\"createdBy\":{\"type\":\"relation\",\"relation\":\"oneToOne\",\"target\":\"admin::user\",\"configurable\":false,\"writable\":false,\"visible\":false,\"useJoinTable\":false,\"private\":true},\"updatedBy\":{\"type\":\"relation\",\"relation\":\"oneToOne\",\"target\":\"admin::user\",\"configurable\":false,\"writable\":false,\"visible\":false,\"useJoinTable\":false,\"private\":true},\"localizations\":{\"writable\":true,\"private\":false,\"configurable\":false,\"visible\":false,\"type\":\"relation\",\"relation\":\"oneToMany\",\"target\":\"api::a-first-positioned-some-test-single-type.a-first-positioned-some-test-single-type\"},\"locale\":{\"writable\":true,\"private\":false,\"configurable\":false,\"visible\":false,\"type\":\"string\"}},\"__schema__\":{\"collectionName\":\"a_first_positioned_some_test_single_types\",\"info\":{\"singularName\":\"a-first-positioned-some-test-single-type\",\"pluralName\":\"a-first-positioned-some-test-single-types\",\"displayName\":\"a_first_positioned_some_test_single_type\"},\"options\":{\"draftAndPublish\":true},\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"attributes\":{\"label\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"}},\"kind\":\"singleType\"},\"modelType\":\"contentType\",\"modelName\":\"a-first-positioned-some-test-single-type\",\"connection\":\"default\",\"uid\":\"api::a-first-positioned-some-test-single-type.a-first-positioned-some-test-single-type\",\"apiName\":\"a-first-positioned-some-test-single-type\",\"globalId\":\"AFirstPositionedSomeTestSingleType\",\"actions\":{},\"lifecycles\":{},\"singularName\":\"a-first-positioned-some-test-single-type\",\"tableName\":\"a_first_positioned_some_test_single_types\"},{\"kind\":\"collectionType\",\"collectionName\":\"books\",\"info\":{\"singularName\":\"book\",\"pluralName\":\"books\",\"displayName\":\"Book\",\"description\":\"\"},\"options\":{\"draftAndPublish\":true},\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"attributes\":{\"Title\":{\"type\":\"string\",\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"Author\":{\"type\":\"string\",\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"Pages\":{\"type\":\"integer\",\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"additional_info\":{\"type\":\"component\",\"repeatable\":false,\"component\":\"food.pub-component-1\",\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"cover\":{\"type\":\"relation\",\"relation\":\"morphOne\",\"target\":\"plugin::upload.file\",\"morphBy\":\"related\"},\"presentations\":{\"type\":\"relation\",\"relation\":\"morphMany\",\"target\":\"plugin::upload.file\",\"morphBy\":\"related\"},\"seo_setup\":{\"type\":\"component\",\"repeatable\":true,\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"component\":\"seo.gallery\"},\"non_localizable_name\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"createdAt\":{\"type\":\"datetime\"},\"updatedAt\":{\"type\":\"datetime\"},\"publishedAt\":{\"type\":\"datetime\",\"configurable\":false,\"writable\":true,\"visible\":false},\"createdBy\":{\"type\":\"relation\",\"relation\":\"oneToOne\",\"target\":\"admin::user\",\"configurable\":false,\"writable\":false,\"visible\":false,\"useJoinTable\":false,\"private\":true},\"updatedBy\":{\"type\":\"relation\",\"relation\":\"oneToOne\",\"target\":\"admin::user\",\"configurable\":false,\"writable\":false,\"visible\":false,\"useJoinTable\":false,\"private\":true},\"localizations\":{\"writable\":true,\"private\":false,\"configurable\":false,\"visible\":false,\"type\":\"relation\",\"relation\":\"oneToMany\",\"target\":\"api::book.book\"},\"locale\":{\"writable\":true,\"private\":false,\"configurable\":false,\"visible\":false,\"type\":\"string\"}},\"__schema__\":{\"collectionName\":\"books\",\"info\":{\"singularName\":\"book\",\"pluralName\":\"books\",\"displayName\":\"Book\",\"description\":\"\"},\"options\":{\"draftAndPublish\":true},\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"attributes\":{\"Title\":{\"type\":\"string\",\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"Author\":{\"type\":\"string\",\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"Pages\":{\"type\":\"integer\",\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"additional_info\":{\"type\":\"component\",\"repeatable\":false,\"component\":\"food.pub-component-1\",\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"cover\":{\"type\":\"media\",\"multiple\":false,\"required\":false,\"allowedTypes\":[\"images\",\"files\",\"videos\",\"audios\"],\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"presentations\":{\"type\":\"media\",\"multiple\":true,\"required\":false,\"allowedTypes\":[\"images\",\"files\",\"videos\",\"audios\"],\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"seo_setup\":{\"type\":\"component\",\"repeatable\":true,\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"component\":\"seo.gallery\"},\"non_localizable_name\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"}},\"kind\":\"collectionType\"},\"modelType\":\"contentType\",\"modelName\":\"book\",\"connection\":\"default\",\"uid\":\"api::book.book\",\"apiName\":\"book\",\"globalId\":\"Book\",\"actions\":{},\"lifecycles\":{},\"singularName\":\"book\",\"tableName\":\"books\"},{\"kind\":\"collectionType\",\"collectionName\":\"loc_5087s\",\"info\":{\"singularName\":\"loc-5087\",\"pluralName\":\"loc-5087s\",\"displayName\":\"LOC-5087\",\"description\":\"\"},\"options\":{\"draftAndPublish\":true},\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"attributes\":{\"ingredients\":{\"type\":\"component\",\"repeatable\":true,\"component\":\"food.ingredients\",\"pluginOptions\":{\"i18n\":{\"localized\":true}}},\"createdAt\":{\"type\":\"datetime\"},\"updatedAt\":{\"type\":\"datetime\"},\"publishedAt\":{\"type\":\"datetime\",\"configurable\":false,\"writable\":true,\"visible\":false},\"createdBy\":{\"type\":\"relation\",\"relation\":\"oneToOne\",\"target\":\"admin::user\",\"configurable\":false,\"writable\":false,\"visible\":false,\"useJoinTable\":false,\"private\":true},\"updatedBy\":{\"type\":\"relation\",\"relation\":\"oneToOne\",\"target\":\"admin::user\",\"configurable\":false,\"writable\":false,\"visible\":false,\"useJoinTable\":false,\"private\":true},\"localizations\":{\"writable\":true,\"private\":false,\"configurable\":false,\"visible\":false,\"type\":\"relation\",\"relation\":\"oneToMany\",\"target\":\"api::loc-5087.loc-5087\"},\"locale\":{\"writable\":true,\"private\":false,\"configurable\":false,\"visible\":false,\"type\":\"string\"}},\"__schema__\":{\"collectionName\":\"loc_5087s\",\"info\":{\"singularName\":\"loc-5087\",\"pluralName\":\"loc-5087s\",\"displayName\":\"LOC-5087\",\"description\":\"\"},\"options\":{\"draftAndPublish\":true},\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"attributes\":{\"ingredients\":{\"type\":\"component\",\"repeatable\":true,\"component\":\"food.ingredients\",\"pluginOptions\":{\"i18n\":{\"localized\":true}}}},\"kind\":\"collectionType\"},\"modelType\":\"contentType\",\"modelName\":\"loc-5087\",\"connection\":\"default\",\"uid\":\"api::loc-5087.loc-5087\",\"apiName\":\"loc-5087\",\"globalId\":\"Loc5087\",\"actions\":{},\"lifecycles\":{},\"singularName\":\"loc-5087\",\"tableName\":\"loc_5087s\"},{\"kind\":\"collectionType\",\"collectionName\":\"restaurants\",\"info\":{\"singularName\":\"restaurant\",\"pluralName\":\"restaurants\",\"displayName\":\"Restaurant\",\"description\":\"\"},\"options\":{\"draftAndPublish\":true},\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"attributes\":{\"title\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\",\"required\":true},\"description\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"text\"},\"books\":{\"type\":\"relation\",\"relation\":\"oneToMany\",\"target\":\"api::book.book\"},\"recipes\":{\"type\":\"component\",\"repeatable\":true,\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"component\":\"food.recipe\"},\"descs\":{\"type\":\"component\",\"repeatable\":false,\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"component\":\"food.pub-component-1\"},\"street\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"city\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"country\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"Motto\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"motto_2\":{\"pluginOptions\":{\"i18n\":{\"localized\":false}},\"type\":\"string\"},\"title_2\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"createdAt\":{\"type\":\"datetime\"},\"updatedAt\":{\"type\":\"datetime\"},\"publishedAt\":{\"type\":\"datetime\",\"configurable\":false,\"writable\":true,\"visible\":false},\"createdBy\":{\"type\":\"relation\",\"relation\":\"oneToOne\",\"target\":\"admin::user\",\"configurable\":false,\"writable\":false,\"visible\":false,\"useJoinTable\":false,\"private\":true},\"updatedBy\":{\"type\":\"relation\",\"relation\":\"oneToOne\",\"target\":\"admin::user\",\"configurable\":false,\"writable\":false,\"visible\":false,\"useJoinTable\":false,\"private\":true},\"localizations\":{\"writable\":true,\"private\":false,\"configurable\":false,\"visible\":false,\"type\":\"relation\",\"relation\":\"oneToMany\",\"target\":\"api::restaurant.restaurant\"},\"locale\":{\"writable\":true,\"private\":false,\"configurable\":false,\"visible\":false,\"type\":\"string\"}},\"__schema__\":{\"collectionName\":\"restaurants\",\"info\":{\"singularName\":\"restaurant\",\"pluralName\":\"restaurants\",\"displayName\":\"Restaurant\",\"description\":\"\"},\"options\":{\"draftAndPublish\":true},\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"attributes\":{\"title\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\",\"required\":true},\"description\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"text\"},\"books\":{\"type\":\"relation\",\"relation\":\"oneToMany\",\"target\":\"api::book.book\"},\"recipes\":{\"type\":\"component\",\"repeatable\":true,\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"component\":\"food.recipe\"},\"descs\":{\"type\":\"component\",\"repeatable\":false,\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"component\":\"food.pub-component-1\"},\"street\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"city\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"country\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"Motto\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"},\"motto_2\":{\"pluginOptions\":{\"i18n\":{\"localized\":false}},\"type\":\"string\"},\"title_2\":{\"pluginOptions\":{\"i18n\":{\"localized\":true}},\"type\":\"string\"}},\"kind\":\"collectionType\"},\"modelType\":\"contentType\",\"modelName\":\"restaurant\",\"connection\":\"default\",\"uid\":\"api::restaurant.restaurant\",\"apiName\":\"restaurant\",\"globalId\":\"Restaurant\",\"actions\":{},\"lifecycles\":{},\"singularName\":\"restaurant\",\"tableName\":\"restaurants\"},{\"collectionName\":\"components_food_ingredient_variants\",\"info\":{\"displayName\":\"ingredient_variants\",\"icon\":\"atlas\"},\"options\":{},\"attributes\":{\"name\":{\"type\":\"string\"}},\"__filename__\":\"ingredient-variants.json\",\"__schema__\":{\"collectionName\":\"components_food_ingredient_variants\",\"info\":{\"displayName\":\"ingredient_variants\",\"icon\":\"atlas\"},\"options\":{},\"attributes\":{\"name\":{\"type\":\"string\"}},\"__filename__\":\"ingredient-variants.json\"},\"uid\":\"food.ingredient-variants\",\"category\":\"food\",\"modelType\":\"component\",\"modelName\":\"ingredient-variants\",\"globalId\":\"ComponentFoodIngredientVariants\",\"singularName\":\"ingredient-variants\",\"tableName\":\"components_food_ingredient_variants\"},{\"collectionName\":\"components_food_ingredients\",\"info\":{\"displayName\":\"ingredients\",\"icon\":\"atom\",\"description\":\"\"},\"options\":{},\"attributes\":{\"name\":{\"type\":\"string\",\"required\":true},\"pcs\":{\"type\":\"integer\"},\"required\":{\"type\":\"boolean\"}},\"__filename__\":\"ingredients.json\",\"__schema__\":{\"collectionName\":\"components_food_ingredients\",\"info\":{\"displayName\":\"ingredients\",\"icon\":\"atom\",\"description\":\"\"},\"options\":{},\"attributes\":{\"name\":{\"type\":\"string\",\"required\":true},\"pcs\":{\"type\":\"integer\"},\"required\":{\"type\":\"boolean\"}},\"__filename__\":\"ingredients.json\"},\"uid\":\"food.ingredients\",\"category\":\"food\",\"modelType\":\"component\",\"modelName\":\"ingredients\",\"globalId\":\"ComponentFoodIngredients\",\"singularName\":\"ingredients\",\"tableName\":\"components_food_ingredients\"},{\"collectionName\":\"components_food_pub_component_1s\",\"info\":{\"displayName\":\"Pub Component 1\",\"icon\":\"american-sign-language-interpreting\",\"description\":\"\"},\"options\":{},\"attributes\":{\"rich_description\":{\"type\":\"richtext\"},\"history\":{\"type\":\"text\"},\"excerpt\":{\"type\":\"string\"},\"test_variants\":{\"type\":\"component\",\"repeatable\":false,\"component\":\"food.ingredient-variants\"}},\"__filename__\":\"pub-component-1.json\",\"__schema__\":{\"collectionName\":\"components_food_pub_component_1s\",\"info\":{\"displayName\":\"Pub Component 1\",\"icon\":\"american-sign-language-interpreting\",\"description\":\"\"},\"options\":{},\"attributes\":{\"rich_description\":{\"type\":\"richtext\"},\"history\":{\"type\":\"text\"},\"excerpt\":{\"type\":\"string\"},\"test_variants\":{\"type\":\"component\",\"repeatable\":false,\"component\":\"food.ingredient-variants\"}},\"__filename__\":\"pub-component-1.json\"},\"uid\":\"food.pub-component-1\",\"category\":\"food\",\"modelType\":\"component\",\"modelName\":\"pub-component-1\",\"globalId\":\"ComponentFoodPubComponent1\",\"singularName\":\"pub-component-1\",\"tableName\":\"components_food_pub_component_1s\"},{\"collectionName\":\"components_food_recipes\",\"info\":{\"displayName\":\"recipe\",\"icon\":\"ad\",\"description\":\"\"},\"options\":{},\"attributes\":{\"name\":{\"type\":\"string\",\"required\":true},\"ingredients\":{\"type\":\"component\",\"repeatable\":true,\"component\":\"food.ingredients\"},\"variants\":{\"type\":\"component\",\"repeatable\":false,\"component\":\"food.ingredient-variants\"}},\"__filename__\":\"recipe.json\",\"__schema__\":{\"collectionName\":\"components_food_recipes\",\"info\":{\"displayName\":\"recipe\",\"icon\":\"ad\",\"description\":\"\"},\"options\":{},\"attributes\":{\"name\":{\"type\":\"string\",\"required\":true},\"ingredients\":{\"type\":\"component\",\"repeatable\":true,\"component\":\"food.ingredients\"},\"variants\":{\"type\":\"component\",\"repeatable\":false,\"component\":\"food.ingredient-variants\"}},\"__filename__\":\"recipe.json\"},\"uid\":\"food.recipe\",\"category\":\"food\",\"modelType\":\"component\",\"modelName\":\"recipe\",\"globalId\":\"ComponentFoodRecipe\",\"singularName\":\"recipe\",\"tableName\":\"components_food_recipes\"},{\"collectionName\":\"components_seo_galleries\",\"info\":{\"displayName\":\"Gallery\",\"icon\":\"address-card\",\"description\":\"\"},\"options\":{},\"attributes\":{\"main_image\":{\"type\":\"relation\",\"relation\":\"morphOne\",\"target\":\"plugin::upload.file\",\"morphBy\":\"related\"},\"rest\":{\"type\":\"relation\",\"relation\":\"morphMany\",\"target\":\"plugin::upload.file\",\"morphBy\":\"related\"},\"seo_desc\":{\"type\":\"string\"}},\"__filename__\":\"gallery.json\",\"__schema__\":{\"collectionName\":\"components_seo_galleries\",\"info\":{\"displayName\":\"Gallery\",\"icon\":\"address-card\",\"description\":\"\"},\"options\":{},\"attributes\":{\"main_image\":{\"type\":\"media\",\"multiple\":false,\"required\":false,\"allowedTypes\":[\"images\",\"files\",\"videos\",\"audios\"]},\"rest\":{\"type\":\"media\",\"multiple\":true,\"required\":false,\"allowedTypes\":[\"images\",\"videos\",\"audios\",\"files\"]},\"seo_desc\":{\"type\":\"string\"}},\"__filename__\":\"gallery.json\"},\"uid\":\"seo.gallery\",\"category\":\"seo\",\"modelType\":\"component\",\"modelName\":\"gallery\",\"globalId\":\"ComponentSeoGallery\",\"singularName\":\"gallery\",\"tableName\":\"components_seo_galleries\"}]"),
      JSON.parse("{\"ingredients\":[null,{\"name\":\"první\"},{\"name\":\"druhý\"},{\"name\":\"třetí\"},{\"name\":\"čtvrtý\"},{\"name\":\"pátý\"},{\"name\":\"šestý\"},{\"name\":\"sedmý\"},{\"name\":\"osmý\"},{\"name\":\"devátý\"},{\"name\":\"desátý\"},null,null,null,null,null,null,null,null,null,null,{\"name\":\"jedenáctý\"},null,{\"name\":\"dvanáctý\"},{\"name\":\"třináctý\"},null,{\"name\":\"čtrnáctý\"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{\"Name\":\"první\"},{\"Name\":\"druhý\"},{\"Name\":\"třetina\"},{\"Name\":\"čtvrtý\"},{\"Name\":\"pátý\"},{\"Name\":\"šestý\"},{\"Name\":\"sedmý\"},{\"Name\":\"osmý\"},{\"Name\":\"devátý\"},{\"Name\":\"desátý\"}]}"),
      JSON.parse("{\"id\":3,\"ingredients\":[{\"id\":28,\"name\":\"dvanáctý\",\"pcs\":null,\"required\":null},{\"id\":29,\"name\":\"první\",\"pcs\":null,\"required\":null},{\"id\":30,\"name\":\"druhý\",\"pcs\":null,\"required\":null},{\"id\":31,\"name\":\"jedenáctý\",\"pcs\":null,\"required\":null},{\"id\":32,\"name\":\"třetí\",\"pcs\":null,\"required\":null},{\"id\":33,\"name\":\"čtvrtý\",\"pcs\":null,\"required\":null},{\"id\":34,\"name\":\"pátý\",\"pcs\":null,\"required\":null},{\"id\":35,\"name\":\"šestý\",\"pcs\":null,\"required\":null},{\"id\":36,\"name\":\"čtrnáctý\",\"pcs\":null,\"required\":null},{\"id\":37,\"name\":\"sedmý\",\"pcs\":null,\"required\":null},{\"id\":38,\"name\":\"osmý\",\"pcs\":null,\"required\":null},{\"id\":39,\"name\":\"devátý\",\"pcs\":null,\"required\":null},{\"id\":40,\"name\":\"desátý\",\"pcs\":null,\"required\":null},{\"id\":41,\"name\":\"třináctý\",\"pcs\":null,\"required\":null}]}"),
      JSON.parse("{\"id\":1,\"createdAt\":\"2022-08-30T09:21:23.903Z\",\"updatedAt\":\"2022-08-30T15:09:19.107Z\",\"publishedAt\":null,\"locale\":\"en\",\"ingredients\":[{\"id\":23,\"name\":\"twelveth\",\"pcs\":12,\"required\":null},{\"id\":1,\"name\":\"first\",\"pcs\":1,\"required\":null},{\"id\":2,\"name\":\"second\",\"pcs\":2,\"required\":null},{\"id\":21,\"name\":\"eleventh\",\"pcs\":11,\"required\":null},{\"id\":3,\"name\":\"third\",\"pcs\":3,\"required\":null},{\"id\":4,\"name\":\"fourth\",\"pcs\":4,\"required\":null},{\"id\":5,\"name\":\"fifth\",\"pcs\":5,\"required\":null},{\"id\":6,\"name\":\"sixth\",\"pcs\":6,\"required\":null},{\"id\":26,\"name\":\"fourteenth\",\"pcs\":14,\"required\":null},{\"id\":7,\"name\":\"seventh\",\"pcs\":7,\"required\":null},{\"id\":8,\"name\":\"eighth\",\"pcs\":8,\"required\":null},{\"id\":9,\"name\":\"nineth\",\"pcs\":9,\"required\":null},{\"id\":10,\"name\":\"tenth\",\"pcs\":10,\"required\":null},{\"id\":24,\"name\":\"thirteenth\",\"pcs\":13,\"required\":null}],\"createdBy\":{\"id\":1,\"firstname\":\"David\",\"lastname\":\"Vaclavek\",\"username\":null,\"email\":\"david@localazy.com\",\"password\":\"$2a$10$pRWPPnTWp8HFWPR7aD4Pju2nNBD9vyNPt.QaMpU9IA6pMoGFl7eVC\",\"resetPasswordToken\":null,\"registrationToken\":null,\"isActive\":true,\"blocked\":false,\"preferedLanguage\":null,\"createdAt\":\"2022-07-11T11:58:02.016Z\",\"updatedAt\":\"2022-07-11T12:56:16.558Z\"},\"updatedBy\":{\"id\":1,\"firstname\":\"David\",\"lastname\":\"Vaclavek\",\"username\":null,\"email\":\"david@localazy.com\",\"password\":\"$2a$10$pRWPPnTWp8HFWPR7aD4Pju2nNBD9vyNPt.QaMpU9IA6pMoGFl7eVC\",\"resetPasswordToken\":null,\"registrationToken\":null,\"isActive\":true,\"blocked\":false,\"preferedLanguage\":null,\"createdAt\":\"2022-07-11T11:58:02.016Z\",\"updatedAt\":\"2022-07-11T12:56:16.558Z\"},\"localizations\":[{\"id\":3,\"createdAt\":\"2022-08-30T15:08:02.889Z\",\"updatedAt\":\"2022-08-30T21:03:30.453Z\",\"publishedAt\":null,\"locale\":\"cs\"}]}"),
      "api::loc-5087.loc-5087"
    );

    // VERIFY
    const expected = {
      id: 3,
      ingredients: [
        {
          id: 28,
          name: "dvanáctý",
          pcs: null,
          required: null,
        },
        {
          id: 29,
          name: "první",
          pcs: null,
          required: null,
        },
        {
          id: 30,
          name: "druhý",
          pcs: null,
          required: null,
        },
        {
          id: 31,
          name: "jedenáctý",
          pcs: null,
          required: null,
        },
        {
          id: 32,
          name: "třetí",
          pcs: null,
          required: null,
        },
        {
          id: 33,
          name: "čtvrtý",
          pcs: null,
          required: null,
        },
        {
          id: 34,
          name: "pátý",
          pcs: null,
          required: null,
        },
        {
          id: 35,
          name: "šestý",
          pcs: null,
          required: null,
        },
        {
          id: 36,
          name: "čtrnáctý",
          pcs: null,
          required: null,
        },
        {
          id: 37,
          name: "sedmý",
          pcs: null,
          required: null,
        },
        {
          id: 38,
          name: "osmý",
          pcs: null,
          required: null,
        },
        {
          id: 39,
          name: "devátý",
          pcs: null,
          required: null,
        },
        {
          id: 40,
          name: "desátý",
          pcs: null,
          required: null,
        },
        {
          id: 41,
          name: "třináctý",
          pcs: null,
          required: null,
        },
      ],
    };

    expect(result).toEqual(expected);
  });
});
