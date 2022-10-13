module.exports = [
  {
    kind: "collectionType",
    collectionName: "cookbooks",
    info: {
      singularName: "cookbook",
      pluralName: "cookbooks",
      displayName: "cookbook",
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
      },
      author_name: {
        pluginOptions: {
          i18n: {
            localized: false,
          },
        },
        type: "string",
      },
      pages: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "integer",
      },
      recipes: {
        type: "component",
        repeatable: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "food.cookbook-item",
      },
      gallery: {
        type: "component",
        repeatable: false,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "food.gallery",
      },
      used_in_restaurants: {
        type: "relation",
        relation: "oneToMany",
        target: "api::restaurant-simple-menu.restaurant-simple-menu",
        mappedBy: "used_cookbooks",
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
        target: "api::cookbook.cookbook",
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
      collectionName: "cookbooks",
      info: {
        singularName: "cookbook",
        pluralName: "cookbooks",
        displayName: "cookbook",
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
        },
        author_name: {
          pluginOptions: {
            i18n: {
              localized: false,
            },
          },
          type: "string",
        },
        pages: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "integer",
        },
        recipes: {
          type: "component",
          repeatable: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "food.cookbook-item",
        },
        gallery: {
          type: "component",
          repeatable: false,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "food.gallery",
        },
        used_in_restaurants: {
          type: "relation",
          relation: "oneToMany",
          target: "api::restaurant-simple-menu.restaurant-simple-menu",
          mappedBy: "used_cookbooks",
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "cookbook",
    connection: "default",
    uid: "api::cookbook.cookbook",
    apiName: "cookbook",
    globalId: "Cookbook",
    actions: {
    },
    lifecycles: {
    },
    singularName: "cookbook",
    tableName: "cookbooks",
  },
  {
    kind: "collectionType",
    collectionName: "restaurant_simple_flats",
    info: {
      singularName: "restaurant-simple-flat",
      pluralName: "restaurant-simple-flats",
      displayName: "restaurant-simple-flat",
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
      name: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "string",
      },
      description: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "text",
      },
      established_at: {
        pluginOptions: {
          i18n: {
            localized: false,
          },
        },
        type: "date",
      },
      is_franchise: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "boolean",
      },
      contact_email: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "email",
      },
      cuisine: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "enumeration",
        enum: [
          "Thai",
          "Spanish",
          "Moroccan",
          "Japanese",
          "Indian",
          "Italian",
          "French",
          "Chinese",
        ],
      },
      featured_image: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
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
        target: "api::restaurant-simple-flat.restaurant-simple-flat",
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
      collectionName: "restaurant_simple_flats",
      info: {
        singularName: "restaurant-simple-flat",
        pluralName: "restaurant-simple-flats",
        displayName: "restaurant-simple-flat",
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
        name: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "string",
        },
        description: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "text",
        },
        established_at: {
          pluginOptions: {
            i18n: {
              localized: false,
            },
          },
          type: "date",
        },
        is_franchise: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "boolean",
        },
        contact_email: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "email",
        },
        cuisine: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "enumeration",
          enum: [
            "Thai",
            "Spanish",
            "Moroccan",
            "Japanese",
            "Indian",
            "Italian",
            "French",
            "Chinese",
          ],
        },
        featured_image: {
          allowedTypes: [
            "images",
            "files",
            "videos",
            "audios",
          ],
          type: "media",
          multiple: false,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "restaurant-simple-flat",
    connection: "default",
    uid: "api::restaurant-simple-flat.restaurant-simple-flat",
    apiName: "restaurant-simple-flat",
    globalId: "RestaurantSimpleFlat",
    actions: {
    },
    lifecycles: {
    },
    singularName: "restaurant-simple-flat",
    tableName: "restaurant_simple_flats",
  },
  {
    kind: "collectionType",
    collectionName: "restaurant_simple_menus",
    info: {
      singularName: "restaurant-simple-menu",
      pluralName: "restaurant-simple-menus",
      displayName: "restaurant-simple-menu",
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
      name: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "string",
      },
      description: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "text",
      },
      established_at: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "date",
      },
      is_franchise: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "boolean",
      },
      contact_email: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "email",
      },
      cuisine: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "enumeration",
        enum: [
          "Thai",
          "Spanish",
          "Moroccan",
          "Japanese",
          "Indian",
          "Italian",
          "French",
          "Chinese",
        ],
      },
      featured_image: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      capacity: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "integer",
      },
      our_story: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "richtext",
      },
      supported_restaurants: {
        type: "relation",
        relation: "oneToMany",
        target: "api::restaurant-simple-menu.restaurant-simple-menu",
      },
      menu: {
        type: "component",
        repeatable: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "restaurant.menu-item",
      },
      used_cookbooks: {
        type: "relation",
        relation: "manyToOne",
        target: "api::cookbook.cookbook",
        inversedBy: "used_in_restaurants",
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
        target: "api::restaurant-simple-menu.restaurant-simple-menu",
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
      collectionName: "restaurant_simple_menus",
      info: {
        singularName: "restaurant-simple-menu",
        pluralName: "restaurant-simple-menus",
        displayName: "restaurant-simple-menu",
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
        name: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "string",
        },
        description: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "text",
        },
        established_at: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "date",
        },
        is_franchise: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "boolean",
        },
        contact_email: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "email",
        },
        cuisine: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "enumeration",
          enum: [
            "Thai",
            "Spanish",
            "Moroccan",
            "Japanese",
            "Indian",
            "Italian",
            "French",
            "Chinese",
          ],
        },
        featured_image: {
          type: "media",
          multiple: false,
          required: false,
          allowedTypes: [
            "images",
            "files",
            "videos",
            "audios",
          ],
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        capacity: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "integer",
        },
        our_story: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "richtext",
        },
        supported_restaurants: {
          type: "relation",
          relation: "oneToMany",
          target: "api::restaurant-simple-menu.restaurant-simple-menu",
        },
        menu: {
          type: "component",
          repeatable: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "restaurant.menu-item",
        },
        used_cookbooks: {
          type: "relation",
          relation: "manyToOne",
          target: "api::cookbook.cookbook",
          inversedBy: "used_in_restaurants",
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "restaurant-simple-menu",
    connection: "default",
    uid: "api::restaurant-simple-menu.restaurant-simple-menu",
    apiName: "restaurant-simple-menu",
    globalId: "RestaurantSimpleMenu",
    actions: {
    },
    lifecycles: {
    },
    singularName: "restaurant-simple-menu",
    tableName: "restaurant_simple_menus",
  },
  {
    kind: "collectionType",
    collectionName: "sample_jsons",
    info: {
      singularName: "sample-json",
      pluralName: "sample-jsons",
      displayName: "sample-json",
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
      purpose: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "string",
      },
      data: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "json",
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
        target: "api::sample-json.sample-json",
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
      collectionName: "sample_jsons",
      info: {
        singularName: "sample-json",
        pluralName: "sample-jsons",
        displayName: "sample-json",
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
        purpose: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "string",
        },
        data: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "json",
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "sample-json",
    connection: "default",
    uid: "api::sample-json.sample-json",
    apiName: "sample-json",
    globalId: "SampleJson",
    actions: {
    },
    lifecycles: {
    },
    singularName: "sample-json",
    tableName: "sample_jsons",
  },
  {
    collectionName: "components_food_cookbook_items",
    info: {
      displayName: "Cookbook Item",
      icon: "book-open",
      description: "",
    },
    options: {
    },
    attributes: {
      name: {
        type: "string",
      },
      recipe: {
        type: "richtext",
      },
      gallery: {
        type: "component",
        repeatable: true,
        component: "food.gallery-item",
      },
      estimated_cook_time: {
        type: "time",
        required: false,
      },
      difficulty: {
        type: "enumeration",
        enum: [
          "beginner",
          "easy",
          "moderate",
          "hard",
          "superstar",
          "dead mode",
        ],
      },
      author_name: {
        type: "string",
      },
      ingredients: {
        type: "component",
        repeatable: true,
        component: "food.recipe-ingredient",
      },
    },
    __filename__: "cookbook-item.json",
    __schema__: {
      collectionName: "components_food_cookbook_items",
      info: {
        displayName: "Cookbook Item",
        icon: "book-open",
        description: "",
      },
      options: {
      },
      attributes: {
        name: {
          type: "string",
        },
        recipe: {
          type: "richtext",
        },
        gallery: {
          type: "component",
          repeatable: true,
          component: "food.gallery-item",
        },
        estimated_cook_time: {
          type: "time",
          required: false,
        },
        difficulty: {
          type: "enumeration",
          enum: [
            "beginner",
            "easy",
            "moderate",
            "hard",
            "superstar",
            "dead mode",
          ],
        },
        author_name: {
          type: "string",
        },
        ingredients: {
          type: "component",
          repeatable: true,
          component: "food.recipe-ingredient",
        },
      },
      __filename__: "cookbook-item.json",
    },
    uid: "food.cookbook-item",
    category: "food",
    modelType: "component",
    modelName: "cookbook-item",
    globalId: "ComponentFoodCookbookItem",
    singularName: "cookbook-item",
    tableName: "components_food_cookbook_items",
  },
  {
    collectionName: "components_food_gallery_items",
    info: {
      displayName: "Gallery Item",
      icon: "photo-video",
    },
    options: {
    },
    attributes: {
      image_title: {
        type: "string",
      },
      image_description: {
        type: "text",
      },
      image: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
    },
    __filename__: "gallery-item.json",
    __schema__: {
      collectionName: "components_food_gallery_items",
      info: {
        displayName: "Gallery Item",
        icon: "photo-video",
      },
      options: {
      },
      attributes: {
        image_title: {
          type: "string",
        },
        image_description: {
          type: "text",
        },
        image: {
          allowedTypes: [
            "images",
            "files",
            "videos",
            "audios",
          ],
          type: "media",
          multiple: false,
        },
      },
      __filename__: "gallery-item.json",
    },
    uid: "food.gallery-item",
    category: "food",
    modelType: "component",
    modelName: "gallery-item",
    globalId: "ComponentFoodGalleryItem",
    singularName: "gallery-item",
    tableName: "components_food_gallery_items",
  },
  {
    collectionName: "components_food_galleries",
    info: {
      displayName: "Gallery",
      icon: "photo-video",
      description: "",
    },
    options: {
    },
    attributes: {
      main_image: {
        type: "component",
        repeatable: false,
        component: "food.gallery-item",
      },
      gallery: {
        type: "component",
        repeatable: true,
        component: "food.gallery-item",
      },
      optional_title: {
        type: "string",
      },
      annotation: {
        type: "richtext",
      },
    },
    __filename__: "gallery.json",
    __schema__: {
      collectionName: "components_food_galleries",
      info: {
        displayName: "Gallery",
        icon: "photo-video",
        description: "",
      },
      options: {
      },
      attributes: {
        main_image: {
          type: "component",
          repeatable: false,
          component: "food.gallery-item",
        },
        gallery: {
          type: "component",
          repeatable: true,
          component: "food.gallery-item",
        },
        optional_title: {
          type: "string",
        },
        annotation: {
          type: "richtext",
        },
      },
      __filename__: "gallery.json",
    },
    uid: "food.gallery",
    category: "food",
    modelType: "component",
    modelName: "gallery",
    globalId: "ComponentFoodGallery",
    singularName: "gallery",
    tableName: "components_food_galleries",
  },
  {
    collectionName: "components_food_recipe_ingredients",
    info: {
      displayName: "Recipe Ingredient",
      icon: "apple-alt",
    },
    options: {
    },
    attributes: {
      name: {
        type: "string",
      },
      amount: {
        type: "decimal",
      },
      unit: {
        type: "string",
      },
      is_required: {
        type: "boolean",
        default: true,
        required: false,
      },
    },
    __filename__: "recipe-ingredient.json",
    __schema__: {
      collectionName: "components_food_recipe_ingredients",
      info: {
        displayName: "Recipe Ingredient",
        icon: "apple-alt",
      },
      options: {
      },
      attributes: {
        name: {
          type: "string",
        },
        amount: {
          type: "decimal",
        },
        unit: {
          type: "string",
        },
        is_required: {
          type: "boolean",
          default: true,
          required: false,
        },
      },
      __filename__: "recipe-ingredient.json",
    },
    uid: "food.recipe-ingredient",
    category: "food",
    modelType: "component",
    modelName: "recipe-ingredient",
    globalId: "ComponentFoodRecipeIngredient",
    singularName: "recipe-ingredient",
    tableName: "components_food_recipe_ingredients",
  },
  {
    collectionName: "components_restaurant_menu_items",
    info: {
      displayName: "Menu Item",
      icon: "hotdog",
      description: "",
    },
    options: {
    },
    attributes: {
      name: {
        type: "string",
      },
      price: {
        type: "decimal",
      },
      currency: {
        type: "string",
      },
      description: {
        type: "richtext",
      },
      is_available: {
        type: "boolean",
      },
      food_gallery: {
        type: "relation",
        relation: "morphMany",
        target: "plugin::upload.file",
        morphBy: "related",
      },
    },
    __filename__: "menu-item.json",
    __schema__: {
      collectionName: "components_restaurant_menu_items",
      info: {
        displayName: "Menu Item",
        icon: "hotdog",
        description: "",
      },
      options: {
      },
      attributes: {
        name: {
          type: "string",
        },
        price: {
          type: "decimal",
        },
        currency: {
          type: "string",
        },
        description: {
          type: "richtext",
        },
        is_available: {
          type: "boolean",
        },
        food_gallery: {
          allowedTypes: [
            "images",
          ],
          type: "media",
          multiple: true,
        },
      },
      __filename__: "menu-item.json",
    },
    uid: "restaurant.menu-item",
    category: "restaurant",
    modelType: "component",
    modelName: "menu-item",
    globalId: "ComponentRestaurantMenuItem",
    singularName: "menu-item",
    tableName: "components_restaurant_menu_items",
  },
];
