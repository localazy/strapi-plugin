import get from 'lodash-es/get';
import arrayOfModelsToObject from './array-of-models-to-object';

export default (allModelsTree: any[], key: string) => {
  const objectivizedModelsTree = arrayOfModelsToObject(allModelsTree);

  return get(objectivizedModelsTree, key);
};
