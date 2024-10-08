"use strict";

const updateEntry = {
  id: 4,
  title: "Test: Sčítání",
  start_time: "2022-10-01T13:00:00.000Z",
  duration: "02:00:00.000",
  description: "Otestujte si své dovednosti, které jsme se naučili v předchozí lekci.",
  lesson_type: [
    {
      id: 2,
      title: "Vyberte správnou odpověď",
      questions: [
        {
          id: 4,
          question: "1 + 1 = ",
          is_active: true,
          question_number: 1,
        },
        {
          id: 5,
          question: "5 + 15 = ",
          is_active: false,
          question_number: 2,
        },
        {
          id: 6,
          question: "Kolik pohárů je na fotce?",
          is_active: false,
          question_number: 3,
        },
      ],
      answers: [
        {
          id: 4,
          question_number: 1,
          correct_answer: "2",
        },
        {
          id: 5,
          question_number: 2,
          correct_answer: "20",
        },
        {
          id: 6,
          question_number: 3,
          correct_answer: "15",
        },
      ],
      __component: "lesson.quiz",
    },
  ],
};

// filtered baseEntry
const baseEntry = {
  id: 2,
  title: "Test: Addition",
  start_time: "2022-10-01T13:00:00.000Z",
  duration: "02:00:00.000",
  description: "Test your skills we've learnt in the previous lesson.",
  lesson_type: [
    {
      __component: "lesson.quiz",
      id: 1,
      title: "Choose the correct answer",
      questions: [
        {
          id: 1,
          question: "1 + 1 = ",
          is_active: true,
          question_number: 1,
          assets: null,
        },
        {
          id: 2,
          question: "5 + 15 = ",
          is_active: false,
          question_number: 2,
          assets: null,
        },
        {
          id: 3,
          question: "How many cups are on the photo?",
          is_active: false,
          question_number: 3,
          assets: [
            {
              id: 13,
              name: "lidya-nada-BnzqQwerUOY-unsplash.jpg",
              alternativeText: "lidya-nada-BnzqQwerUOY-unsplash.jpg",
              caption: "lidya-nada-BnzqQwerUOY-unsplash.jpg",
              width: 3360,
              height: 5040,
              formats: {
                thumbnail: {
                  name: "thumbnail_lidya-nada-BnzqQwerUOY-unsplash.jpg",
                  hash: "thumbnail_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 104,
                  height: 156,
                  size: 2.59,
                  url: "/uploads/thumbnail_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12.jpg",
                },
                large: {
                  name: "large_lidya-nada-BnzqQwerUOY-unsplash.jpg",
                  hash: "large_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 667,
                  height: 1000,
                  size: 38.91,
                  url: "/uploads/large_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12.jpg",
                },
                medium: {
                  name: "medium_lidya-nada-BnzqQwerUOY-unsplash.jpg",
                  hash: "medium_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 500,
                  height: 750,
                  size: 24.62,
                  url: "/uploads/medium_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12.jpg",
                },
                small: {
                  name: "small_lidya-nada-BnzqQwerUOY-unsplash.jpg",
                  hash: "small_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 333,
                  height: 500,
                  size: 12.98,
                  url: "/uploads/small_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12.jpg",
                },
              },
              hash: "lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12",
              ext: ".jpg",
              mime: "image/jpeg",
              size: 1536.82,
              url: "/uploads/lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12.jpg",
              previewUrl: null,
              provider: "local",
              provider_metadata: null,
            },
          ],
        },
      ],
      answers: [
        {
          id: 1,
          question_number: 1,
          correct_answer: "2",
          answer_asset: null,
        },
        {
          id: 2,
          question_number: 2,
          correct_answer: "20",
          answer_asset: null,
        },
        {
          id: 3,
          question_number: 3,
          correct_answer: "15",
          answer_asset: null,
        },
      ],
    },
  ],
};

// filtered fullyPopulatedLocalizedEntry
const fullyPopulatedLocalizedEntry = {
  id: 4,
  title: "Test: Sčítání",
  start_time: "2022-10-01T13:00:00.000Z",
  duration: "02:00:00.000",
  description: "Otestujte si své dovednosti, které jsme se naučili v předchozí lekci.",
  lesson_type: [
    {
      __component: "lesson.quiz",
      id: 2,
      title: "Vyberte správnou odpověď",
      questions: [
        {
          id: 4,
          question: "1 + 1 = ",
          is_active: true,
          question_number: 1,
          assets: null,
        },
        {
          id: 5,
          question: "5 + 15 = ",
          is_active: false,
          question_number: 2,
          assets: null,
        },
        {
          id: 6,
          question: "Kolik pohárů je na fotce?",
          is_active: false,
          question_number: 3,
          assets: [
            {
              id: 13,
              name: "lidya-nada-BnzqQwerUOY-unsplash.jpg",
              alternativeText: "lidya-nada-BnzqQwerUOY-unsplash.jpg",
              caption: "lidya-nada-BnzqQwerUOY-unsplash.jpg",
              width: 3360,
              height: 5040,
              formats: {
                thumbnail: {
                  name: "thumbnail_lidya-nada-BnzqQwerUOY-unsplash.jpg",
                  hash: "thumbnail_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 104,
                  height: 156,
                  size: 2.59,
                  url: "/uploads/thumbnail_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12.jpg",
                },
                large: {
                  name: "large_lidya-nada-BnzqQwerUOY-unsplash.jpg",
                  hash: "large_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 667,
                  height: 1000,
                  size: 38.91,
                  url: "/uploads/large_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12.jpg",
                },
                medium: {
                  name: "medium_lidya-nada-BnzqQwerUOY-unsplash.jpg",
                  hash: "medium_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 500,
                  height: 750,
                  size: 24.62,
                  url: "/uploads/medium_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12.jpg",
                },
                small: {
                  name: "small_lidya-nada-BnzqQwerUOY-unsplash.jpg",
                  hash: "small_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 333,
                  height: 500,
                  size: 12.98,
                  url: "/uploads/small_lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12.jpg",
                },
              },
              hash: "lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12",
              ext: ".jpg",
              mime: "image/jpeg",
              size: 1536.82,
              url: "/uploads/lidya_nada_Bnzq_Qwer_UOY_unsplash_1c85b31b12.jpg",
              previewUrl: null,
              provider: "local",
              provider_metadata: null,
            },
          ],
        },
      ],
      answers: [
        {
          id: 4,
          question_number: 1,
          correct_answer: "2",
          answer_asset: null,
        },
        {
          id: 5,
          question_number: 2,
          correct_answer: "20",
          answer_asset: null,
        },
        {
          id: 6,
          question_number: 3,
          correct_answer: "15",
          answer_asset: null,
        },
      ],
    },
  ],
};

const uid = "api::lesson.lesson";

const locale = "cs";

module.exports = {
  updateEntry,
  baseEntry,
  fullyPopulatedLocalizedEntry,
  uid,
  locale,
}
