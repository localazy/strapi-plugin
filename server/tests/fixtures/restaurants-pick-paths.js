module.exports = (uidPrefix = "") => [
  `${uidPrefix}.title`,
  `${uidPrefix}.description`,
  `${uidPrefix}.recipes.name`,
  `${uidPrefix}.recipes.ingredients.name`,
  `${uidPrefix}.recipes.variants.name`,
  `${uidPrefix}.descs.rich_description`,
  `${uidPrefix}.descs.history`,
  `${uidPrefix}.descs.excerpt`,
  `${uidPrefix}.descs.test_variants.name`,
  `${uidPrefix}.street`,
  `${uidPrefix}.city`,
  `${uidPrefix}.country`,
  `${uidPrefix}.id`,
];
