const getFullPopulateObject = require('./../utils/get-full-populate-object')

module.exports = (event) => {
  const populate = event.params?.populate;

  if (populate && populate[0] === 'deep') {
    const depth = populate[1] ?? 5
    const modelObject = getFullPopulateObject(event.model.uid, depth);
    event.params.populate = modelObject.populate
  }
}
