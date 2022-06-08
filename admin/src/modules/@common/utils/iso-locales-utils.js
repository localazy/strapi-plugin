export const isoStrapiToLocalazy = (isoStrapi) => {
  if (!isoStrapi) {
    return null;
  }

  return isoStrapi.replace("_", "-");
};

export const isoLocalazyToStrapi = (isoLocalazy) => {
  if (!isoLocalazy) {
    return null;
  }

  return isoLocalazy.replace("-", "_");
};
