const getMainKeysOfNestedArrayObjects = (array: any) => {
  return array.map((item: any) => Reflect.ownKeys(item)[0]);
};

export { getMainKeysOfNestedArrayObjects };
