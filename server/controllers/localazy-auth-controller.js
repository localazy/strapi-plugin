"use strict";

module.exports = {
  async generateKeys(ctx) {
    ctx.body = await strapi
      .plugin("localazy")
      .service("localazyAuthService")
      .generateKeys();
  },

  async continuousPoll(ctx) {
    const POLLING_LIMIT = 60;
    const INTERVAL_PERIOD = 2000; // ms
    const localazyAuthService = strapi
      .plugin("localazy")
      .service("localazyAuthService");

    let counter = 1;
    const { readKey } = ctx.query;
    let result = await localazyAuthService.completeLogin(readKey);

    let data = {
      success: false,
    };
    if (!result.completed) {
      data = await new Promise((resolve, reject) => {
        const pollInterval = setInterval(async () => {
          result = await localazyAuthService.completeLogin(readKey);

          if (result.completed) {
            clearInterval(pollInterval);
            resolve(result.data);
          }

          counter += 1;
          if (counter >= POLLING_LIMIT) {
            clearInterval(pollInterval);
            reject(new Error("Sign in attempts timed out."));
          }
        }, INTERVAL_PERIOD);
      });
    }

    ctx.body = data;
  },
};
