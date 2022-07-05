module.exports = (isoStrapi) => {
  let languageNames = new Intl.DisplayNames(["en"], { type: "language" });
  return languageNames.of(isoStrapi);
};
