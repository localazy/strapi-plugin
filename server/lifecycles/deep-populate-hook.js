const { getFullPopulateObject, DEFAULT_POPULATE_DEPTH } = require('../utils/get-full-populate-object');

module.exports = (event) => {
  const populate = event.params?.populate;

  if (populate && populate[0] === 'deep') {
    const populateDefaultDepth = strapi.plugin("localazy")?.config('populateDefaultDepth') ?? DEFAULT_POPULATE_DEPTH;
    const depth = populate[1] ?? populateDefaultDepth;
    const modelObject = getFullPopulateObject(event.model.uid, depth);
    event.params.populate = modelObject.populate;
  }
}
