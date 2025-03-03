export default (array) =>
  array.reduce((obj, item) => {
    obj[Object.keys(item)[0]] = item;

    return obj;
  }, {});
