"use strict";

// TODO: resolve if possible
// https://medium.com/the-javascript-dojo/improving-code-readability-with-path-aliases-1a41143d7632
// const moduleAlias = require("module-alias");

// moduleAlias.addAliases({
//   // eslint-disable-next-line node/no-path-concat
//   "@admin": `${__dirname}/admin`,
//   // eslint-disable-next-line node/no-path-concat
//   "@src": `${__dirname}/admin/src`,
// });

module.exports = require("./admin/src").default;
