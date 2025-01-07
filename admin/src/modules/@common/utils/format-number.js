export default (value, options = undefined) => new Intl.NumberFormat("en-GB", options).format(value);
