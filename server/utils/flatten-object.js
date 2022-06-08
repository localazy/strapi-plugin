"use strict";

const flattenObject = (object, prefix = "") => {
  const result = {};

  for (const objectKey in object) {
    if (objectKey === "id") {
      continue;
    }

    if (typeof object[objectKey] !== "object") {
      const key = prefix ? `${prefix}.${objectKey}` : objectKey;
      // Simple leaf (e.g. string or number)
      result[key] = object[objectKey];
    } else {
      // Recursive call down to flattened object
      let flatObject;

      // If it is an array then turn it into an object with the correct keys
      if (Array.isArray(object[objectKey])) {
        // Reduce each item into the right key
        const flattenedArray = object[objectKey].reduce(
          (accumulator, item, index) => {
            // No id should use the index of the array item
            accumulator[`${objectKey}[${item.id || index}]`] =
              flattenObject(item);
            return accumulator;
          },
          {}
        );

        // Then flatten it
        flatObject = flattenObject(flattenedArray);
      } else {
        // Otherwise it is a complex object so you want to flatten that
        // but with the prefix of this current object key
        const suffix = object[objectKey]?.id
          ? `${objectKey}[${object[objectKey].id}]`
          : objectKey;
        flatObject = flattenObject(object[objectKey], suffix);
      }

      for (const flatObjectKey in flatObject) {
        const key = prefix ? `${prefix}.${flatObjectKey}` : flatObjectKey;
        result[`${key}`] = flatObject[flatObjectKey];
      }
    }
  }
  return result;
};

module.exports = flattenObject;
