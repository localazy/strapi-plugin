// TODO: ADD TYPES

export default (array: any[]) =>
  array.reduce((obj: any, item: any) => {
    obj[Object.keys(item)[0]] = item;

    return obj;
  }, {});
