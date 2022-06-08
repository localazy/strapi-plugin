"use strict";

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin("localazy")
      .service("myService")
      .getWelcomeMessage();
  },
};
