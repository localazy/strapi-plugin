export const dropPropertyDeep = (obj: any, propertyName: string, isRoot = true): any => {
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => isRoot || !(typeof item === 'object' && item !== null && propertyName in item))
      .map((item) => (typeof item === 'object' && item !== null ? dropPropertyDeep(item, propertyName, false) : item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key in obj) {
      if (isRoot || !(propertyName in obj)) {
        result[key] =
          typeof obj[key] === 'object' && obj[key] !== null
            ? dropPropertyDeep(obj[key], propertyName, false)
            : obj[key];
      }
    }
    return result;
  }

  return obj;
};
