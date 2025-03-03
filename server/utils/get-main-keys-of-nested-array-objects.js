"use strict";

module.exports = (array) => {
  return array.map((item) => Object.keys(item)[0]);
};
