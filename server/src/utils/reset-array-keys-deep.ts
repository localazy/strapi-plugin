import { set, get } from 'lodash-es';

export const resetArrayKeysDeep = (object: Record<string, any>, keysToFilter: string[]) => {
  // sort keys from deep to shallow (so we won't rewrite indices)
  const sortedKeysToFilter = keysToFilter.sort((a, b) => {
    const aLvl = a.match(/\./g)?.length || 0;
    const bLvl = b.match(/\./g)?.length || 0;

    return bLvl - aLvl;
  });
  for (const key of sortedKeysToFilter) {
    const part = get(object, key);
    const filteredPart = part.filter((item) => item !== undefined);
    set(object, key, filteredPart);
  }
};
