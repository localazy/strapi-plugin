module.exports = [
  {
    kind: "collectionType",
    collectionName: "chapters",
    info: {
      singularName: "chapter",
      pluralName: "chapters",
      displayName: "chapter",
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
      lessons: {
        type: "relation",
        relation: "oneToMany",
        target: "api::lesson.lesson",
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
        target: "api::chapter.chapter",
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
      collectionName: "chapters",
      info: {
        singularName: "chapter",
        pluralName: "chapters",
        displayName: "chapter",
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
        lessons: {
          type: "relation",
          relation: "oneToMany",
          target: "api::lesson.lesson",
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "chapter",
    connection: "default",
    uid: "api::chapter.chapter",
    apiName: "chapter",
    globalId: "Chapter",
    actions: {
    },
    lifecycles: {
    },
    singularName: "chapter",
    tableName: "chapters",
  },
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
    collectionName: "courses",
    info: {
      singularName: "course",
      pluralName: "courses",
      displayName: "course",
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
      description: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "richtext",
      },
      chapters: {
        type: "relation",
        relation: "oneToMany",
        target: "api::chapter.chapter",
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
        target: "api::course.course",
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
      collectionName: "courses",
      info: {
        singularName: "course",
        pluralName: "courses",
        displayName: "course",
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
        description: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "richtext",
        },
        chapters: {
          type: "relation",
          relation: "oneToMany",
          target: "api::chapter.chapter",
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
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "course",
    connection: "default",
    uid: "api::course.course",
    apiName: "course",
    globalId: "Course",
    actions: {
    },
    lifecycles: {
    },
    singularName: "course",
    tableName: "courses",
  },
  {
    kind: "collectionType",
    collectionName: "lessons",
    info: {
      singularName: "lesson",
      pluralName: "lessons",
      displayName: "lesson",
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
      start_time: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "datetime",
      },
      duration: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "time",
      },
      description: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "richtext",
      },
      lesson_type: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "dynamiczone",
        components: [
          "lesson.lecture",
          "lesson.survey",
          "lesson.quiz",
        ],
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
        target: "api::lesson.lesson",
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
      collectionName: "lessons",
      info: {
        singularName: "lesson",
        pluralName: "lessons",
        displayName: "lesson",
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
        start_time: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "datetime",
        },
        duration: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "time",
        },
        description: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "richtext",
        },
        lesson_type: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "dynamiczone",
          components: [
            "lesson.lecture",
            "lesson.survey",
            "lesson.quiz",
          ],
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "lesson",
    connection: "default",
    uid: "api::lesson.lesson",
    apiName: "lesson",
    globalId: "Lesson",
    actions: {
    },
    lifecycles: {
    },
    singularName: "lesson",
    tableName: "lessons",
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
      dynamic_property: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "dynamiczone",
        components: [
          "food.gallery",
          "food.recipe-ingredient",
          "food.cookbook-item",
          "restaurant.menu-item",
          "food.gallery-item",
        ],
      },
      repeatable_component_property: {
        type: "component",
        repeatable: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "restaurant.menu-item",
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
        dynamic_property: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "dynamiczone",
          components: [
            "food.gallery",
            "food.recipe-ingredient",
            "food.cookbook-item",
            "restaurant.menu-item",
            "food.gallery-item",
          ],
        },
        repeatable_component_property: {
          type: "component",
          repeatable: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "restaurant.menu-item",
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
    collectionName: "components_lesson_answers",
    info: {
      displayName: "Answer",
      icon: "info",
      description: "",
    },
    options: {
    },
    attributes: {
      question_number: {
        type: "integer",
      },
      correct_answer: {
        type: "text",
      },
      answer_asset: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
    },
    __filename__: "answers.json",
    __schema__: {
      collectionName: "components_lesson_answers",
      info: {
        displayName: "Answer",
        icon: "info",
        description: "",
      },
      options: {
      },
      attributes: {
        question_number: {
          type: "integer",
        },
        correct_answer: {
          type: "text",
        },
        answer_asset: {
          type: "media",
          multiple: false,
          required: false,
          allowedTypes: [
            "images",
            "files",
            "videos",
            "audios",
          ],
        },
      },
      __filename__: "answers.json",
    },
    uid: "lesson.answers",
    category: "lesson",
    modelType: "component",
    modelName: "answers",
    globalId: "ComponentLessonAnswers",
    singularName: "answers",
    tableName: "components_lesson_answers",
  },
  {
    collectionName: "components_lesson_lectures",
    info: {
      displayName: "Lecture",
      icon: "align-left",
    },
    options: {
    },
    attributes: {
      content: {
        type: "richtext",
      },
    },
    __filename__: "lecture.json",
    __schema__: {
      collectionName: "components_lesson_lectures",
      info: {
        displayName: "Lecture",
        icon: "align-left",
      },
      options: {
      },
      attributes: {
        content: {
          type: "richtext",
        },
      },
      __filename__: "lecture.json",
    },
    uid: "lesson.lecture",
    category: "lesson",
    modelType: "component",
    modelName: "lecture",
    globalId: "ComponentLessonLecture",
    singularName: "lecture",
    tableName: "components_lesson_lectures",
  },
  {
    collectionName: "components_lesson_quizzes",
    info: {
      displayName: "Quiz",
      icon: "question-circle",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
      },
      questions: {
        type: "component",
        repeatable: true,
        component: "lesson.survey-question",
      },
      answers: {
        displayName: "answers",
        type: "component",
        repeatable: true,
        component: "lesson.answers",
      },
    },
    __filename__: "quiz.json",
    __schema__: {
      collectionName: "components_lesson_quizzes",
      info: {
        displayName: "Quiz",
        icon: "question-circle",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
        },
        questions: {
          type: "component",
          repeatable: true,
          component: "lesson.survey-question",
        },
        answers: {
          displayName: "answers",
          type: "component",
          repeatable: true,
          component: "lesson.answers",
        },
      },
      __filename__: "quiz.json",
    },
    uid: "lesson.quiz",
    category: "lesson",
    modelType: "component",
    modelName: "quiz",
    globalId: "ComponentLessonQuiz",
    singularName: "quiz",
    tableName: "components_lesson_quizzes",
  },
  {
    collectionName: "components_lesson_survey_questions",
    info: {
      displayName: "Question",
      icon: "question",
      description: "",
    },
    options: {
    },
    attributes: {
      question: {
        type: "richtext",
      },
      is_active: {
        type: "boolean",
      },
      assets: {
        type: "relation",
        relation: "morphMany",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      question_number: {
        type: "integer",
      },
    },
    __filename__: "survey-question.json",
    __schema__: {
      collectionName: "components_lesson_survey_questions",
      info: {
        displayName: "Question",
        icon: "question",
        description: "",
      },
      options: {
      },
      attributes: {
        question: {
          type: "richtext",
        },
        is_active: {
          type: "boolean",
        },
        assets: {
          type: "media",
          multiple: true,
          required: false,
          allowedTypes: [
            "images",
            "files",
            "videos",
            "audios",
          ],
        },
        question_number: {
          type: "integer",
        },
      },
      __filename__: "survey-question.json",
    },
    uid: "lesson.survey-question",
    category: "lesson",
    modelType: "component",
    modelName: "survey-question",
    globalId: "ComponentLessonSurveyQuestion",
    singularName: "survey-question",
    tableName: "components_lesson_survey_questions",
  },
  {
    collectionName: "components_lesson_surveys",
    info: {
      displayName: "Survey",
      icon: "sort-numeric-down",
      description: "",
    },
    options: {
    },
    attributes: {
      description: {
        type: "richtext",
      },
      questions: {
        type: "component",
        repeatable: true,
        component: "lesson.survey-question",
      },
    },
    __filename__: "survey.json",
    __schema__: {
      collectionName: "components_lesson_surveys",
      info: {
        displayName: "Survey",
        icon: "sort-numeric-down",
        description: "",
      },
      options: {
      },
      attributes: {
        description: {
          type: "richtext",
        },
        questions: {
          type: "component",
          repeatable: true,
          component: "lesson.survey-question",
        },
      },
      __filename__: "survey.json",
    },
    uid: "lesson.survey",
    category: "lesson",
    modelType: "component",
    modelName: "survey",
    globalId: "ComponentLessonSurvey",
    singularName: "survey",
    tableName: "components_lesson_surveys",
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
