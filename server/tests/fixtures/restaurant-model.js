module.exports = {
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
};
