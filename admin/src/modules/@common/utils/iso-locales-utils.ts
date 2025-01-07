import { Locales } from "@localazy/api-client"

export const isoStrapiToLocalazy = (isoStrapi: string): Locales | '' => {
  if (!isoStrapi) {
    return '';
  }

  const split = isoStrapi.split("-");
  const language = split[0];

  const hasRegionAndScript = split.length === 3;

  if (hasRegionAndScript) {
    const script = split[1];
    const region = split[2];

    return `${language}_${region}#${script}` as Locales;
  }

  const hasPossiblyRegion = split.length === 2;

  if (hasPossiblyRegion) {
    const regionOrScript = split[1];

    // is it script - the way Strapi resolves that
    const isItRegion = regionOrScript.toUpperCase() === regionOrScript;

    // it is region; otherwise it is script
    return isItRegion ? `${language}_${regionOrScript}` as Locales : `${language}#${regionOrScript}` as Locales;
  }

  return isoStrapi.replace("-", "_") as Locales;
};

export const isoLocalazyToStrapi = (isoLocalazy: Locales): string => {
  if (!isoLocalazy) {
    return '';
  }

  const scriptIndex = isoLocalazy.indexOf("#");
  const hasScript = scriptIndex > -1;

  if (hasScript) {
    const script = isoLocalazy.substring(scriptIndex + 1);
    const isoLocalazyWithoutScript = isoLocalazy.substring(0, scriptIndex);
    const split = isoLocalazyWithoutScript.split("_");
    const language = split[0];
    const region = split[1];

    if (!region) {
      return `${language}-${script}`;
    }

    const isoStrapi = `${language}-${script}-${region.toUpperCase()}`;

    return isoStrapi;
  }

  return isoLocalazy.replace("_", "-");
};
