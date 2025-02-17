import each from 'lodash-es/each';
import isObject from 'lodash-es/isObject';
import isArray from 'lodash-es/isArray';

function flattenObject(obj: any, delimiter: string = '.') {
  const nobj: Record<string, any> = {};

  each(obj, (val, key) => {
    // ensure is JSON key-value map, not array
    if (isObject(val) && !isArray(val)) {
      // union the returned result by concat all keys
      const strip = flattenObject(val, delimiter);
      each(strip, (v, k) => {
        nobj[key + delimiter + k] = v;
      });
    } else {
      nobj[key] = val;
    }
  });

  return nobj;
}

export { flattenObject };
