const findModel = (models, uid) => {
  const model = models.find((model) => model.uid === uid);
  return model;
};

module.exports = findModel;
