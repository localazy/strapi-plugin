const getMainKeysOfNestedArrayObjects = (array: any) => {
  return array.map((item) => Object.keys(item)[0]);
};

export { getMainKeysOfNestedArrayObjects };
