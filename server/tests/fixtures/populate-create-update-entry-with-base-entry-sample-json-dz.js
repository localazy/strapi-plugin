"use strict";

const updateEntry = {
  id: 24,
  purpose: "Bar",
  data: {
    bar: "baz",
  },
  dynamic_property: [
    {
      id: 170,
      image_title: "Nějaký název obrázku",
      image_description: "Nějaký popis obrázku",
      image: {
        id: 11,
        name: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
        alternativeText: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
        caption: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
        width: 6127,
        height: 3844,
        formats: {
          thumbnail: {
            name: "thumbnail_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "thumbnail_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 245,
            height: 154,
            size: 9.54,
            url: "/uploads/thumbnail_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
          large: {
            name: "large_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "large_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 1000,
            height: 628,
            size: 117.56,
            url: "/uploads/large_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
          medium: {
            name: "medium_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "medium_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 750,
            height: 471,
            size: 66.32,
            url: "/uploads/medium_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
          small: {
            name: "small_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "small_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 500,
            height: 314,
            size: 31.42,
            url: "/uploads/small_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
        },
        hash: "heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
        ext: ".jpg",
        mime: "image/jpeg",
        size: 6971.47,
        url: "/uploads/heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
        previewUrl: null,
        provider: "local",
        provider_metadata: null,
      },
      __component: "food.gallery-item",
    },
    {
      id: 191,
      name: "Přísada I",
      amount: null,
      unit: null,
      is_required: true,
      __component: "food.recipe-ingredient",
    },
    {
      id: 36,
      name: "První položka CB",
      recipe: null,
      estimated_cook_time: "00:03:00.000",
      difficulty: "beginner",
      author_name: "Já",
      gallery: [
        {
          id: 171,
          image_title: "Obrázek G Jedna",
          image_description: "Obrázek G Popis Jedna",
        },
        {
          id: 172,
          image_title: "Img G Two",
          image_description: "Img G Desc Two",
        },
      ],
      ingredients: [
        {
          id: 193,
          name: "První Ingr DZ",
          amount: null,
          unit: null,
          is_required: true,
        },
      ],
      __component: "food.cookbook-item",
    },
    {
      id: 192,
      name: "Druhá přísada",
      amount: null,
      unit: null,
      is_required: true,
      __component: "food.recipe-ingredient",
    },
  ],
  repeatable_component_property: [
    {
      id: 61,
      name: "Položka 1",
      price: 1,
      currency: "CZK",
      description: "Nějaký popis",
      is_available: null,
      food_gallery: null,
    },
    {
      id: 62,
      name: "Položka 2",
      price: 2,
      currency: "CZK",
      description: "Nějaký další popis",
      is_available: null,
      food_gallery: [
        {
          id: 6,
          name: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
          alternativeText: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
          caption: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
          width: 2268,
          height: 4032,
          formats: {
            thumbnail: {
              name: "thumbnail_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "thumbnail_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 88,
              height: 156,
              size: 5.35,
              url: "/uploads/thumbnail_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
            large: {
              name: "large_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "large_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 563,
              height: 1000,
              size: 108.15,
              url: "/uploads/large_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
            medium: {
              name: "medium_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "medium_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 422,
              height: 750,
              size: 65.52,
              url: "/uploads/medium_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
            small: {
              name: "small_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "small_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 281,
              height: 500,
              size: 34.23,
              url: "/uploads/small_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
          },
          hash: "rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
          ext: ".jpg",
          mime: "image/jpeg",
          size: 1081.59,
          url: "/uploads/rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
        },
      ],
    },
  ],
};

// filtered baseEntry
const baseEntry = {
  id: 2,
  purpose: "Bar",
  data: {
    bar: "baz",
  },
  dynamic_property: [
    {
      __component: "food.gallery-item",
      id: 159,
      image_title: "Some image title",
      image_description: "Some image description",
      image: {
        id: 11,
        name: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
        alternativeText: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
        caption: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
        width: 6127,
        height: 3844,
        formats: {
          thumbnail: {
            name: "thumbnail_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "thumbnail_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 245,
            height: 154,
            size: 9.54,
            url: "/uploads/thumbnail_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
          large: {
            name: "large_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "large_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 1000,
            height: 628,
            size: 117.56,
            url: "/uploads/large_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
          medium: {
            name: "medium_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "medium_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 750,
            height: 471,
            size: 66.32,
            url: "/uploads/medium_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
          small: {
            name: "small_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "small_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 500,
            height: 314,
            size: 31.42,
            url: "/uploads/small_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
        },
        hash: "heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
        ext: ".jpg",
        mime: "image/jpeg",
        size: 6971.47,
        url: "/uploads/heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
        previewUrl: null,
        provider: "local",
        provider_metadata: null,
      },
    },
    {
      __component: "food.recipe-ingredient",
      id: 176,
      name: "Ingredient I",
      amount: null,
      unit: null,
      is_required: true,
    },
    {
      __component: "food.cookbook-item",
      id: 31,
      name: "First CB item",
      recipe: null,
      estimated_cook_time: "00:03:00.000",
      difficulty: "beginner",
      author_name: "Me",
      gallery: [
        {
          id: 163,
          image_title: "Img G One",
          image_description: "Img G Desc One",
          image: {
            id: 4,
            name: "ting-tian-al9eh9QkdPA-unsplash.jpg",
            alternativeText: "ting-tian-al9eh9QkdPA-unsplash.jpg",
            caption: "ting-tian-al9eh9QkdPA-unsplash.jpg",
            width: 3840,
            height: 5760,
            formats: {
              thumbnail: {
                name: "thumbnail_ting-tian-al9eh9QkdPA-unsplash.jpg",
                hash: "thumbnail_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 104,
                height: 156,
                size: 6.06,
                url: "/uploads/thumbnail_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
              },
              large: {
                name: "large_ting-tian-al9eh9QkdPA-unsplash.jpg",
                hash: "large_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 667,
                height: 1000,
                size: 202.98,
                url: "/uploads/large_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
              },
              medium: {
                name: "medium_ting-tian-al9eh9QkdPA-unsplash.jpg",
                hash: "medium_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 500,
                height: 750,
                size: 120.06,
                url: "/uploads/medium_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
              },
              small: {
                name: "small_ting-tian-al9eh9QkdPA-unsplash.jpg",
                hash: "small_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 333,
                height: 500,
                size: 54.32,
                url: "/uploads/small_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
              },
            },
            hash: "ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
            ext: ".jpg",
            mime: "image/jpeg",
            size: 5952.03,
            url: "/uploads/ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
            previewUrl: null,
            provider: "local",
            provider_metadata: null,
          },
        },
        {
          id: 164,
          image_title: "Img G Two",
          image_description: "Img G Desc Two",
          image: {
            id: 12,
            name: "rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
            alternativeText: "rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
            caption: "rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
            width: 2839,
            height: 3785,
            formats: {
              thumbnail: {
                name: "thumbnail_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "thumbnail_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 117,
                height: 156,
                size: 5.26,
                url: "/uploads/thumbnail_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
              large: {
                name: "large_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "large_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 750,
                height: 1000,
                size: 114.8,
                url: "/uploads/large_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
              medium: {
                name: "medium_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "medium_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 562,
                height: 750,
                size: 69.07,
                url: "/uploads/medium_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
              small: {
                name: "small_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "small_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 375,
                height: 500,
                size: 35.47,
                url: "/uploads/small_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
            },
            hash: "rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
            ext: ".jpg",
            mime: "image/jpeg",
            size: 1736.7,
            url: "/uploads/rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
            previewUrl: null,
            provider: "local",
            provider_metadata: null,
          },
        },
      ],
      ingredients: [
        {
          id: 178,
          name: "First ingr DZ",
          amount: null,
          unit: null,
          is_required: true,
        },
      ],
    },
    {
      __component: "food.recipe-ingredient",
      id: 177,
      name: "Ingredient Two",
      amount: null,
      unit: null,
      is_required: true,
    },
  ],
  repeatable_component_property: [
    {
      id: 55,
      name: "Item 1",
      price: 1,
      currency: "CZK",
      description: "Some desc",
      is_available: null,
      food_gallery: null,
    },
    {
      id: 56,
      name: "Item 2",
      price: 2,
      currency: "CZK",
      description: "Some other desc",
      is_available: null,
      food_gallery: [
        {
          id: 6,
          name: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
          alternativeText: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
          caption: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
          width: 2268,
          height: 4032,
          formats: {
            thumbnail: {
              name: "thumbnail_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "thumbnail_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 88,
              height: 156,
              size: 5.35,
              url: "/uploads/thumbnail_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
            large: {
              name: "large_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "large_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 563,
              height: 1000,
              size: 108.15,
              url: "/uploads/large_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
            medium: {
              name: "medium_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "medium_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 422,
              height: 750,
              size: 65.52,
              url: "/uploads/medium_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
            small: {
              name: "small_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "small_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 281,
              height: 500,
              size: 34.23,
              url: "/uploads/small_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
          },
          hash: "rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
          ext: ".jpg",
          mime: "image/jpeg",
          size: 1081.59,
          url: "/uploads/rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
        },
      ],
    },
  ],
};

// filtered fullyPopulatedLocalizedEntry
const fullyPopulatedLocalizedEntry = {
  id: 24,
  purpose: "Bar",
  data: {
    bar: "baz",
  },
  dynamic_property: [
    {
      __component: "food.gallery-item",
      id: 170,
      image_title: "Nějaký název obrázku",
      image_description: "Nějaký popis obrázku",
      image: {
        id: 11,
        name: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
        alternativeText: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
        caption: "heather-ford-G4LFhuLXhLE-unsplash.jpg",
        width: 6127,
        height: 3844,
        formats: {
          thumbnail: {
            name: "thumbnail_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "thumbnail_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 245,
            height: 154,
            size: 9.54,
            url: "/uploads/thumbnail_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
          large: {
            name: "large_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "large_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 1000,
            height: 628,
            size: 117.56,
            url: "/uploads/large_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
          medium: {
            name: "medium_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "medium_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 750,
            height: 471,
            size: 66.32,
            url: "/uploads/medium_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
          small: {
            name: "small_heather-ford-G4LFhuLXhLE-unsplash.jpg",
            hash: "small_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
            ext: ".jpg",
            mime: "image/jpeg",
            path: null,
            width: 500,
            height: 314,
            size: 31.42,
            url: "/uploads/small_heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
          },
        },
        hash: "heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f",
        ext: ".jpg",
        mime: "image/jpeg",
        size: 6971.47,
        url: "/uploads/heather_ford_G4_L_Fhu_L_Xh_LE_unsplash_7a2c2cac8f.jpg",
        previewUrl: null,
        provider: "local",
        provider_metadata: null,
      },
    },
    {
      __component: "food.recipe-ingredient",
      id: 191,
      name: "Přísada I",
      amount: null,
      unit: null,
      is_required: true,
    },
    {
      __component: "food.cookbook-item",
      id: 36,
      name: "První položka CB",
      recipe: null,
      estimated_cook_time: "00:03:00.000",
      difficulty: "beginner",
      author_name: "Já",
      gallery: [
        {
          id: 171,
          image_title: "Obrázek G Jedna",
          image_description: "Obrázek G Popis Jedna",
          image: {
            id: 4,
            name: "ting-tian-al9eh9QkdPA-unsplash.jpg",
            alternativeText: "ting-tian-al9eh9QkdPA-unsplash.jpg",
            caption: "ting-tian-al9eh9QkdPA-unsplash.jpg",
            width: 3840,
            height: 5760,
            formats: {
              thumbnail: {
                name: "thumbnail_ting-tian-al9eh9QkdPA-unsplash.jpg",
                hash: "thumbnail_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 104,
                height: 156,
                size: 6.06,
                url: "/uploads/thumbnail_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
              },
              large: {
                name: "large_ting-tian-al9eh9QkdPA-unsplash.jpg",
                hash: "large_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 667,
                height: 1000,
                size: 202.98,
                url: "/uploads/large_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
              },
              medium: {
                name: "medium_ting-tian-al9eh9QkdPA-unsplash.jpg",
                hash: "medium_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 500,
                height: 750,
                size: 120.06,
                url: "/uploads/medium_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
              },
              small: {
                name: "small_ting-tian-al9eh9QkdPA-unsplash.jpg",
                hash: "small_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 333,
                height: 500,
                size: 54.32,
                url: "/uploads/small_ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
              },
            },
            hash: "ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85",
            ext: ".jpg",
            mime: "image/jpeg",
            size: 5952.03,
            url: "/uploads/ting_tian_al9eh9_Qkd_PA_unsplash_d5132e8a85.jpg",
            previewUrl: null,
            provider: "local",
            provider_metadata: null,
          },
        },
        {
          id: 172,
          image_title: "Img G Two",
          image_description: "Img G Desc Two",
          image: {
            id: 12,
            name: "rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
            alternativeText: "rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
            caption: "rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
            width: 2839,
            height: 3785,
            formats: {
              thumbnail: {
                name: "thumbnail_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "thumbnail_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 117,
                height: 156,
                size: 5.26,
                url: "/uploads/thumbnail_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
              large: {
                name: "large_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "large_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 750,
                height: 1000,
                size: 114.8,
                url: "/uploads/large_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
              medium: {
                name: "medium_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "medium_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 562,
                height: 750,
                size: 69.07,
                url: "/uploads/medium_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
              small: {
                name: "small_rishabh-modi-ubEMIKHv9Jk-unsplash.jpg",
                hash: "small_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
                ext: ".jpg",
                mime: "image/jpeg",
                path: null,
                width: 375,
                height: 500,
                size: 35.47,
                url: "/uploads/small_rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
              },
            },
            hash: "rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28",
            ext: ".jpg",
            mime: "image/jpeg",
            size: 1736.7,
            url: "/uploads/rishabh_modi_ub_EMIK_Hv9_Jk_unsplash_68bba86c28.jpg",
            previewUrl: null,
            provider: "local",
            provider_metadata: null,
          },
        },
      ],
      ingredients: [
        {
          id: 193,
          name: "První Ingr DZ",
          amount: null,
          unit: null,
          is_required: true,
        },
      ],
    },
    {
      __component: "food.recipe-ingredient",
      id: 192,
      name: "Druhá přísada",
      amount: null,
      unit: null,
      is_required: true,
    },
  ],
  repeatable_component_property: [
    {
      id: 61,
      name: "Položka 1",
      price: 1,
      currency: "CZK",
      description: "Nějaký popis",
      is_available: null,
      food_gallery: null,
    },
    {
      id: 62,
      name: "Položka 2",
      price: 2,
      currency: "CZK",
      description: "Nějaký další popis",
      is_available: null,
      food_gallery: [
        {
          id: 6,
          name: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
          alternativeText: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
          caption: "rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
          width: 2268,
          height: 4032,
          formats: {
            thumbnail: {
              name: "thumbnail_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "thumbnail_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 88,
              height: 156,
              size: 5.35,
              url: "/uploads/thumbnail_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
            large: {
              name: "large_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "large_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 563,
              height: 1000,
              size: 108.15,
              url: "/uploads/large_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
            medium: {
              name: "medium_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "medium_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 422,
              height: 750,
              size: 65.52,
              url: "/uploads/medium_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
            small: {
              name: "small_rodrigo-dos-reis-h3AkzboxK4Q-unsplash.jpg",
              hash: "small_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
              ext: ".jpg",
              mime: "image/jpeg",
              path: null,
              width: 281,
              height: 500,
              size: 34.23,
              url: "/uploads/small_rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
            },
          },
          hash: "rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea",
          ext: ".jpg",
          mime: "image/jpeg",
          size: 1081.59,
          url: "/uploads/rodrigo_dos_reis_h3_Akzbox_K4_Q_unsplash_d17e795cea.jpg",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
        },
      ],
    },
  ],
};

const uid = "api::sample-json.sample-json";

const locale = "cs";

module.exports = {
  updateEntry,
  baseEntry,
  fullyPopulatedLocalizedEntry,
  uid,
  locale,
}