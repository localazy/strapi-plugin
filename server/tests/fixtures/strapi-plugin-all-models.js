module.exports = [
  {
    kind: "collectionType",
    collectionName: "best_friends",
    info: {
      singularName: "best-friend",
      pluralName: "best-friends",
      displayName: "Best Friend",
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
      self_description: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "richtext",
      },
      ck5_description_html: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "richtext",
        options: {
          output: "HTML",
          preset: "rich",
        },
        customField: "plugin::ckeditor.CKEditor",
      },
      ck5_description_md: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "richtext",
        options: {
          output: "Markdown",
          preset: "rich",
        },
        customField: "plugin::ckeditor.CKEditor",
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
        target: "api::best-friend.best-friend",
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
      collectionName: "best_friends",
      info: {
        singularName: "best-friend",
        pluralName: "best-friends",
        displayName: "Best Friend",
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
        self_description: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "richtext",
        },
        ck5_description_html: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "customField",
          options: {
            output: "HTML",
            preset: "rich",
          },
          customField: "plugin::ckeditor.CKEditor",
        },
        ck5_description_md: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "customField",
          options: {
            output: "Markdown",
            preset: "rich",
          },
          customField: "plugin::ckeditor.CKEditor",
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "best-friend",
    connection: "default",
    uid: "api::best-friend.best-friend",
    apiName: "best-friend",
    globalId: "BestFriend",
    actions: {
    },
    lifecycles: {
    },
    singularName: "best-friend",
    tableName: "best_friends",
  },
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
        required: true,
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
          required: true,
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
    collectionName: "friends",
    info: {
      singularName: "friend",
      pluralName: "friends",
      displayName: "Friend",
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
      self_description: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "richtext",
      },
      why_do_i_like_my_best_friend: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "richtext",
      },
      best_friend: {
        type: "relation",
        relation: "oneToOne",
        target: "api::best-friend.best-friend",
      },
      friends: {
        type: "relation",
        relation: "oneToMany",
        target: "api::friend.friend",
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
        target: "api::friend.friend",
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
      collectionName: "friends",
      info: {
        singularName: "friend",
        pluralName: "friends",
        displayName: "Friend",
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
        self_description: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "richtext",
        },
        why_do_i_like_my_best_friend: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "richtext",
        },
        best_friend: {
          type: "relation",
          relation: "oneToOne",
          target: "api::best-friend.best-friend",
        },
        friends: {
          type: "relation",
          relation: "oneToMany",
          target: "api::friend.friend",
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "friend",
    connection: "default",
    uid: "api::friend.friend",
    apiName: "friend",
    globalId: "Friend",
    actions: {
    },
    lifecycles: {
    },
    singularName: "friend",
    tableName: "friends",
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
        required: true,
      },
      start_time: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "datetime",
        required: false,
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
          "lesson.quiz",
          "lesson.survey",
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
          required: true,
        },
        start_time: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "datetime",
          required: false,
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
            "lesson.quiz",
            "lesson.survey",
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
    collectionName: "pages",
    info: {
      singularName: "page",
      pluralName: "pages",
      displayName: "Page",
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
      template: {
        pluginOptions: {
          i18n: {
            localized: false,
          },
        },
        type: "enumeration",
        enum: [
          "page",
          "parent",
          "resourceshub",
          "contact",
          "trainings",
          "press-release",
        ],
        required: true,
        default: "page",
      },
      title: {
        type: "string",
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      parentPage: {
        type: "relation",
        relation: "oneToOne",
        target: "api::page.page",
      },
      seo: {
        type: "component",
        repeatable: false,
        component: "seo.seo",
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        required: true,
      },
      slug: {
        type: "string",
        regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        required: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      path: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "string",
        required: false,
      },
      hero: {
        type: "component",
        repeatable: false,
        component: "global.hero",
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      components: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "dynamiczone",
        components: [
          "global.gray-blocks",
          "global.features-list",
          "global.state-of-art",
          "global.text-with-background",
          "global.accordion",
          "global.section-header",
          "global.key-numbers",
          "global.cards-6",
          "global.title-and-text",
          "global.testimonial",
          "global.logo-carousel",
          "global.timeline",
          "global.textwithmedia",
          "global.people-cards-container",
          "global.textwithimagetwocols",
          "global.tags",
          "global.cards-two-cols",
          "global.rte",
          "global.faq",
        ],
      },
      relatedSolutions: {
        displayName: "relatedSolutions",
        type: "component",
        repeatable: false,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "page.related-solutions",
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
        target: "api::page.page",
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
      collectionName: "pages",
      info: {
        singularName: "page",
        pluralName: "pages",
        displayName: "Page",
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
        template: {
          pluginOptions: {
            i18n: {
              localized: false,
            },
          },
          type: "enumeration",
          enum: [
            "page",
            "parent",
            "resourceshub",
            "contact",
            "trainings",
            "press-release",
          ],
          required: true,
          default: "page",
        },
        title: {
          type: "string",
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        parentPage: {
          type: "relation",
          relation: "oneToOne",
          target: "api::page.page",
        },
        seo: {
          type: "component",
          repeatable: false,
          component: "seo.seo",
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          required: true,
        },
        slug: {
          type: "string",
          regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          required: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        path: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "string",
          required: false,
        },
        hero: {
          type: "component",
          repeatable: false,
          component: "global.hero",
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        components: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "dynamiczone",
          components: [
            "global.gray-blocks",
            "global.features-list",
            "global.state-of-art",
            "global.text-with-background",
            "global.accordion",
            "global.section-header",
            "global.key-numbers",
            "global.cards-6",
            "global.title-and-text",
            "global.testimonial",
            "global.logo-carousel",
            "global.timeline",
            "global.textwithmedia",
            "global.people-cards-container",
            "global.textwithimagetwocols",
            "global.tags",
            "global.cards-two-cols",
            "global.rte",
            "global.faq",
          ],
        },
        relatedSolutions: {
          displayName: "relatedSolutions",
          type: "component",
          repeatable: false,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "page.related-solutions",
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "page",
    connection: "default",
    uid: "api::page.page",
    apiName: "page",
    globalId: "Page",
    actions: {
    },
    lifecycles: {
    },
    singularName: "page",
    tableName: "pages",
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
        required: true,
      },
      description: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "text",
        required: true,
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
          required: true,
        },
        description: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "text",
          required: true,
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
          required: true,
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
      dynamic_property: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "dynamiczone",
        components: [
          "restaurant.menu-item",
          "food.recipe-ingredient",
          "lesson.quiz",
          "food.gallery-item",
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
        dynamic_property: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "dynamiczone",
          components: [
            "restaurant.menu-item",
            "food.recipe-ingredient",
            "lesson.quiz",
            "food.gallery-item",
          ],
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
    kind: "collectionType",
    collectionName: "solutions",
    info: {
      singularName: "solution",
      pluralName: "solutions",
      displayName: "Solution",
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
        type: "string",
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      logo: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      relatedSolutionsDisplay: {
        displayName: "relatedSolutionsDisplay",
        type: "component",
        repeatable: false,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "solution.related-solutions-display",
      },
      certifications: {
        type: "component",
        repeatable: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "solution.certification",
        required: false,
      },
      hero: {
        displayName: "Hero",
        type: "component",
        repeatable: false,
        component: "global.hero",
        required: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      overview: {
        displayName: "overview",
        type: "component",
        repeatable: false,
        component: "solution.overview",
        required: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      overviewComponents: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "dynamiczone",
        components: [
          "global.textwithmedia",
          "global.textwithimagetwocols",
          "global.accordion",
          "global.testimonial",
          "global.features-list",
          "global.text-with-background",
          "global.title-and-text",
          "global.rte",
          "global.state-of-art",
        ],
      },
      benefits: {
        displayName: "benefits",
        type: "component",
        repeatable: false,
        component: "solution.benefits",
        required: false,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      benefitsComponents: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "dynamiczone",
        components: [
          "global.textwithimagetwocols",
          "global.testimonial",
          "global.accordion",
          "global.features-list",
          "global.textwithmedia",
          "global.text-with-background",
          "global.title-and-text",
          "global.rte",
          "global.state-of-art",
        ],
      },
      keyFeatures: {
        type: "component",
        repeatable: false,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "solution.keyfeatures",
        required: false,
      },
      keyFeaturesComponents: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "dynamiczone",
        components: [
          "global.accordion",
          "global.textwithimagetwocols",
          "global.textwithmedia",
          "global.features-list",
          "global.testimonial",
          "global.text-with-background",
          "global.title-and-text",
          "global.rte",
          "global.state-of-art",
        ],
      },
      relatedSolutions: {
        type: "component",
        repeatable: false,
        component: "global.relatedsolutions",
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        required: true,
      },
      resources: {
        displayName: "Resources",
        type: "component",
        repeatable: false,
        component: "solution.resources",
        required: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      faq: {
        displayName: "faq",
        type: "component",
        repeatable: false,
        component: "solution.faq",
        required: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      seo: {
        type: "component",
        repeatable: false,
        component: "seo.seo",
        required: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      },
      slug: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "string",
        required: true,
        regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      },
      parentPage: {
        type: "relation",
        relation: "oneToOne",
        target: "api::page.page",
      },
      path: {
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        type: "string",
        required: false,
      },
      demo: {
        type: "component",
        repeatable: false,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
        component: "solution.demo",
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
        target: "api::solution.solution",
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
      collectionName: "solutions",
      info: {
        singularName: "solution",
        pluralName: "solutions",
        displayName: "Solution",
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
          type: "string",
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        logo: {
          type: "media",
          multiple: false,
          required: true,
          allowedTypes: [
            "images",
          ],
          pluginOptions: {
            i18n: {
              localized: false,
            },
          },
        },
        relatedSolutionsDisplay: {
          displayName: "relatedSolutionsDisplay",
          type: "component",
          repeatable: false,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "solution.related-solutions-display",
        },
        certifications: {
          type: "component",
          repeatable: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "solution.certification",
          required: false,
        },
        hero: {
          displayName: "Hero",
          type: "component",
          repeatable: false,
          component: "global.hero",
          required: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        overview: {
          displayName: "overview",
          type: "component",
          repeatable: false,
          component: "solution.overview",
          required: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        overviewComponents: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "dynamiczone",
          components: [
            "global.textwithmedia",
            "global.textwithimagetwocols",
            "global.accordion",
            "global.testimonial",
            "global.features-list",
            "global.text-with-background",
            "global.title-and-text",
            "global.rte",
            "global.state-of-art",
          ],
        },
        benefits: {
          displayName: "benefits",
          type: "component",
          repeatable: false,
          component: "solution.benefits",
          required: false,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        benefitsComponents: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "dynamiczone",
          components: [
            "global.textwithimagetwocols",
            "global.testimonial",
            "global.accordion",
            "global.features-list",
            "global.textwithmedia",
            "global.text-with-background",
            "global.title-and-text",
            "global.rte",
            "global.state-of-art",
          ],
        },
        keyFeatures: {
          type: "component",
          repeatable: false,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "solution.keyfeatures",
          required: false,
        },
        keyFeaturesComponents: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "dynamiczone",
          components: [
            "global.accordion",
            "global.textwithimagetwocols",
            "global.textwithmedia",
            "global.features-list",
            "global.testimonial",
            "global.text-with-background",
            "global.title-and-text",
            "global.rte",
            "global.state-of-art",
          ],
        },
        relatedSolutions: {
          type: "component",
          repeatable: false,
          component: "global.relatedsolutions",
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          required: true,
        },
        resources: {
          displayName: "Resources",
          type: "component",
          repeatable: false,
          component: "solution.resources",
          required: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        faq: {
          displayName: "faq",
          type: "component",
          repeatable: false,
          component: "solution.faq",
          required: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        seo: {
          type: "component",
          repeatable: false,
          component: "seo.seo",
          required: true,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
        },
        slug: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "string",
          required: true,
          regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        },
        parentPage: {
          type: "relation",
          relation: "oneToOne",
          target: "api::page.page",
        },
        path: {
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          type: "string",
          required: false,
        },
        demo: {
          type: "component",
          repeatable: false,
          pluginOptions: {
            i18n: {
              localized: true,
            },
          },
          component: "solution.demo",
        },
      },
      kind: "collectionType",
    },
    modelType: "contentType",
    modelName: "solution",
    connection: "default",
    uid: "api::solution.solution",
    apiName: "solution",
    globalId: "Solution",
    actions: {
    },
    lifecycles: {
    },
    singularName: "solution",
    tableName: "solutions",
  },
  {
    collectionName: "components_accordion_items",
    info: {
      displayName: "items",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
        required: true,
      },
      subTitle: {
        type: "text",
        required: false,
      },
      text: {
        type: "richtext",
        required: false,
      },
      icon: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
    },
    __filename__: "items.json",
    __schema__: {
      collectionName: "components_accordion_items",
      info: {
        displayName: "items",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
          required: true,
        },
        subTitle: {
          type: "text",
          required: false,
        },
        text: {
          type: "richtext",
          required: false,
        },
        icon: {
          type: "media",
          multiple: false,
          required: false,
          allowedTypes: [
            "images",
          ],
        },
      },
      __filename__: "items.json",
    },
    uid: "accordion.items",
    category: "accordion",
    modelType: "component",
    modelName: "items",
    globalId: "ComponentAccordionItems",
    singularName: "items",
    tableName: "components_accordion_items",
  },
  {
    collectionName: "components_cards_6_items_lvl_2s",
    info: {
      displayName: "items-lvl-2",
      icon: "address-card",
      description: "",
    },
    options: {
    },
    attributes: {
      tags: {
        displayName: "Tags",
        type: "component",
        repeatable: true,
        component: "global.tags",
      },
      title: {
        type: "text",
        required: true,
      },
      text: {
        type: "richtext",
        required: false,
      },
      textColor: {
        type: "enumeration",
        enum: [
          "black",
          "white",
        ],
        default: "black",
        required: true,
      },
      ctas: {
        displayName: "CTAs",
        type: "component",
        repeatable: true,
        component: "global.ctas",
      },
      backgroundImage: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
    },
    __filename__: "items-lvl-2.json",
    __schema__: {
      collectionName: "components_cards_6_items_lvl_2s",
      info: {
        displayName: "items-lvl-2",
        icon: "address-card",
        description: "",
      },
      options: {
      },
      attributes: {
        tags: {
          displayName: "Tags",
          type: "component",
          repeatable: true,
          component: "global.tags",
        },
        title: {
          type: "text",
          required: true,
        },
        text: {
          type: "richtext",
          required: false,
        },
        textColor: {
          type: "enumeration",
          enum: [
            "black",
            "white",
          ],
          default: "black",
          required: true,
        },
        ctas: {
          displayName: "CTAs",
          type: "component",
          repeatable: true,
          component: "global.ctas",
        },
        backgroundImage: {
          allowedTypes: [
            "images",
          ],
          type: "media",
          multiple: false,
          required: true,
        },
      },
      __filename__: "items-lvl-2.json",
    },
    uid: "cards-6.items-lvl-2",
    category: "cards-6",
    modelType: "component",
    modelName: "items-lvl-2",
    globalId: "ComponentCards6ItemsLvl2",
    singularName: "items-lvl-2",
    tableName: "components_cards_6_items_lvl_2s",
  },
  {
    collectionName: "components_cards_6_items",
    info: {
      displayName: "items",
      icon: "address-card",
    },
    options: {
    },
    attributes: {
      items: {
        displayName: "Items",
        type: "component",
        repeatable: true,
        component: "cards-6.items-lvl-2",
      },
    },
    __filename__: "items.json",
    __schema__: {
      collectionName: "components_cards_6_items",
      info: {
        displayName: "items",
        icon: "address-card",
      },
      options: {
      },
      attributes: {
        items: {
          displayName: "Items",
          type: "component",
          repeatable: true,
          component: "cards-6.items-lvl-2",
        },
      },
      __filename__: "items.json",
    },
    uid: "cards-6.items",
    category: "cards-6",
    modelType: "component",
    modelName: "items",
    globalId: "ComponentCards6Items",
    singularName: "items",
    tableName: "components_cards_6_items",
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
    collectionName: "components_footer_social_medias",
    info: {
      displayName: "social-media",
    },
    options: {
    },
    attributes: {
      icon: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      url: {
        type: "string",
        required: true,
        regex: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)",
      },
    },
    __filename__: "social-media.json",
    __schema__: {
      collectionName: "components_footer_social_medias",
      info: {
        displayName: "social-media",
      },
      options: {
      },
      attributes: {
        icon: {
          allowedTypes: [
            "images",
          ],
          type: "media",
          multiple: false,
          required: true,
        },
        url: {
          type: "string",
          required: true,
          regex: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)",
        },
      },
      __filename__: "social-media.json",
    },
    uid: "footer.social-media",
    category: "footer",
    modelType: "component",
    modelName: "social-media",
    globalId: "ComponentFooterSocialMedia",
    singularName: "social-media",
    tableName: "components_footer_social_medias",
  },
  {
    collectionName: "components_global_subscribe_newsletter_footer_forms",
    info: {
      displayName: "subscribeNewsletterForm",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        required: true,
      },
      description: {
        type: "string",
        required: true,
      },
      formConfirmationMessage: {
        type: "string",
        required: true,
      },
    },
    __filename__: "subscribe-newsletter-footer-form.json",
    __schema__: {
      collectionName: "components_global_subscribe_newsletter_footer_forms",
      info: {
        displayName: "subscribeNewsletterForm",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          required: true,
        },
        description: {
          type: "string",
          required: true,
        },
        formConfirmationMessage: {
          type: "string",
          required: true,
        },
      },
      __filename__: "subscribe-newsletter-footer-form.json",
    },
    uid: "footer.subscribe-newsletter-footer-form",
    category: "footer",
    modelType: "component",
    modelName: "subscribe-newsletter-footer-form",
    globalId: "ComponentFooterSubscribeNewsletterFooterForm",
    singularName: "subscribe-newsletter-footer-form",
    tableName: "components_global_subscribe_newsletter_footer_forms",
  },
  {
    collectionName: "components_global_accordions",
    info: {
      displayName: "accordion",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
      },
      items: {
        displayName: "items",
        type: "component",
        repeatable: true,
        component: "accordion.items",
        required: true,
      },
      itemsInAccordionUnfold: {
        type: "boolean",
        default: false,
        required: false,
      },
    },
    __filename__: "accordion.json",
    __schema__: {
      collectionName: "components_global_accordions",
      info: {
        displayName: "accordion",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
        },
        items: {
          displayName: "items",
          type: "component",
          repeatable: true,
          component: "accordion.items",
          required: true,
        },
        itemsInAccordionUnfold: {
          type: "boolean",
          default: false,
          required: false,
        },
      },
      __filename__: "accordion.json",
    },
    uid: "global.accordion",
    category: "global",
    modelType: "component",
    modelName: "accordion",
    globalId: "ComponentGlobalAccordion",
    singularName: "accordion",
    tableName: "components_global_accordions",
  },
  {
    collectionName: "components_global_cards_6s",
    info: {
      displayName: "cards-6",
      icon: "address-card",
    },
    options: {
    },
    attributes: {
      items: {
        displayName: "items",
        type: "component",
        repeatable: true,
        component: "cards-6.items",
      },
    },
    __filename__: "cards-6.json",
    __schema__: {
      collectionName: "components_global_cards_6s",
      info: {
        displayName: "cards-6",
        icon: "address-card",
      },
      options: {
      },
      attributes: {
        items: {
          displayName: "items",
          type: "component",
          repeatable: true,
          component: "cards-6.items",
        },
      },
      __filename__: "cards-6.json",
    },
    uid: "global.cards-6",
    category: "global",
    modelType: "component",
    modelName: "cards-6",
    globalId: "ComponentGlobalCards6",
    singularName: "cards-6",
    tableName: "components_global_cards_6s",
  },
  {
    collectionName: "components_global_cards_two_cols",
    info: {
      displayName: "cardsTwoCols",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
        required: false,
      },
      items: {
        displayName: "items",
        type: "component",
        repeatable: true,
        component: "cards-6.items",
      },
    },
    __filename__: "cards-two-cols.json",
    __schema__: {
      collectionName: "components_global_cards_two_cols",
      info: {
        displayName: "cardsTwoCols",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
          required: false,
        },
        items: {
          displayName: "items",
          type: "component",
          repeatable: true,
          component: "cards-6.items",
        },
      },
      __filename__: "cards-two-cols.json",
    },
    uid: "global.cards-two-cols",
    category: "global",
    modelType: "component",
    modelName: "cards-two-cols",
    globalId: "ComponentGlobalCardsTwoCols",
    singularName: "cards-two-cols",
    tableName: "components_global_cards_two_cols",
  },
  {
    collectionName: "components_global_contact_forms",
    info: {
      displayName: "contactForm",
      description: "",
    },
    options: {
    },
    attributes: {
      titleFormSales: {
        type: "text",
      },
      textFormSales: {
        type: "text",
      },
      titleFormHelpDesk: {
        type: "string",
      },
      textFormHelpDesk: {
        type: "text",
      },
    },
    __filename__: "contact-form.json",
    __schema__: {
      collectionName: "components_global_contact_forms",
      info: {
        displayName: "contactForm",
        description: "",
      },
      options: {
      },
      attributes: {
        titleFormSales: {
          type: "text",
        },
        textFormSales: {
          type: "text",
        },
        titleFormHelpDesk: {
          type: "string",
        },
        textFormHelpDesk: {
          type: "text",
        },
      },
      __filename__: "contact-form.json",
    },
    uid: "global.contact-form",
    category: "global",
    modelType: "component",
    modelName: "contact-form",
    globalId: "ComponentGlobalContactForm",
    singularName: "contact-form",
    tableName: "components_global_contact_forms",
  },
  {
    collectionName: "components_global_ctas",
    info: {
      displayName: "ctas",
      icon: "allergies",
      description: "",
    },
    options: {
    },
    attributes: {
      text: {
        type: "string",
        required: true,
      },
      color: {
        type: "enumeration",
        enum: [
          "white",
          "blue",
        ],
        default: "blue",
        required: true,
      },
      url: {
        type: "string",
        regex: "(^[\\/#].*$|https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*))",
        required: true,
      },
    },
    __filename__: "ctas.json",
    __schema__: {
      collectionName: "components_global_ctas",
      info: {
        displayName: "ctas",
        icon: "allergies",
        description: "",
      },
      options: {
      },
      attributes: {
        text: {
          type: "string",
          required: true,
        },
        color: {
          type: "enumeration",
          enum: [
            "white",
            "blue",
          ],
          default: "blue",
          required: true,
        },
        url: {
          type: "string",
          regex: "(^[\\/#].*$|https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*))",
          required: true,
        },
      },
      __filename__: "ctas.json",
    },
    uid: "global.ctas",
    category: "global",
    modelType: "component",
    modelName: "ctas",
    globalId: "ComponentGlobalCtas",
    singularName: "ctas",
    tableName: "components_global_ctas",
  },
  {
    collectionName: "components_global_faqs",
    info: {
      displayName: "faq",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        required: true,
      },
      text: {
        type: "richtext",
        required: true,
      },
    },
    __filename__: "faq.json",
    __schema__: {
      collectionName: "components_global_faqs",
      info: {
        displayName: "faq",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          required: true,
        },
        text: {
          type: "richtext",
          required: true,
        },
      },
      __filename__: "faq.json",
    },
    uid: "global.faq",
    category: "global",
    modelType: "component",
    modelName: "faq",
    globalId: "ComponentGlobalFaq",
    singularName: "faq",
    tableName: "components_global_faqs",
  },
  {
    collectionName: "components_global_features",
    info: {
      displayName: "feature",
      icon: "ad",
    },
    options: {
    },
    attributes: {
      icon: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      text: {
        type: "text",
        required: true,
      },
    },
    __filename__: "feature.json",
    __schema__: {
      collectionName: "components_global_features",
      info: {
        displayName: "feature",
        icon: "ad",
      },
      options: {
      },
      attributes: {
        icon: {
          allowedTypes: [
            "images",
          ],
          type: "media",
          multiple: false,
          required: true,
        },
        text: {
          type: "text",
          required: true,
        },
      },
      __filename__: "feature.json",
    },
    uid: "global.feature",
    category: "global",
    modelType: "component",
    modelName: "feature",
    globalId: "ComponentGlobalFeature",
    singularName: "feature",
    tableName: "components_global_features",
  },
  {
    collectionName: "components_global_features_lists",
    info: {
      displayName: "featuresList",
      icon: "ad",
    },
    options: {
    },
    attributes: {
      items: {
        type: "component",
        repeatable: true,
        component: "global.feature",
      },
    },
    __filename__: "features-list.json",
    __schema__: {
      collectionName: "components_global_features_lists",
      info: {
        displayName: "featuresList",
        icon: "ad",
      },
      options: {
      },
      attributes: {
        items: {
          type: "component",
          repeatable: true,
          component: "global.feature",
        },
      },
      __filename__: "features-list.json",
    },
    uid: "global.features-list",
    category: "global",
    modelType: "component",
    modelName: "features-list",
    globalId: "ComponentGlobalFeaturesList",
    singularName: "features-list",
    tableName: "components_global_features_lists",
  },
  {
    collectionName: "components_global_forms",
    info: {
      displayName: "form",
    },
    options: {
    },
    attributes: {
      sectionTitle: {
        type: "string",
      },
      title: {
        type: "string",
      },
      text: {
        type: "richtext",
      },
      ctaText: {
        type: "string",
      },
      confirmationText: {
        type: "richtext",
      },
    },
    __filename__: "form.json",
    __schema__: {
      collectionName: "components_global_forms",
      info: {
        displayName: "form",
      },
      options: {
      },
      attributes: {
        sectionTitle: {
          type: "string",
        },
        title: {
          type: "string",
        },
        text: {
          type: "richtext",
        },
        ctaText: {
          type: "string",
        },
        confirmationText: {
          type: "richtext",
        },
      },
      __filename__: "form.json",
    },
    uid: "global.form",
    category: "global",
    modelType: "component",
    modelName: "form",
    globalId: "ComponentGlobalForm",
    singularName: "form",
    tableName: "components_global_forms",
  },
  {
    collectionName: "components_global_gray_blocks",
    info: {
      displayName: "grayBlocks",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
      },
      items: {
        displayName: "item",
        type: "component",
        repeatable: true,
        component: "gray-blocks.item",
      },
    },
    __filename__: "gray-blocks.json",
    __schema__: {
      collectionName: "components_global_gray_blocks",
      info: {
        displayName: "grayBlocks",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
        },
        items: {
          displayName: "item",
          type: "component",
          repeatable: true,
          component: "gray-blocks.item",
        },
      },
      __filename__: "gray-blocks.json",
    },
    uid: "global.gray-blocks",
    category: "global",
    modelType: "component",
    modelName: "gray-blocks",
    globalId: "ComponentGlobalGrayBlocks",
    singularName: "gray-blocks",
    tableName: "components_global_gray_blocks",
  },
  {
    collectionName: "components_global_heroes",
    info: {
      displayName: "hero",
      icon: "address-card",
    },
    options: {
    },
    attributes: {
      preTitle: {
        type: "string",
        required: false,
      },
      title: {
        type: "text",
        required: true,
      },
      text: {
        type: "text",
        required: false,
      },
      textColor: {
        type: "enumeration",
        enum: [
          "black",
          "white",
        ],
        default: "black",
        required: false,
      },
      image: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      ctas: {
        displayName: "ctas",
        type: "component",
        repeatable: true,
        component: "global.ctas",
      },
      animatedText: {
        displayName: "animatedText",
        type: "component",
        repeatable: false,
        component: "hero.animated-text",
      },
    },
    __filename__: "hero.json",
    __schema__: {
      collectionName: "components_global_heroes",
      info: {
        displayName: "hero",
        icon: "address-card",
      },
      options: {
      },
      attributes: {
        preTitle: {
          type: "string",
          required: false,
        },
        title: {
          type: "text",
          required: true,
        },
        text: {
          type: "text",
          required: false,
        },
        textColor: {
          type: "enumeration",
          enum: [
            "black",
            "white",
          ],
          default: "black",
          required: false,
        },
        image: {
          type: "media",
          multiple: false,
          required: false,
          allowedTypes: [
            "images",
          ],
        },
        ctas: {
          displayName: "ctas",
          type: "component",
          repeatable: true,
          component: "global.ctas",
        },
        animatedText: {
          displayName: "animatedText",
          type: "component",
          repeatable: false,
          component: "hero.animated-text",
        },
      },
      __filename__: "hero.json",
    },
    uid: "global.hero",
    category: "global",
    modelType: "component",
    modelName: "hero",
    globalId: "ComponentGlobalHero",
    singularName: "hero",
    tableName: "components_global_heroes",
  },
  {
    collectionName: "components_global_key_numbers",
    info: {
      displayName: "keyNumbers",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
        required: false,
      },
      items: {
        displayName: "keyNumberAndDesc",
        type: "component",
        repeatable: true,
        component: "key-numbers.key-number-and-desc",
        required: true,
        min: 1,
      },
    },
    __filename__: "key-numbers.json",
    __schema__: {
      collectionName: "components_global_key_numbers",
      info: {
        displayName: "keyNumbers",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
          required: false,
        },
        items: {
          displayName: "keyNumberAndDesc",
          type: "component",
          repeatable: true,
          component: "key-numbers.key-number-and-desc",
          required: true,
          min: 1,
        },
      },
      __filename__: "key-numbers.json",
    },
    uid: "global.key-numbers",
    category: "global",
    modelType: "component",
    modelName: "key-numbers",
    globalId: "ComponentGlobalKeyNumbers",
    singularName: "key-numbers",
    tableName: "components_global_key_numbers",
  },
  {
    collectionName: "components_global_links",
    info: {
      displayName: "link",
      icon: "link",
    },
    options: {
    },
    attributes: {
      type: {
        type: "enumeration",
        enum: [
          "internal",
          "external",
        ],
        default: "internal",
        required: true,
      },
      url: {
        type: "string",
        required: true,
        regex: "(^\\/.*\\/$|https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*))",
      },
    },
    __filename__: "link.json",
    __schema__: {
      collectionName: "components_global_links",
      info: {
        displayName: "link",
        icon: "link",
      },
      options: {
      },
      attributes: {
        type: {
          type: "enumeration",
          enum: [
            "internal",
            "external",
          ],
          default: "internal",
          required: true,
        },
        url: {
          type: "string",
          required: true,
          regex: "(^\\/.*\\/$|https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*))",
        },
      },
      __filename__: "link.json",
    },
    uid: "global.link",
    category: "global",
    modelType: "component",
    modelName: "link",
    globalId: "ComponentGlobalLink",
    singularName: "link",
    tableName: "components_global_links",
  },
  {
    collectionName: "components_global_logo_carousels",
    info: {
      displayName: "logo-carousel",
      icon: "sliders-h",
      description: "",
    },
    options: {
    },
    attributes: {
      items: {
        type: "relation",
        relation: "morphMany",
        target: "plugin::upload.file",
        morphBy: "related",
      },
    },
    __filename__: "logo-carousel.json",
    __schema__: {
      collectionName: "components_global_logo_carousels",
      info: {
        displayName: "logo-carousel",
        icon: "sliders-h",
        description: "",
      },
      options: {
      },
      attributes: {
        items: {
          allowedTypes: [
            "images",
          ],
          type: "media",
          multiple: true,
          required: true,
        },
      },
      __filename__: "logo-carousel.json",
    },
    uid: "global.logo-carousel",
    category: "global",
    modelType: "component",
    modelName: "logo-carousel",
    globalId: "ComponentGlobalLogoCarousel",
    singularName: "logo-carousel",
    tableName: "components_global_logo_carousels",
  },
  {
    collectionName: "components_global_people_cards_containers",
    info: {
      displayName: "peopleCardsContainer",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
      },
      peopleCards: {
        type: "component",
        repeatable: true,
        component: "people.people-card",
        required: true,
        min: 1,
      },
      isBigCard: {
        type: "boolean",
        default: true,
        required: true,
      },
    },
    __filename__: "people-cards-container.json",
    __schema__: {
      collectionName: "components_global_people_cards_containers",
      info: {
        displayName: "peopleCardsContainer",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
        },
        peopleCards: {
          type: "component",
          repeatable: true,
          component: "people.people-card",
          required: true,
          min: 1,
        },
        isBigCard: {
          type: "boolean",
          default: true,
          required: true,
        },
      },
      __filename__: "people-cards-container.json",
    },
    uid: "global.people-cards-container",
    category: "global",
    modelType: "component",
    modelName: "people-cards-container",
    globalId: "ComponentGlobalPeopleCardsContainer",
    singularName: "people-cards-container",
    tableName: "components_global_people_cards_containers",
  },
  {
    collectionName: "components_solution_relatedSolutions",
    info: {
      displayName: "relatedSolutions",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
        required: false,
      },
      relatedSolutions: {
        displayName: "relatedSolutions",
        type: "component",
        repeatable: false,
        component: "related-solutions.related-solutions",
        required: true,
      },
    },
    __filename__: "relatedSolutions.json",
    __schema__: {
      collectionName: "components_solution_relatedSolutions",
      info: {
        displayName: "relatedSolutions",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
          required: false,
        },
        relatedSolutions: {
          displayName: "relatedSolutions",
          type: "component",
          repeatable: false,
          component: "related-solutions.related-solutions",
          required: true,
        },
      },
      __filename__: "relatedSolutions.json",
    },
    uid: "global.relatedsolutions",
    category: "global",
    modelType: "component",
    modelName: "relatedsolutions",
    globalId: "ComponentGlobalRelatedsolutions",
    singularName: "relatedsolutions",
    tableName: "components_solution_relatedSolutions",
  },
  {
    collectionName: "components_global_rtes",
    info: {
      displayName: "rte",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
      },
      text: {
        type: "richtext",
      },
    },
    __filename__: "rte.json",
    __schema__: {
      collectionName: "components_global_rtes",
      info: {
        displayName: "rte",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
        },
        text: {
          type: "richtext",
        },
      },
      __filename__: "rte.json",
    },
    uid: "global.rte",
    category: "global",
    modelType: "component",
    modelName: "rte",
    globalId: "ComponentGlobalRte",
    singularName: "rte",
    tableName: "components_global_rtes",
  },
  {
    collectionName: "components_global_section_headers",
    info: {
      displayName: "Section Header",
      icon: "tenge",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        required: true,
      },
    },
    __filename__: "section-header.json",
    __schema__: {
      collectionName: "components_global_section_headers",
      info: {
        displayName: "Section Header",
        icon: "tenge",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          required: true,
        },
      },
      __filename__: "section-header.json",
    },
    uid: "global.section-header",
    category: "global",
    modelType: "component",
    modelName: "section-header",
    globalId: "ComponentGlobalSectionHeader",
    singularName: "section-header",
    tableName: "components_global_section_headers",
  },
  {
    collectionName: "components_global_short_texts",
    info: {
      displayName: "shortText",
      description: "",
    },
    options: {
    },
    attributes: {
      text: {
        type: "string",
        required: true,
      },
    },
    __filename__: "short-text.json",
    __schema__: {
      collectionName: "components_global_short_texts",
      info: {
        displayName: "shortText",
        description: "",
      },
      options: {
      },
      attributes: {
        text: {
          type: "string",
          required: true,
        },
      },
      __filename__: "short-text.json",
    },
    uid: "global.short-text",
    category: "global",
    modelType: "component",
    modelName: "short-text",
    globalId: "ComponentGlobalShortText",
    singularName: "short-text",
    tableName: "components_global_short_texts",
  },
  {
    collectionName: "components_global_state_of_arts",
    info: {
      displayName: "state-of-art",
      icon: "address-card",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
      },
      text: {
        type: "text",
      },
      cta: {
        displayName: "CTA",
        type: "component",
        repeatable: false,
        component: "global.ctas",
      },
      items: {
        displayName: "Items",
        type: "component",
        repeatable: true,
        component: "state-of-art.items",
        required: true,
      },
    },
    __filename__: "state-of-art.json",
    __schema__: {
      collectionName: "components_global_state_of_arts",
      info: {
        displayName: "state-of-art",
        icon: "address-card",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
        },
        text: {
          type: "text",
        },
        cta: {
          displayName: "CTA",
          type: "component",
          repeatable: false,
          component: "global.ctas",
        },
        items: {
          displayName: "Items",
          type: "component",
          repeatable: true,
          component: "state-of-art.items",
          required: true,
        },
      },
      __filename__: "state-of-art.json",
    },
    uid: "global.state-of-art",
    category: "global",
    modelType: "component",
    modelName: "state-of-art",
    globalId: "ComponentGlobalStateOfArt",
    singularName: "state-of-art",
    tableName: "components_global_state_of_arts",
  },
  {
    collectionName: "components_global_tags",
    info: {
      displayName: "Tags",
      icon: "allergies",
      description: "",
    },
    options: {
    },
    attributes: {
      name: {
        type: "string",
        required: true,
      },
    },
    __filename__: "tags.json",
    __schema__: {
      collectionName: "components_global_tags",
      info: {
        displayName: "Tags",
        icon: "allergies",
        description: "",
      },
      options: {
      },
      attributes: {
        name: {
          type: "string",
          required: true,
        },
      },
      __filename__: "tags.json",
    },
    uid: "global.tags",
    category: "global",
    modelType: "component",
    modelName: "tags",
    globalId: "ComponentGlobalTags",
    singularName: "tags",
    tableName: "components_global_tags",
  },
  {
    collectionName: "components_global_testimonials",
    info: {
      displayName: "testimonial",
      icon: "address-book",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        required: false,
      },
      text: {
        type: "richtext",
        required: true,
      },
      cta: {
        type: "component",
        repeatable: false,
        component: "global.ctas",
        required: false,
      },
      person: {
        displayName: "person",
        type: "component",
        repeatable: false,
        component: "testimonial.person",
        required: true,
      },
    },
    __filename__: "testimonial.json",
    __schema__: {
      collectionName: "components_global_testimonials",
      info: {
        displayName: "testimonial",
        icon: "address-book",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          required: false,
        },
        text: {
          type: "richtext",
          required: true,
        },
        cta: {
          type: "component",
          repeatable: false,
          component: "global.ctas",
          required: false,
        },
        person: {
          displayName: "person",
          type: "component",
          repeatable: false,
          component: "testimonial.person",
          required: true,
        },
      },
      __filename__: "testimonial.json",
    },
    uid: "global.testimonial",
    category: "global",
    modelType: "component",
    modelName: "testimonial",
    globalId: "ComponentGlobalTestimonial",
    singularName: "testimonial",
    tableName: "components_global_testimonials",
  },
  {
    collectionName: "components_homepage_text_with_backgrounds",
    info: {
      displayName: "text-with-background",
      icon: "address-card",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
      },
      text: {
        type: "text",
      },
      textColor: {
        type: "enumeration",
        enum: [
          "black",
          "white",
        ],
        default: "black",
      },
      backgroundImage: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      cta: {
        type: "component",
        repeatable: false,
        component: "global.ctas",
      },
      textPosition: {
        type: "enumeration",
        enum: [
          "left",
          "right",
        ],
        default: "left",
        required: true,
      },
    },
    __filename__: "text-with-background.json",
    __schema__: {
      collectionName: "components_homepage_text_with_backgrounds",
      info: {
        displayName: "text-with-background",
        icon: "address-card",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
        },
        text: {
          type: "text",
        },
        textColor: {
          type: "enumeration",
          enum: [
            "black",
            "white",
          ],
          default: "black",
        },
        backgroundImage: {
          type: "media",
          multiple: false,
          required: true,
          allowedTypes: [
            "images",
          ],
        },
        cta: {
          type: "component",
          repeatable: false,
          component: "global.ctas",
        },
        textPosition: {
          type: "enumeration",
          enum: [
            "left",
            "right",
          ],
          default: "left",
          required: true,
        },
      },
      __filename__: "text-with-background.json",
    },
    uid: "global.text-with-background",
    category: "global",
    modelType: "component",
    modelName: "text-with-background",
    globalId: "ComponentGlobalTextWithBackground",
    singularName: "text-with-background",
    tableName: "components_homepage_text_with_backgrounds",
  },
  {
    collectionName: "components_global_textWithImageTwoCols",
    info: {
      displayName: "textWithImageTwoCols",
      icon: "address-book",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        required: false,
      },
      items: {
        displayName: "Items",
        type: "component",
        repeatable: true,
        component: "text-with-image-two-cols.items",
      },
    },
    __filename__: "textWithImageTwoCols.json",
    __schema__: {
      collectionName: "components_global_textWithImageTwoCols",
      info: {
        displayName: "textWithImageTwoCols",
        icon: "address-book",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          required: false,
        },
        items: {
          displayName: "Items",
          type: "component",
          repeatable: true,
          component: "text-with-image-two-cols.items",
        },
      },
      __filename__: "textWithImageTwoCols.json",
    },
    uid: "global.textwithimagetwocols",
    category: "global",
    modelType: "component",
    modelName: "textwithimagetwocols",
    globalId: "ComponentGlobalTextwithimagetwocols",
    singularName: "textwithimagetwocols",
    tableName: "components_global_textWithImageTwoCols",
  },
  {
    collectionName: "components_global_text_with_media",
    info: {
      displayName: "Text with Media",
      icon: "address-card",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
        required: true,
      },
      media: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      video: {
        displayName: "Video",
        type: "component",
        repeatable: false,
        component: "global.video",
      },
      subTitle: {
        type: "text",
      },
      description: {
        type: "richtext",
        required: true,
      },
      mediaToTheRight: {
        type: "boolean",
        default: false,
      },
      backgroundColor: {
        type: "enumeration",
        enum: [
          "white",
          "grey",
        ],
        default: "white",
        required: true,
      },
      cta: {
        displayName: "CTA",
        type: "component",
        repeatable: true,
        component: "global.ctas",
      },
    },
    __filename__: "textWithMedia.json",
    __schema__: {
      collectionName: "components_global_text_with_media",
      info: {
        displayName: "Text with Media",
        icon: "address-card",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
          required: true,
        },
        media: {
          type: "media",
          multiple: false,
          required: true,
          allowedTypes: [
            "images",
          ],
        },
        video: {
          displayName: "Video",
          type: "component",
          repeatable: false,
          component: "global.video",
        },
        subTitle: {
          type: "text",
        },
        description: {
          type: "richtext",
          required: true,
        },
        mediaToTheRight: {
          type: "boolean",
          default: false,
        },
        backgroundColor: {
          type: "enumeration",
          enum: [
            "white",
            "grey",
          ],
          default: "white",
          required: true,
        },
        cta: {
          displayName: "CTA",
          type: "component",
          repeatable: true,
          component: "global.ctas",
        },
      },
      __filename__: "textWithMedia.json",
    },
    uid: "global.textwithmedia",
    category: "global",
    modelType: "component",
    modelName: "textwithmedia",
    globalId: "ComponentGlobalTextwithmedia",
    singularName: "textwithmedia",
    tableName: "components_global_text_with_media",
  },
  {
    collectionName: "components_global_timelines",
    info: {
      displayName: "timeline",
      icon: "ad",
    },
    options: {
    },
    attributes: {
      topTitle: {
        type: "string",
        required: true,
      },
      title: {
        type: "string",
        required: true,
      },
      items: {
        displayName: "timelineItem",
        type: "component",
        repeatable: true,
        component: "timeline.timeline-item",
      },
    },
    __filename__: "timeline.json",
    __schema__: {
      collectionName: "components_global_timelines",
      info: {
        displayName: "timeline",
        icon: "ad",
      },
      options: {
      },
      attributes: {
        topTitle: {
          type: "string",
          required: true,
        },
        title: {
          type: "string",
          required: true,
        },
        items: {
          displayName: "timelineItem",
          type: "component",
          repeatable: true,
          component: "timeline.timeline-item",
        },
      },
      __filename__: "timeline.json",
    },
    uid: "global.timeline",
    category: "global",
    modelType: "component",
    modelName: "timeline",
    globalId: "ComponentGlobalTimeline",
    singularName: "timeline",
    tableName: "components_global_timelines",
  },
  {
    collectionName: "components_global_title_and_texts",
    info: {
      displayName: "titleAndText",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
      },
      text: {
        type: "richtext",
      },
    },
    __filename__: "title-and-text.json",
    __schema__: {
      collectionName: "components_global_title_and_texts",
      info: {
        displayName: "titleAndText",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
        },
        text: {
          type: "richtext",
        },
      },
      __filename__: "title-and-text.json",
    },
    uid: "global.title-and-text",
    category: "global",
    modelType: "component",
    modelName: "title-and-text",
    globalId: "ComponentGlobalTitleAndText",
    singularName: "title-and-text",
    tableName: "components_global_title_and_texts",
  },
  {
    collectionName: "components_global_videos",
    info: {
      displayName: "video",
      description: "",
    },
    options: {
    },
    attributes: {
      youtubeUrl: {
        type: "string",
      },
      bilibiliUrl: {
        type: "string",
      },
    },
    __filename__: "video.json",
    __schema__: {
      collectionName: "components_global_videos",
      info: {
        displayName: "video",
        description: "",
      },
      options: {
      },
      attributes: {
        youtubeUrl: {
          type: "string",
        },
        bilibiliUrl: {
          type: "string",
        },
      },
      __filename__: "video.json",
    },
    uid: "global.video",
    category: "global",
    modelType: "component",
    modelName: "video",
    globalId: "ComponentGlobalVideo",
    singularName: "video",
    tableName: "components_global_videos",
  },
  {
    collectionName: "components_gray_blocks_items",
    info: {
      displayName: "item",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
      },
      text: {
        type: "richtext",
      },
    },
    __filename__: "item.json",
    __schema__: {
      collectionName: "components_gray_blocks_items",
      info: {
        displayName: "item",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
        },
        text: {
          type: "richtext",
        },
      },
      __filename__: "item.json",
    },
    uid: "gray-blocks.item",
    category: "gray-blocks",
    modelType: "component",
    modelName: "item",
    globalId: "ComponentGrayBlocksItem",
    singularName: "item",
    tableName: "components_gray_blocks_items",
  },
  {
    collectionName: "components_hero_animated_text_values",
    info: {
      displayName: "animatedTextValues",
      icon: "align-justify",
    },
    options: {
    },
    attributes: {
      text: {
        type: "string",
      },
    },
    __filename__: "animated-text-items.json",
    __schema__: {
      collectionName: "components_hero_animated_text_values",
      info: {
        displayName: "animatedTextValues",
        icon: "align-justify",
      },
      options: {
      },
      attributes: {
        text: {
          type: "string",
        },
      },
      __filename__: "animated-text-items.json",
    },
    uid: "hero.animated-text-items",
    category: "hero",
    modelType: "component",
    modelName: "animated-text-items",
    globalId: "ComponentHeroAnimatedTextItems",
    singularName: "animated-text-items",
    tableName: "components_hero_animated_text_values",
  },
  {
    collectionName: "components_hero_animated_texts",
    info: {
      displayName: "animatedText",
      icon: "align-left",
      description: "",
    },
    options: {
    },
    attributes: {
      location: {
        type: "enumeration",
        enum: [
          "before",
          "after",
        ],
        default: "before",
        required: true,
      },
      items: {
        displayName: "Values",
        type: "component",
        repeatable: true,
        component: "hero.animated-text-items",
      },
    },
    __filename__: "animated-text.json",
    __schema__: {
      collectionName: "components_hero_animated_texts",
      info: {
        displayName: "animatedText",
        icon: "align-left",
        description: "",
      },
      options: {
      },
      attributes: {
        location: {
          type: "enumeration",
          enum: [
            "before",
            "after",
          ],
          default: "before",
          required: true,
        },
        items: {
          displayName: "Values",
          type: "component",
          repeatable: true,
          component: "hero.animated-text-items",
        },
      },
      __filename__: "animated-text.json",
    },
    uid: "hero.animated-text",
    category: "hero",
    modelType: "component",
    modelName: "animated-text",
    globalId: "ComponentHeroAnimatedText",
    singularName: "animated-text",
    tableName: "components_hero_animated_texts",
  },
  {
    collectionName: "components_global_key_number_and_descs",
    info: {
      displayName: "keyNumberAndDesc",
      description: "",
    },
    options: {
    },
    attributes: {
      headline: {
        type: "text",
        required: true,
      },
      text: {
        type: "text",
      },
    },
    __filename__: "key-number-and-desc.json",
    __schema__: {
      collectionName: "components_global_key_number_and_descs",
      info: {
        displayName: "keyNumberAndDesc",
        description: "",
      },
      options: {
      },
      attributes: {
        headline: {
          type: "text",
          required: true,
        },
        text: {
          type: "text",
        },
      },
      __filename__: "key-number-and-desc.json",
    },
    uid: "key-numbers.key-number-and-desc",
    category: "key-numbers",
    modelType: "component",
    modelName: "key-number-and-desc",
    globalId: "ComponentKeyNumbersKeyNumberAndDesc",
    singularName: "key-number-and-desc",
    tableName: "components_global_key_number_and_descs",
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
        required: true,
      },
      answer_asset: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      pick_answer: {
        type: "enumeration",
        enum: [
          "A",
          "B",
          "C",
          "D",
        ],
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
          required: true,
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
        pick_answer: {
          type: "enumeration",
          enum: [
            "A",
            "B",
            "C",
            "D",
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
      description: "",
    },
    options: {
    },
    attributes: {
      content: {
        type: "richtext",
        required: false,
      },
    },
    __filename__: "lecture.json",
    __schema__: {
      collectionName: "components_lesson_lectures",
      info: {
        displayName: "Lecture",
        icon: "align-left",
        description: "",
      },
      options: {
      },
      attributes: {
        content: {
          type: "richtext",
          required: false,
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
    collectionName: "components_logo_carousel_items",
    info: {
      displayName: "items",
      icon: "sliders-h",
      description: "",
    },
    options: {
    },
    attributes: {
      image: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      test: {
        type: "relation",
        relation: "morphMany",
        target: "plugin::upload.file",
        morphBy: "related",
      },
    },
    __filename__: "items.json",
    __schema__: {
      collectionName: "components_logo_carousel_items",
      info: {
        displayName: "items",
        icon: "sliders-h",
        description: "",
      },
      options: {
      },
      attributes: {
        image: {
          type: "media",
          multiple: false,
          required: true,
          allowedTypes: [
            "images",
          ],
        },
        test: {
          allowedTypes: [
            "images",
            "files",
            "videos",
            "audios",
          ],
          type: "media",
          multiple: true,
        },
      },
      __filename__: "items.json",
    },
    uid: "logo-carousel.items",
    category: "logo-carousel",
    modelType: "component",
    modelName: "items",
    globalId: "ComponentLogoCarouselItems",
    singularName: "items",
    tableName: "components_logo_carousel_items",
  },
  {
    collectionName: "components_menu_menu_items",
    info: {
      displayName: "menu item",
      description: "",
    },
    options: {
    },
    attributes: {
      name: {
        type: "string",
        required: true,
      },
      page: {
        type: "relation",
        relation: "oneToOne",
        target: "api::solution.solution",
      },
      isNested: {
        type: "boolean",
        default: false,
      },
      text: {
        type: "string",
      },
      externalLink: {
        type: "string",
      },
    },
    __filename__: "menu-item.json",
    __schema__: {
      collectionName: "components_menu_menu_items",
      info: {
        displayName: "menu item",
        description: "",
      },
      options: {
      },
      attributes: {
        name: {
          type: "string",
          required: true,
        },
        page: {
          type: "relation",
          relation: "oneToOne",
          target: "api::solution.solution",
        },
        isNested: {
          type: "boolean",
          default: false,
        },
        text: {
          type: "string",
        },
        externalLink: {
          type: "string",
        },
      },
      __filename__: "menu-item.json",
    },
    uid: "menu.menu-item",
    category: "menu",
    modelType: "component",
    modelName: "menu-item",
    globalId: "ComponentMenuMenuItem",
    singularName: "menu-item",
    tableName: "components_menu_menu_items",
  },
  {
    collectionName: "components_menu_mid_level_menu_sections",
    info: {
      displayName: "mid level menu section",
      description: "",
    },
    options: {
    },
    attributes: {
      name: {
        type: "string",
        required: true,
      },
      page: {
        type: "relation",
        relation: "oneToOne",
        target: "api::page.page",
      },
      items: {
        displayName: "menu item",
        type: "component",
        repeatable: true,
        component: "menu.menu-item",
        min: 1,
      },
    },
    __filename__: "mid-level-menu-section.json",
    __schema__: {
      collectionName: "components_menu_mid_level_menu_sections",
      info: {
        displayName: "mid level menu section",
        description: "",
      },
      options: {
      },
      attributes: {
        name: {
          type: "string",
          required: true,
        },
        page: {
          type: "relation",
          relation: "oneToOne",
          target: "api::page.page",
        },
        items: {
          displayName: "menu item",
          type: "component",
          repeatable: true,
          component: "menu.menu-item",
          min: 1,
        },
      },
      __filename__: "mid-level-menu-section.json",
    },
    uid: "menu.mid-level-menu-section",
    category: "menu",
    modelType: "component",
    modelName: "mid-level-menu-section",
    globalId: "ComponentMenuMidLevelMenuSection",
    singularName: "mid-level-menu-section",
    tableName: "components_menu_mid_level_menu_sections",
  },
  {
    collectionName: "components_menu_top_level_menu_sections",
    info: {
      displayName: "top level menu section",
      description: "",
    },
    options: {
    },
    attributes: {
      name: {
        type: "string",
        required: true,
      },
      nameInTopMenu: {
        type: "string",
        required: true,
      },
      items: {
        displayName: "mid level menu section",
        type: "component",
        repeatable: true,
        component: "menu.mid-level-menu-section",
      },
      page: {
        type: "relation",
        relation: "oneToOne",
        target: "api::page.page",
      },
    },
    __filename__: "top-level-menu-section.json",
    __schema__: {
      collectionName: "components_menu_top_level_menu_sections",
      info: {
        displayName: "top level menu section",
        description: "",
      },
      options: {
      },
      attributes: {
        name: {
          type: "string",
          required: true,
        },
        nameInTopMenu: {
          type: "string",
          required: true,
        },
        items: {
          displayName: "mid level menu section",
          type: "component",
          repeatable: true,
          component: "menu.mid-level-menu-section",
        },
        page: {
          type: "relation",
          relation: "oneToOne",
          target: "api::page.page",
        },
      },
      __filename__: "top-level-menu-section.json",
    },
    uid: "menu.top-level-menu-section",
    category: "menu",
    modelType: "component",
    modelName: "top-level-menu-section",
    globalId: "ComponentMenuTopLevelMenuSection",
    singularName: "top-level-menu-section",
    tableName: "components_menu_top_level_menu_sections",
  },
  {
    collectionName: "components_menu_top_menu_items",
    info: {
      displayName: "Top Menu Item",
      description: "",
    },
    options: {
    },
    attributes: {
      name: {
        type: "string",
        required: true,
      },
      url: {
        type: "string",
        required: true,
      },
      text: {
        type: "string",
      },
      isNested: {
        type: "boolean",
        default: false,
      },
    },
    __filename__: "top-menu-item.json",
    __schema__: {
      collectionName: "components_menu_top_menu_items",
      info: {
        displayName: "Top Menu Item",
        description: "",
      },
      options: {
      },
      attributes: {
        name: {
          type: "string",
          required: true,
        },
        url: {
          type: "string",
          required: true,
        },
        text: {
          type: "string",
        },
        isNested: {
          type: "boolean",
          default: false,
        },
      },
      __filename__: "top-menu-item.json",
    },
    uid: "menu.top-menu-item",
    category: "menu",
    modelType: "component",
    modelName: "top-menu-item",
    globalId: "ComponentMenuTopMenuItem",
    singularName: "top-menu-item",
    tableName: "components_menu_top_menu_items",
  },
  {
    collectionName: "components_menu_top_menu_top_sections",
    info: {
      displayName: "Top Menu - Top Section",
      description: "",
    },
    options: {
    },
    attributes: {
      items: {
        displayName: "Top Menu Item",
        type: "component",
        repeatable: true,
        component: "menu.top-menu-item",
      },
      nameInTopMenu: {
        type: "string",
        required: true,
      },
      name: {
        type: "string",
      },
      url: {
        type: "string",
      },
    },
    __filename__: "top-menu-top-section.json",
    __schema__: {
      collectionName: "components_menu_top_menu_top_sections",
      info: {
        displayName: "Top Menu - Top Section",
        description: "",
      },
      options: {
      },
      attributes: {
        items: {
          displayName: "Top Menu Item",
          type: "component",
          repeatable: true,
          component: "menu.top-menu-item",
        },
        nameInTopMenu: {
          type: "string",
          required: true,
        },
        name: {
          type: "string",
        },
        url: {
          type: "string",
        },
      },
      __filename__: "top-menu-top-section.json",
    },
    uid: "menu.top-menu-top-section",
    category: "menu",
    modelType: "component",
    modelName: "top-menu-top-section",
    globalId: "ComponentMenuTopMenuTopSection",
    singularName: "top-menu-top-section",
    tableName: "components_menu_top_menu_top_sections",
  },
  {
    collectionName: "components_page_related_solutions_items",
    info: {
      displayName: "relatedSolutionsItems",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
      },
      items: {
        type: "relation",
        relation: "oneToMany",
        target: "api::solution.solution",
      },
    },
    __filename__: "related-solutions-items.json",
    __schema__: {
      collectionName: "components_page_related_solutions_items",
      info: {
        displayName: "relatedSolutionsItems",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
        },
        items: {
          type: "relation",
          relation: "oneToMany",
          target: "api::solution.solution",
        },
      },
      __filename__: "related-solutions-items.json",
    },
    uid: "page.related-solutions-items",
    category: "page",
    modelType: "component",
    modelName: "related-solutions-items",
    globalId: "ComponentPageRelatedSolutionsItems",
    singularName: "related-solutions-items",
    tableName: "components_page_related_solutions_items",
  },
  {
    collectionName: "components_page_related_solutions",
    info: {
      displayName: "relatedSolutions",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        default: "Related solutions",
      },
      relatedSolutions: {
        displayName: "relatedSolutionsItems",
        type: "component",
        repeatable: false,
        component: "page.related-solutions-items",
      },
    },
    __filename__: "related-solutions.json",
    __schema__: {
      collectionName: "components_page_related_solutions",
      info: {
        displayName: "relatedSolutions",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          default: "Related solutions",
        },
        relatedSolutions: {
          displayName: "relatedSolutionsItems",
          type: "component",
          repeatable: false,
          component: "page.related-solutions-items",
        },
      },
      __filename__: "related-solutions.json",
    },
    uid: "page.related-solutions",
    category: "page",
    modelType: "component",
    modelName: "related-solutions",
    globalId: "ComponentPageRelatedSolutions",
    singularName: "related-solutions",
    tableName: "components_page_related_solutions",
  },
  {
    collectionName: "components_people_people_cards",
    info: {
      displayName: "peopleCard",
      description: "",
    },
    options: {
    },
    attributes: {
      profilePicture: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      joiningYear: {
        type: "integer",
      },
      firstname: {
        type: "string",
        required: false,
      },
      lastname: {
        type: "string",
        required: true,
      },
      jobTitle: {
        type: "string",
        required: true,
      },
      company: {
        type: "string",
      },
      socialMediaLink: {
        type: "string",
      },
    },
    __filename__: "people-card.json",
    __schema__: {
      collectionName: "components_people_people_cards",
      info: {
        displayName: "peopleCard",
        description: "",
      },
      options: {
      },
      attributes: {
        profilePicture: {
          type: "media",
          multiple: false,
          required: true,
          allowedTypes: [
            "images",
          ],
        },
        joiningYear: {
          type: "integer",
        },
        firstname: {
          type: "string",
          required: false,
        },
        lastname: {
          type: "string",
          required: true,
        },
        jobTitle: {
          type: "string",
          required: true,
        },
        company: {
          type: "string",
        },
        socialMediaLink: {
          type: "string",
        },
      },
      __filename__: "people-card.json",
    },
    uid: "people.people-card",
    category: "people",
    modelType: "component",
    modelName: "people-card",
    globalId: "ComponentPeoplePeopleCard",
    singularName: "people-card",
    tableName: "components_people_people_cards",
  },
  {
    collectionName: "components_related_solutions_related_solutions",
    info: {
      displayName: "relatedSolutions",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "text",
        required: true,
      },
      items: {
        type: "relation",
        relation: "oneToMany",
        target: "api::solution.solution",
      },
    },
    __filename__: "related-solutions.json",
    __schema__: {
      collectionName: "components_related_solutions_related_solutions",
      info: {
        displayName: "relatedSolutions",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "text",
          required: true,
        },
        items: {
          type: "relation",
          relation: "oneToMany",
          target: "api::solution.solution",
        },
      },
      __filename__: "related-solutions.json",
    },
    uid: "related-solutions.related-solutions",
    category: "related-solutions",
    modelType: "component",
    modelName: "related-solutions",
    globalId: "ComponentRelatedSolutionsRelatedSolutions",
    singularName: "related-solutions",
    tableName: "components_related_solutions_related_solutions",
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
  {
    collectionName: "components_seo_ogs",
    info: {
      displayName: "og",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      image: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      type: {
        type: "string",
      },
    },
    __filename__: "og.json",
    __schema__: {
      collectionName: "components_seo_ogs",
      info: {
        displayName: "og",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        image: {
          type: "media",
          multiple: false,
          required: false,
          allowedTypes: [
            "images",
          ],
        },
        type: {
          type: "string",
        },
      },
      __filename__: "og.json",
    },
    uid: "seo.og",
    category: "seo",
    modelType: "component",
    modelName: "og",
    globalId: "ComponentSeoOg",
    singularName: "og",
    tableName: "components_seo_ogs",
  },
  {
    collectionName: "components_seo_seos",
    info: {
      displayName: "seo",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        required: true,
      },
      description: {
        type: "text",
        required: true,
      },
      og: {
        displayName: "og",
        type: "component",
        repeatable: false,
        component: "seo.og",
      },
      canonical: {
        type: "string",
        regex: "^(?:(?:https?):\\/\\/)?(?:[\\w-]{2,}\\.?)+(?:\\/[^\\s]*)?$",
      },
      index: {
        type: "boolean",
        default: true,
        required: true,
      },
      follow: {
        type: "boolean",
        default: true,
        required: true,
      },
    },
    __filename__: "seo.json",
    __schema__: {
      collectionName: "components_seo_seos",
      info: {
        displayName: "seo",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          required: true,
        },
        description: {
          type: "text",
          required: true,
        },
        og: {
          displayName: "og",
          type: "component",
          repeatable: false,
          component: "seo.og",
        },
        canonical: {
          type: "string",
          regex: "^(?:(?:https?):\\/\\/)?(?:[\\w-]{2,}\\.?)+(?:\\/[^\\s]*)?$",
        },
        index: {
          type: "boolean",
          default: true,
          required: true,
        },
        follow: {
          type: "boolean",
          default: true,
          required: true,
        },
      },
      __filename__: "seo.json",
    },
    uid: "seo.seo",
    category: "seo",
    modelType: "component",
    modelName: "seo",
    globalId: "ComponentSeoSeo",
    singularName: "seo",
    tableName: "components_seo_seos",
  },
  {
    collectionName: "components_solution_benefits",
    info: {
      displayName: "Benefits",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        default: "Benefits",
        required: false,
      },
      textWithImageTwoCols: {
        type: "component",
        repeatable: false,
        component: "global.textwithimagetwocols",
        required: true,
      },
    },
    __filename__: "benefits.json",
    __schema__: {
      collectionName: "components_solution_benefits",
      info: {
        displayName: "Benefits",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          default: "Benefits",
          required: false,
        },
        textWithImageTwoCols: {
          type: "component",
          repeatable: false,
          component: "global.textwithimagetwocols",
          required: true,
        },
      },
      __filename__: "benefits.json",
    },
    uid: "solution.benefits",
    category: "solution",
    modelType: "component",
    modelName: "benefits",
    globalId: "ComponentSolutionBenefits",
    singularName: "benefits",
    tableName: "components_solution_benefits",
  },
  {
    collectionName: "components_solution_certifications",
    info: {
      displayName: "certification",
      icon: "ad",
    },
    options: {
    },
    attributes: {
      icon: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      title: {
        type: "string",
        required: true,
      },
    },
    __filename__: "certification.json",
    __schema__: {
      collectionName: "components_solution_certifications",
      info: {
        displayName: "certification",
        icon: "ad",
      },
      options: {
      },
      attributes: {
        icon: {
          allowedTypes: [
            "images",
          ],
          type: "media",
          multiple: false,
          required: true,
        },
        title: {
          type: "string",
          required: true,
        },
      },
      __filename__: "certification.json",
    },
    uid: "solution.certification",
    category: "solution",
    modelType: "component",
    modelName: "certification",
    globalId: "ComponentSolutionCertification",
    singularName: "certification",
    tableName: "components_solution_certifications",
  },
  {
    collectionName: "components_solution_demos",
    info: {
      displayName: "demo",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        required: false,
      },
      showForm: {
        type: "boolean",
        default: true,
        required: true,
      },
      text: {
        type: "richtext",
        required: true,
      },
    },
    __filename__: "demo.json",
    __schema__: {
      collectionName: "components_solution_demos",
      info: {
        displayName: "demo",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          required: false,
        },
        showForm: {
          type: "boolean",
          default: true,
          required: true,
        },
        text: {
          type: "richtext",
          required: true,
        },
      },
      __filename__: "demo.json",
    },
    uid: "solution.demo",
    category: "solution",
    modelType: "component",
    modelName: "demo",
    globalId: "ComponentSolutionDemo",
    singularName: "demo",
    tableName: "components_solution_demos",
  },
  {
    collectionName: "components_solution_faqs",
    info: {
      displayName: "faq",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        default: "FAQ",
        required: false,
      },
      items: {
        displayName: "faq",
        type: "component",
        repeatable: true,
        component: "global.faq",
      },
    },
    __filename__: "faq.json",
    __schema__: {
      collectionName: "components_solution_faqs",
      info: {
        displayName: "faq",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          default: "FAQ",
          required: false,
        },
        items: {
          displayName: "faq",
          type: "component",
          repeatable: true,
          component: "global.faq",
        },
      },
      __filename__: "faq.json",
    },
    uid: "solution.faq",
    category: "solution",
    modelType: "component",
    modelName: "faq",
    globalId: "ComponentSolutionFaq",
    singularName: "faq",
    tableName: "components_solution_faqs",
  },
  {
    collectionName: "components_solution_keyFeatures",
    info: {
      displayName: "Key Features",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        default: "Key features",
        required: false,
      },
      textWithMedia: {
        type: "component",
        repeatable: false,
        component: "global.textwithmedia",
        required: true,
      },
    },
    __filename__: "keyFeatures.json",
    __schema__: {
      collectionName: "components_solution_keyFeatures",
      info: {
        displayName: "Key Features",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          default: "Key features",
          required: false,
        },
        textWithMedia: {
          type: "component",
          repeatable: false,
          component: "global.textwithmedia",
          required: true,
        },
      },
      __filename__: "keyFeatures.json",
    },
    uid: "solution.keyfeatures",
    category: "solution",
    modelType: "component",
    modelName: "keyfeatures",
    globalId: "ComponentSolutionKeyfeatures",
    singularName: "keyfeatures",
    tableName: "components_solution_keyFeatures",
  },
  {
    collectionName: "components_solution_navigations",
    info: {
      displayName: "navigation",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      certifications: {
        displayName: "certification",
        type: "component",
        repeatable: true,
        component: "solution.certification",
      },
      demo: {
        type: "boolean",
        default: true,
        required: true,
      },
    },
    __filename__: "navigation.json",
    __schema__: {
      collectionName: "components_solution_navigations",
      info: {
        displayName: "navigation",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        certifications: {
          displayName: "certification",
          type: "component",
          repeatable: true,
          component: "solution.certification",
        },
        demo: {
          type: "boolean",
          default: true,
          required: true,
        },
      },
      __filename__: "navigation.json",
    },
    uid: "solution.navigation",
    category: "solution",
    modelType: "component",
    modelName: "navigation",
    globalId: "ComponentSolutionNavigation",
    singularName: "navigation",
    tableName: "components_solution_navigations",
  },
  {
    collectionName: "components_solution_overviews",
    info: {
      displayName: "overview",
      icon: "search",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        default: "Overview",
        required: false,
      },
      textWithMedia: {
        type: "component",
        repeatable: false,
        component: "global.textwithmedia",
        required: true,
      },
    },
    __filename__: "overview.json",
    __schema__: {
      collectionName: "components_solution_overviews",
      info: {
        displayName: "overview",
        icon: "search",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          default: "Overview",
          required: false,
        },
        textWithMedia: {
          type: "component",
          repeatable: false,
          component: "global.textwithmedia",
          required: true,
        },
      },
      __filename__: "overview.json",
    },
    uid: "solution.overview",
    category: "solution",
    modelType: "component",
    modelName: "overview",
    globalId: "ComponentSolutionOverview",
    singularName: "overview",
    tableName: "components_solution_overviews",
  },
  {
    collectionName: "components_solution_related_solutions_displays",
    info: {
      displayName: "relatedSolutionsDisplay",
      icon: "ad",
    },
    options: {
    },
    attributes: {
      icon: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      text: {
        type: "string",
        required: true,
      },
    },
    __filename__: "related-solutions-display.json",
    __schema__: {
      collectionName: "components_solution_related_solutions_displays",
      info: {
        displayName: "relatedSolutionsDisplay",
        icon: "ad",
      },
      options: {
      },
      attributes: {
        icon: {
          allowedTypes: [
            "images",
          ],
          type: "media",
          multiple: false,
          required: true,
        },
        text: {
          type: "string",
          required: true,
        },
      },
      __filename__: "related-solutions-display.json",
    },
    uid: "solution.related-solutions-display",
    category: "solution",
    modelType: "component",
    modelName: "related-solutions-display",
    globalId: "ComponentSolutionRelatedSolutionsDisplay",
    singularName: "related-solutions-display",
    tableName: "components_solution_related_solutions_displays",
  },
  {
    collectionName: "components_solution_resources",
    info: {
      displayName: "Resources",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        type: "string",
        default: "Resources",
        required: false,
      },
    },
    __filename__: "resources.json",
    __schema__: {
      collectionName: "components_solution_resources",
      info: {
        displayName: "Resources",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          type: "string",
          default: "Resources",
          required: false,
        },
      },
      __filename__: "resources.json",
    },
    uid: "solution.resources",
    category: "solution",
    modelType: "component",
    modelName: "resources",
    globalId: "ComponentSolutionResources",
    singularName: "resources",
    tableName: "components_solution_resources",
  },
  {
    collectionName: "components_state_of_art_items",
    info: {
      displayName: "Items",
      icon: "address-card",
      description: "",
    },
    options: {
    },
    attributes: {
      title: {
        displayName: "Title",
        type: "text",
        required: true,
      },
      text: {
        displayName: "Text",
        type: "text",
        required: true,
      },
      icon: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      cta: {
        displayName: "CTA",
        type: "component",
        repeatable: false,
        component: "global.ctas",
      },
    },
    __filename__: "items.json",
    __schema__: {
      collectionName: "components_state_of_art_items",
      info: {
        displayName: "Items",
        icon: "address-card",
        description: "",
      },
      options: {
      },
      attributes: {
        title: {
          displayName: "Title",
          type: "text",
          required: true,
        },
        text: {
          displayName: "Text",
          type: "text",
          required: true,
        },
        icon: {
          displayName: "Icon",
          allowedTypes: [
            "images",
          ],
          type: "media",
          multiple: false,
          required: true,
        },
        cta: {
          displayName: "CTA",
          type: "component",
          repeatable: false,
          component: "global.ctas",
        },
      },
      __filename__: "items.json",
    },
    uid: "state-of-art.items",
    category: "state-of-art",
    modelType: "component",
    modelName: "items",
    globalId: "ComponentStateOfArtItems",
    singularName: "items",
    tableName: "components_state_of_art_items",
  },
  {
    collectionName: "components_testimonial_people",
    info: {
      displayName: "person",
      icon: "address-book",
      description: "",
    },
    options: {
    },
    attributes: {
      name: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        required: false,
      },
      company: {
        type: "string",
        required: false,
      },
      image: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
    },
    __filename__: "person.json",
    __schema__: {
      collectionName: "components_testimonial_people",
      info: {
        displayName: "person",
        icon: "address-book",
        description: "",
      },
      options: {
      },
      attributes: {
        name: {
          type: "string",
          required: true,
        },
        role: {
          type: "string",
          required: false,
        },
        company: {
          type: "string",
          required: false,
        },
        image: {
          type: "media",
          multiple: false,
          required: true,
          allowedTypes: [
            "images",
          ],
        },
      },
      __filename__: "person.json",
    },
    uid: "testimonial.person",
    category: "testimonial",
    modelType: "component",
    modelName: "person",
    globalId: "ComponentTestimonialPerson",
    singularName: "person",
    tableName: "components_testimonial_people",
  },
  {
    collectionName: "components_text_with_image_two_cols_items",
    info: {
      displayName: "items",
      icon: "ad",
      description: "",
    },
    options: {
    },
    attributes: {
      image: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      title: {
        type: "string",
        required: true,
      },
      text: {
        type: "richtext",
        required: true,
      },
      imagePosition: {
        type: "enumeration",
        enum: [
          "left",
          "right",
        ],
        default: "left",
      },
    },
    __filename__: "items.json",
    __schema__: {
      collectionName: "components_text_with_image_two_cols_items",
      info: {
        displayName: "items",
        icon: "ad",
        description: "",
      },
      options: {
      },
      attributes: {
        image: {
          type: "media",
          multiple: false,
          required: true,
          allowedTypes: [
            "images",
          ],
        },
        title: {
          type: "string",
          required: true,
        },
        text: {
          type: "richtext",
          required: true,
        },
        imagePosition: {
          type: "enumeration",
          enum: [
            "left",
            "right",
          ],
          default: "left",
        },
      },
      __filename__: "items.json",
    },
    uid: "text-with-image-two-cols.items",
    category: "text-with-image-two-cols",
    modelType: "component",
    modelName: "items",
    globalId: "ComponentTextWithImageTwoColsItems",
    singularName: "items",
    tableName: "components_text_with_image_two_cols_items",
  },
  {
    collectionName: "components_timeline_timeline_items",
    info: {
      displayName: "timelineItem",
      icon: "ad",
    },
    options: {
    },
    attributes: {
      image: {
        type: "relation",
        relation: "morphOne",
        target: "plugin::upload.file",
        morphBy: "related",
      },
      title: {
        type: "string",
        required: true,
      },
      text: {
        type: "richtext",
        required: true,
      },
    },
    __filename__: "timeline-item.json",
    __schema__: {
      collectionName: "components_timeline_timeline_items",
      info: {
        displayName: "timelineItem",
        icon: "ad",
      },
      options: {
      },
      attributes: {
        image: {
          allowedTypes: [
            "images",
          ],
          type: "media",
          multiple: false,
          required: true,
        },
        title: {
          type: "string",
          required: true,
        },
        text: {
          type: "richtext",
          required: true,
        },
      },
      __filename__: "timeline-item.json",
    },
    uid: "timeline.timeline-item",
    category: "timeline",
    modelType: "component",
    modelName: "timeline-item",
    globalId: "ComponentTimelineTimelineItem",
    singularName: "timeline-item",
    tableName: "components_timeline_timeline_items",
  },
];
