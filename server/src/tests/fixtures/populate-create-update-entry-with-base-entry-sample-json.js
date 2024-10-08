"use strict";

const updateEntry = {
  id: 17,
  purpose: "Foo CZ",
  data: {
    foo: "bar",
    bar: {
      foo: "baz",
    },
  },
};

const baseEntry = {
  id: 1,
  purpose: "Foo",
  data: {
    foo: "bar",
    bar: {
      foo: "baz",
    },
  },
};

const fullyPopulatedLocalizedEntry = {
  id: 17,
  purpose: "Foo CZ",
  data: {
    foo: "bar",
    bar: {
      foo: "baz",
    },
  },
};

const uid = "api::sample-json.sample-json";

const locale = "cs";

module.exports = {
  updateEntry,
  baseEntry,
  fullyPopulatedLocalizedEntry,
  uid,
  locale,
};
