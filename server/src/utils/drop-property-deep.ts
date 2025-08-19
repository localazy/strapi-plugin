// Function to check if an object is a Strapi media file
const isMediaObject = (obj: any): boolean => {
  if (typeof obj !== 'object' || obj === null) return false;

  // Strapi media objects have these characteristic properties:
  return (
    'url' in obj &&
    'name' in obj &&
    'ext' in obj &&
    ('mime' in obj || 'mimeType' in obj) &&
    typeof obj.url === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.ext === 'string'
  );
};

// Original implementation for backward compatibility
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

// New function with skip predicates
export const dropPropertyDeepWithSkip = (
  obj: any,
  propertyName: string,
  isRoot = true,
  skipPredicates: ((obj: any) => boolean)[] = []
): any => {
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => {
        // If we have skipPredicates, don't filter out any objects - just process them
        if (skipPredicates.length > 0) {
          return true;
        }

        // Original behavior: filter out objects with the property from non-root arrays
        return isRoot || !(typeof item === 'object' && item !== null && propertyName in item);
      })
      .map((item) =>
        typeof item === 'object' && item !== null
          ? dropPropertyDeepWithSkip(item, propertyName, false, skipPredicates)
          : item
      );
  }

  if (typeof obj === 'object' && obj !== null) {
    // Check if this object should be skipped based on predicates
    const shouldSkip = skipPredicates.some((predicate) => predicate(obj));

    if (shouldSkip) {
      // Return the object as-is, but still process nested objects
      const result = {};
      for (const key in obj) {
        if (key === propertyName) {
          // Keep the property if this object should be skipped
          result[key] = obj[key];
        } else {
          result[key] =
            typeof obj[key] === 'object' && obj[key] !== null
              ? dropPropertyDeepWithSkip(obj[key], propertyName, false, skipPredicates)
              : obj[key];
        }
      }
      return result;
    }

    // Modified logic: process all keys, skip only the specific property
    const result = {};
    for (const key in obj) {
      // Skip the specific property unless we're at root
      if (key === propertyName && !isRoot) {
        // Skip this property
        continue;
      }

      result[key] =
        typeof obj[key] === 'object' && obj[key] !== null
          ? dropPropertyDeepWithSkip(obj[key], propertyName, false, skipPredicates)
          : obj[key];
    }
    return result;
  }

  return obj;
};

// Convenience function for dropping documentId while preserving it in media objects
export const dropDocumentIdExceptMedia = (obj: any): any => {
  return dropPropertyDeepWithSkip(obj, 'documentId', true, [isMediaObject]);
};
