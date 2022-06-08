"use strict";

const isoStrapiToLocalazy = (isoStrapi) => {
  if (!isoStrapi) {
    return null;
  }

  return isoStrapi.replace("_", "-");
};

const isoLocalazyToStrapi = (isoLocalazy) => {
  if (!isoLocalazy) {
    return null;
  }

  return isoLocalazy.replace("-", "_");
};

module.exports = {
  isoStrapiToLocalazy,
  isoLocalazyToStrapi,
};
