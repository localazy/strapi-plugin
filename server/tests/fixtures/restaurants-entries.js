module.exports = [
  {
    id: 1,
    title: "Restaurant 1",
    description: "Restaurant 1 description",
    createdAt: "2022-03-10T14:45:51.764Z",
    updatedAt: "2022-04-07T18:34:34.132Z",
    publishedAt: "2022-03-23T11:57:05.812Z",
    locale: "en",
    street: null,
    city: null,
    country: null,
    recipes: [
      {
        id: 1,
        name: null,
        ingredients: [
          {
            id: 1,
            name: null,
            pcs: null,
            required: null,
          },
        ],
        variants: {
          id: 1,
          name: null,
        },
      },
    ],
    descs: {
      id: 1,
      rich_description: "restaurant 1 rich_desc",
      history: null,
      excerpt: null,
      test_variants: {
        id: 2,
        name: null,
      },
    },
  },
  {
    id: 2,
    title: "Restaurant 2",
    description: "Restaurant 2 description",
    createdAt: "2022-03-14T10:35:27.187Z",
    updatedAt: "2022-04-07T18:34:34.154Z",
    publishedAt: "2022-03-24T13:32:31.066Z",
    locale: "en",
    street: null,
    city: null,
    country: null,
    recipes: [],
    descs: null,
  },
  {
    id: 3,
    title: "Full Restaurant",
    description: "With some great description",
    createdAt: "2022-03-24T13:17:22.161Z",
    updatedAt: "2022-04-07T18:34:34.168Z",
    publishedAt: "2022-03-24T13:37:31.870Z",
    locale: "en",
    street: "Testowa",
    city: "Testow",
    country: "Test Rep.",
    recipes: [
      {
        id: 3,
        name: "Tomato Soup",
        ingredients: [
          {
            id: 2,
            name: "Tomato",
            pcs: 4,
            required: false,
          },
          {
            id: 3,
            name: "Soup",
            pcs: 1,
            required: true,
          },
        ],
        variants: {
          id: 4,
          name: "Red, yellow, green",
        },
      },
      {
        id: 2,
        name: "Beef Broth",
        ingredients: [
          {
            id: 4,
            name: "Beef",
            pcs: 1,
            required: true,
          },
          {
            id: 5,
            name: "Water",
            pcs: 2,
            required: true,
          },
        ],
        variants: null,
      },
      {
        id: 4,
        name: "Goulash",
        ingredients: [
          {
            id: 6,
            name: "Beef meat",
            pcs: 1,
            required: true,
          },
          {
            id: 7,
            name: "Pepper",
            pcs: 4,
            required: null,
          },
          {
            id: 8,
            name: "Pepper spices",
            pcs: 1,
            required: true,
          },
          {
            id: 9,
            name: "Water",
            pcs: 1,
            required: null,
          },
        ],
        variants: null,
      },
    ],
    descs: {
      id: 3,
      rich_description: "Another restaurant desc",
      history: "Est. 2022, based in NY, NY",
      excerpt: "Est. 2022",
      test_variants: {
        id: 5,
        name: "no such thing...",
      },
    },
  },
];
