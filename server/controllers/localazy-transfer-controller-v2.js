"use strict";

const execSync = require("child_process").execSync;
const os = require("os");

const fileName = 'localazy_export_upload';

module.exports = {
  async upload(ctx) {
    // Export entities
    strapi.log.info("Exporting entities...");
    // execSync(`npx strapi export --no-encrypt --no-compress --file ${fileName} --only content`)
    strapi.log.info("Export complete");

    const tar = require("tar-stream");
    const fs = require("fs");

    const extract = tar.extract();
    fs.createReadStream(`${fileName}.tar`).pipe(extract);

    const entities = [];
    await new Promise((resolve, reject) => {
      const chunks = [];
      extract.on("entry", (header, stream, next) => {
        if (/entities_[0-9]+\.jsonl$/.test(header.name)) {
          strapi.log.info("Extracting entities...");

          stream.on("data", (chunk) => {
            chunks.push(chunk);
          });
          stream.on("end", () => {
            strapi.log.info("Extracting a file finished");

            const myJsonlsEntries = chunks.map((chunk) => chunk.toString()).join("").split(os.EOL);
            entities.push(...myJsonlsEntries.map((entry) => JSON.parse(entry)));
            resolve();
          });
          stream.on("error", (err) => {
            reject(err);
          });
        }
        next();
      });
    });

    // TODO: why is this not called?
    extract.on("finish", () => {
      strapi.log.info("Extracting finished");
    });

    // awaited for the promise above, entities are ready
    strapi.log.info(entities);


    ctx.body = {
      success: true,
    };
  },

  async download(ctx) {

  },
};
