import { getFullPopulateObject, DEFAULT_POPULATE_DEPTH, DEFAULT_MAX_POPULATE_DEPTH } from '../utils/get-full-populate-object';

const deepPopulateHook = (event: any) => {
  const pLevel = event.params?.pLevel;

  // if pLevel is not defined, do nothing
  if (typeof pLevel === "undefined") {
    return;
  }

  const populateDefaultDepth = strapi.plugin("strapi-plugin-v5")?.config('populateDefaultDepth') ?? DEFAULT_POPULATE_DEPTH;
  // 0 is not a valid depth
  let depth = pLevel ?? populateDefaultDepth ?? 1;
  const maxDepth = strapi.plugin("strapi-plugin-v5")?.config('populateMaxDepth') ?? DEFAULT_MAX_POPULATE_DEPTH;
  if (depth > maxDepth) {
    depth = maxDepth;
  }

  if (typeof depth === 'number') {
    const modelObject = getFullPopulateObject(event.model.uid, depth);
    if (typeof modelObject !== 'boolean' && modelObject !== undefined) {
      event.params.populate = modelObject.populate;
    }
  }
}

export default deepPopulateHook;
