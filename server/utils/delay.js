"use strict";

// eslint-disable-next-line no-promise-executor-return
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = delay;
