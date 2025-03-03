import each from "lodash-es/each";
import isObject from "lodash-es/isObject";
import isArray from "lodash-es/isArray";

export default function flattenObject(obj, delimiter) {
  const delim = delimiter || '.';
  const nobj = {};

  each(obj, (val, key) => {
    // ensure is JSON key-value map, not array
    if (isObject(val) && !isArray(val)) {
      // union the returned result by concat all keys
      const strip = flattenObject(val, delim);
      each(strip, (v, k) => {
        nobj[key + delim + k] = v;
      })
    } else {
      nobj[key] = val;
    }
  });

  return nobj;
}
