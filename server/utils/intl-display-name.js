const { isoStrapiToLocalazy } = require("./iso-locales-utils.js");

module.exports = (isoCode) => {
  const isoDashed = isoStrapiToLocalazy(isoCode);
  let languageNames = new Intl.DisplayNames(["en"], { type: "language" });
  return languageNames.of(isoDashed);
};
