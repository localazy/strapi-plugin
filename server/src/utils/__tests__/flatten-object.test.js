"use strict";

const flattenObject = require("../flatten-object");

it("should filter out null and undefined values", () => {
  // SETUP
  const object = {
    restaurant: null,
    somethingElse: undefined,
    somethingSomethingElse: false,
  };

  // EXECUTE
  const result = flattenObject(object);

  // VERIFY
  const expected = { somethingSomethingElse: false };
  expect(result).toEqual(expected);
});

it("should return the same object if it's already flat", () => {
  // SETUP
  const object = {
    restaurant: {
      id: 2,
      foo: "bar",
      baz: "qux",
    },
  };

  // EXECUTE
  const result = flattenObject(object);

  // VERIFY
  const expected = {
    "restaurant[2].foo": "bar",
    "restaurant[2].baz": "qux",
  };
  expect(result).toEqual(expected);
});

it("should use the index of the array if there is no id", () => {
  // SETUP
  const object = {
    restaurant: [{ foo: "bar" }, { baz: "qux" }],
  };

  // EXECUTE
  const result = flattenObject(object);

  // VERIFY
  const expected = {
    "restaurant[0].foo": "bar",
    "restaurant[1].baz": "qux",
  };
  expect(result).toEqual(expected);
});

it("should work with a basic array", () => {
  // SETUP
  const object = {
    restaurant: [
      {
        id: 1,
        arrayFoo1: "arrayBar1",
        arrayBaz1: "arrayFaz1",
      },
      {
        id: 2,
        arrayFoo2: "arrayBar2",
      },
    ],
  };

  // EXECUTE
  const result = flattenObject(object);

  // VERIFY
  const expected = {
    "restaurant[1].arrayFoo1": "arrayBar1",
    "restaurant[1].arrayBaz1": "arrayFaz1",
    "restaurant[2].arrayFoo2": "arrayBar2",
  };

  expect(result).toEqual(expected);
});

it("should return nested flattened object", () => {
  // SETUP
  const object = {
    restaurant: {
      id: 2,
      foo: "bar",
      baz: "qux",
      someArray: [
        {
          id: 1,
          arrayFoo1: "arrayBar1",
        },
        {
          id: 2,
          arrayFoo2: "arrayBar2",
        },
        {
          id: 42,
          arrayFoo42: "arrayBar42",
          arrayBoo42: "arrayFar42",
        },
      ],
    },
  };

  // EXECUTE
  const result = flattenObject(object);

  // VERIFY
  const expected = {
    "restaurant[2].foo": "bar",
    "restaurant[2].baz": "qux",
    "restaurant[2].someArray[1].arrayFoo1": "arrayBar1",
    "restaurant[2].someArray[2].arrayFoo2": "arrayBar2",
    "restaurant[2].someArray[42].arrayFoo42": "arrayBar42",
    "restaurant[2].someArray[42].arrayBoo42": "arrayFar42",
  };

  expect(result).toEqual(expected);
});

it("should work for quite complicated structures nested", () => {
  // SETUP
  const object = {
    restaurant: {
      id: 2,
      someArray: [
        {
          id: 1,
          arrayFoo1: "arrayBar1",
        },
        {
          id: 2,
          arrayFoo2: "arrayBar2",
        },
        {
          id: 42,
          arrayFoo42: "arrayBar42",
          arrayBoo42: "arrayFar42",
          subRestaurant: {
            id: 102,
            arrayFoo102: "arrayBar102",
            arrayBoo102: "arrayFar102",
          },
        },
      ],
    },
  };

  // EXECUTE
  const result = flattenObject(object);

  // VERIFY
  const expected = {
    "restaurant[2].someArray[1].arrayFoo1": "arrayBar1",
    "restaurant[2].someArray[2].arrayFoo2": "arrayBar2",
    "restaurant[2].someArray[42].arrayFoo42": "arrayBar42",
    "restaurant[2].someArray[42].arrayBoo42": "arrayFar42",
    "restaurant[2].someArray[42].subRestaurant[102].arrayFoo102": "arrayBar102",
    "restaurant[2].someArray[42].subRestaurant[102].arrayBoo102": "arrayFar102",
  };

  expect(result).toEqual(expected);
});
