"use strict";

const KEY = "identity";

const emptyIdentity = {
  accessToken: "",
  project: {
    id: "",
    image: "",
    name: "",
    url: "",
  },
  scope: "",
  user: {
    id: "",
    name: "",
  },
};

module.exports = {
  KEY,
  emptyIdentity,
};
