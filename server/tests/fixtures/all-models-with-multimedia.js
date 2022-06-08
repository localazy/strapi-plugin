"use strict";

module.exports = [
  {
    kind: "singleType",
    collectionName: "tokens",
    info: {
      singularName: "token",
      pluralName: "tokens",
      displayName: "Token",
    },
    options: {
      draftAndPublish: false,
    },
    pluginOptions: {},
    attributes: {
      access_token: {
        type: "string",
      },
      createdAt: {
        type: "datetime",
      },
      updatedAt: {
        type: "datetime",
      },
      createdBy: {
        type: "relation",
        relation: "oneToOne",
        target: "admin::user",
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true,
      },
      updatedBy: {
        type: "relation",
        relation: "oneToOne",
        target: "admin::user",
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true,
      },
    },
    __schema__: {
      collectionName: "tokens",
      info: {
        singularName: "token",
        pluralName: "tokens",
        displayName: "Token",
      },
      options: {
        draftAndPublish: false,
      },
      pluginOptions: {},
      attributes: {
        access_token: {
          type: "string",
        },
      },
      kind: "singleType",
    },
    modelType: "contentType",
    modelName: "token",
    connection: "default",
    uid: "plugin::localazy.token",
    plugin: "localazy",
    globalId: "LocalazyToken",
    actions: undefined,
    lifecycles: undefined,
    singularName: "token",
    tableName: "tokens",
  },
  {
    kind: "singleType",
    collectionName: "testtokens",
    info: {
      singularName: "testtoken",
      pluralName: "testtokens",
      displayName: "testtoken",
    },
    options: {
      draftAndPublish: true,
      comment: "",
    },
    attributes: {
      at: {
        type: "string",
      },
      createdAt: {
        type: "datetime",
      },
      updatedAt: {
        type: "datetime",
      },
      publishedAt: {
        type: "datetime",
        configurable: false,
        writable: true,
        visible: false,
      },
      createdBy: {
        type: "relation",
        relation: "oneToOne",
        target: "admin::user",
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true,
      },
      updatedBy: {
        type: "relation",
        relation: "oneToOne",
        target: "admin::user",
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true,
      },
    },
    __schema__: {
      collectionName: "testtokens",
      info: {
        singularName: "testtoken",
        pluralName: "testtokens",
        displayName: "testtoken",
      },
      options: {
        draftAndPublish: true,
        comment: "",
      },
      attributes: {
        at: {
          type: "string",
        },
      },
      kind: "singleType",
    },
    modelType: "contentType",
    modelName: "testtoken",
    connection: "default",
    uid: "plugin::localazy.testtoken",
    plugin: "localazy",
    globalId: "LocalazyTesttoken",
    actions: undefined,
    lifecycles: undefined,
    singularName: "testtoken",
    tableName: "testtokens",
  },
  {
    collectionName: "up_users",
    info: {
      name: "user",
      description: "",
      singularName: "user",
      pluralName: "users",
      displayName: "User",
    },
    options: {
      draftAndPublish: false,
      timestamps: true,
    },
    attributes: {
      username: {
        type: "string",
        minLength: 3,
        unique: true,
        configurable: false,
        required: true,
      },
      email: {
        type: "email",
        minLength: 6,
        configurable: false,
        required: true,
      },
      provider: {
        type: "string",
        configurable: false,
      },
      password: {
        type: "password",
        minLength: 6,
        configurable: false,
        private: true,
      },
      resetPasswordToken: {
        type: "string",
        configurable: false,
        private: true,
      },
      confirmationToken: {
        type: "string",
        configurable: false,
        private: true,
      },
      confirmed: {
        type: "boolean",
        default: false,
        configurable: false,
      },
      blocked: {
        type: "boolean",
        default: false,
        configurable: false,
      },
      role: {
        type: "relation",
        relation: "manyToOne",
        target: "plugin::users-permissions.role",
        inversedBy: "users",
        configurable: false,
      },
      createdAt: {
        type: "datetime",
      },
      updatedAt: {
        type: "datetime",
      },
      createdBy: {
        type: "relation",
        relation: "oneToOne",
        target: "admin::user",
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true,
      },
      updatedBy: {
        type: "relation",
        relation: "oneToOne",
        target: "admin::user",
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true,
      },
    },
    config: {
      attributes: {
        resetPasswordToken: {
          hidden: true,
        },
        confirmationToken: {
          hidden: true,
        },
        provider: {
          hidden: true,
        },
      },
    },
    kind: "collectionType",
    __schema__: {
      collectionName: "up_users",
      info: {
        name: "user",
        description: "",
        singularName: "user",
        pluralName: "users",
        displayName: "User",
      },
      options: {
        draftAndPublish: false,
        timestamps: true,
      },
      attributes: {
        username: {
          type: "string",
          minLength: 3,
          unique: true,
          configurable: false,
          required: true,
        },
        email: {
          type: "email",
          minLength: 6,
          configurable: false,
          required: true,
        },
        provider: {
          type: "string",
          configurable: false,
        },
        password: {
          type: "password",
          minLength: 6,
          configurable: false,
          private: true,
        },
        resetPasswordToken: {
          type: "string",
          configurable: false,
          private: true,
        },
        confirmationToken: {
          type: "string",
          configurable: false,
          private: true,
        },
        confirmed: {
          type: "boolean",
          default: false,
          configurable: false,
        },
        blocked: {
          type: "boolean",
          default: false,
          configurable: false,
        },
        role: {
          type: "relation",
          relation: "manyToOne",
          target: "plugin::users-permissions.role",
          inversedBy: "users",
          configurable: false,
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "user",
    connection: "default",
    uid: "plugin::users-permissions.user",
    plugin: "users-permissions",
    globalId: "UsersPermissionsUser",
    actions: undefined,
    lifecycles: undefined,
    singularName: "user",
    tableName: "up_users",
  },
  {
    kind: "collectionType",
    collectionName: "books",
    info: {
      singularName: "book",
      pluralName: "books",
      displayName: "Book",
      description: "",
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {
      i18n: {
        localized: true,
      },
    },
    attributes: {
      Title: {
        type: "string",
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      Author: {
        type: "string",
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      Pages: {
        type: "integer",
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      additional_info: {
        type: "component",
        repeatable: false,
        component: "food.pub-component-1",
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      cover: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      presentations: {
        type: "relation",
        relation: "morphMany",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      seo_setup: {
        type: "component",
        repeatable: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "seo.gallery",
      },
      non_localizable_name: {
        pluginOptions: {
          i18n: {
            localized: false,
          },
        },
        type: "string",
      },
      createdAt: {
        type: "datetime",
      },
      updatedAt: {
        type: "datetime",
      },
      publishedAt: {
        type: "datetime",
        configurable: false,
        writable: true,
        visible: false,
      },
      createdBy: {
        type: "relation",
        relation: "oneToOne",
        target: "admin::user",
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true,
      },
      updatedBy: {
        type: "relation",
        relation: "oneToOne",
        target: "admin::user",
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true,
      },
      localizations: {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        type: "relation",
        relation: "oneToMany",
        target: "api::book.book",
      },
      locale: {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        type: "string",
      },
    },
    __schema__: {
      collectionName: "books",
      info: {
        singularName: "book",
        pluralName: "books",
        displayName: "Book",
        description: "",
      },
      options: {
        draftAndPublish: true,
      },
      pluginOptions: {
        i18n: {
          localized: true,
        },
      },
      attributes: {
        Title: {
          type: "string",
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        Author: {
          type: "string",
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        Pages: {
          type: "integer",
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        additional_info: {
          type: "component",
          repeatable: false,
          component: "food.pub-component-1",
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        cover: {
          type: "media",
          multiple: false,
          required: false,
          allowedTypes: ["images", "files", "videos", "audios"],
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        presentations: {
          type: "media",
          multiple: true,
          required: false,
          allowedTypes: ["images", "files", "videos", "audios"],
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        seo_setup: {
          type: "component",
          repeatable: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "seo.gallery",
        },
        non_localizable_name: {
          pluginOptions: {
            i18n: {
              localized: false,
            },
          },
          type: "string",
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "book",
    connection: "default",
    uid: "api::book.book",
    apiName: "book",
    globalId: "Book",
    actions: {},
    lifecycles: {},
    singularName: "book",
    tableName: "books",
  },
  {
    kind: "collectionType",
    collectionName: "restaurants",
    info: {
      singularName: "restaurant",
      pluralName: "restaurants",
      displayName: "Restaurant",
      description: "",
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {
      i18n: {
        localized: true,
      },
    },
    attributes: {
      title: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "string",
        required: true,
      },
      description: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "text",
      },
      books: {
        type: "relation",
        relation: "oneToMany",
        target: "api::book.book",
      },
      recipes: {
        type: "component",
        repeatable: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "food.recipe",
      },
      descs: {
        type: "component",
        repeatable: false,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "food.pub-component-1",
      },
      street: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "string",
      },
      city: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "string",
      },
      country: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "string",
      },
      createdAt: {
        type: "datetime",
      },
      updatedAt: {
        type: "datetime",
      },
      publishedAt: {
        type: "datetime",
        configurable: false,
        writable: true,
        visible: false,
      },
      createdBy: {
        type: "relation",
        relation: "oneToOne",
        target: "admin::user",
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true,
      },
      updatedBy: {
        type: "relation",
        relation: "oneToOne",
        target: "admin::user",
        configurable: false,
        writable: false,
        visible: false,
        useJoinTable: false,
        private: true,
      },
      localizations: {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        type: "relation",
        relation: "oneToMany",
        target: "api::restaurant.restaurant",
      },
      locale: {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        type: "string",
      },
    },
    __schema__: {
      collectionName: "restaurants",
      info: {
        singularName: "restaurant",
        pluralName: "restaurants",
        displayName: "Restaurant",
        description: "",
      },
      options: {
        draftAndPublish: true,
      },
      pluginOptions: {
        i18n: {
          localized: true,
        },
      },
      attributes: {
        title: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "string",
          required: true,
        },
        description: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "text",
        },
        books: {
          type: "relation",
          relation: "oneToMany",
          target: "api::book.book",
        },
        recipes: {
          type: "component",
          repeatable: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "food.recipe",
        },
        descs: {
          type: "component",
          repeatable: false,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "food.pub-component-1",
        },
        street: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "string",
        },
        city: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "string",
        },
        country: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "string",
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "restaurant",
    connection: "default",
    uid: "api::restaurant.restaurant",
    apiName: "restaurant",
    globalId: "Restaurant",
    actions: {},
    lifecycles: {},
    singularName: "restaurant",
    tableName: "restaurants",
  },
  {
    collectionName: "components_food_ingredient_variants",
    info: {
      displayName: "ingredient_variants",
      icon: "atlas",
    },
    options: {},
    attributes: {
      name: {
        type: "string",
      },
    },
    __filename__: "ingredient-variants.json",
    __schema__: {
      collectionName: "components_food_ingredient_variants",
      info: {
        displayName: "ingredient_variants",
        icon: "atlas",
      },
      options: {},
      attributes: {
        name: {
          type: "string",
        },
      },
      __filename__: "ingredient-variants.json",
    },
    uid: "food.ingredient-variants",
    category: "food",
    modelType: "component",
    modelName: "ingredient-variants",
    globalId: "ComponentFoodIngredientVariants",
    singularName: "ingredient-variants",
    tableName: "components_food_ingredient_variants",
  },
  {
    collectionName: "components_food_ingredients",
    info: {
      displayName: "ingredients",
      icon: "atom",
      description: "",
    },
    options: {},
    attributes: {
      name: {
        type: "string",
      },
      pcs: {
        type: "integer",
      },
      required: {
        type: "boolean",
      },
    },
    __filename__: "ingredients.json",
    __schema__: {
      collectionName: "components_food_ingredients",
      info: {
        displayName: "ingredients",
        icon: "atom",
        description: "",
      },
      options: {},
      attributes: {
        name: {
          type: "string",
        },
        pcs: {
          type: "integer",
        },
        required: {
          type: "boolean",
        },
      },
      __filename__: "ingredients.json",
    },
    uid: "food.ingredients",
    category: "food",
    modelType: "component",
    modelName: "ingredients",
    globalId: "ComponentFoodIngredients",
    singularName: "ingredients",
    tableName: "components_food_ingredients",
  },
  {
    collectionName: "components_food_pub_component_1s",
    info: {
      displayName: "Pub Component 1",
      icon: "american-sign-language-interpreting",
      description: "",
    },
    options: {},
    attributes: {
      rich_description: {
        type: "richtext",
      },
      history: {
        type: "text",
      },
      excerpt: {
        type: "string",
      },
      test_variants: {
        type: "component",
        repeatable: false,
        component: "food.ingredient-variants",
      },
    },
    __filename__: "pub-component-1.json",
    __schema__: {
      collectionName: "components_food_pub_component_1s",
      info: {
        displayName: "Pub Component 1",
        icon: "american-sign-language-interpreting",
        description: "",
      },
      options: {},
      attributes: {
        rich_description: {
          type: "richtext",
        },
        history: {
          type: "text",
        },
        excerpt: {
          type: "string",
        },
        test_variants: {
          type: "component",
          repeatable: false,
          component: "food.ingredient-variants",
        },
      },
      __filename__: "pub-component-1.json",
    },
    uid: "food.pub-component-1",
    category: "food",
    modelType: "component",
    modelName: "pub-component-1",
    globalId: "ComponentFoodPubComponent1",
    singularName: "pub-component-1",
    tableName: "components_food_pub_component_1s",
  },
  {
    collectionName: "components_food_recipes",
    info: {
      displayName: "recipe",
      icon: "ad",
      description: "",
    },
    options: {},
    attributes: {
      name: {
        type: "string",
      },
      ingredients: {
        type: "component",
        repeatable: true,
        component: "food.ingredients",
      },
      variants: {
        type: "component",
        repeatable: false,
        component: "food.ingredient-variants",
      },
    },
    __filename__: "recipe.json",
    __schema__: {
      collectionName: "components_food_recipes",
      info: {
        displayName: "recipe",
        icon: "ad",
        description: "",
      },
      options: {},
      attributes: {
        name: {
          type: "string",
        },
        ingredients: {
          type: "component",
          repeatable: true,
          component: "food.ingredients",
        },
        variants: {
          type: "component",
          repeatable: false,
          component: "food.ingredient-variants",
        },
      },
      __filename__: "recipe.json",
    },
    uid: "food.recipe",
    category: "food",
    modelType: "component",
    modelName: "recipe",
    globalId: "ComponentFoodRecipe",
    singularName: "recipe",
    tableName: "components_food_recipes",
  },
  {
    collectionName: "components_seo_galleries",
    info: {
      displayName: "Gallery",
      icon: "address-card",
      description: "",
    },
    options: {},
    attributes: {
      main_image: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      rest: {
        type: "relation",
        relation: "morphMany",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      seo_desc: {
        type: "string",
      },
    },
    __filename__: "gallery.json",
    __schema__: {
      collectionName: "components_seo_galleries",
      info: {
        displayName: "Gallery",
        icon: "address-card",
        description: "",
      },
      options: {},
      attributes: {
        main_image: {
          type: "media",
          multiple: false,
          required: false,
          allowedTypes: ["images", "files", "videos", "audios"],
        },
        rest: {
          type: "media",
          multiple: true,
          required: false,
          allowedTypes: ["images", "videos", "audios", "files"],
        },
        seo_desc: {
          type: "string",
        },
      },
      __filename__: "gallery.json",
    },
    uid: "seo.gallery",
    category: "seo",
    modelType: "component",
    modelName: "gallery",
    globalId: "ComponentSeoGallery",
    singularName: "gallery",
    tableName: "components_seo_galleries",
  },
];
