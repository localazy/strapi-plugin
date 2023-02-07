"use strict";

const execSync = require("child_process").execSync;
const deepKeys = require("@david-vaclavek/deep-keys");
const get = require("lodash/get");
const os = require("os");
const {
  getCollectionsNames,
  findSetupModelByCollectionName,
  findSetupModelByCollectionUid,
  isCollectionTransferEnabled,
  getPickPaths,
} = require("../utils/transfer-setup-utils");

const EXPORT_FILE_NAME = 'localazy_export_upload';

const getComponentType = (allModels, key, currentModel) => {
  let componentType = 'none';
  const keyArray = [key];

  const iteration = (keyArray, currentModel, index = 0) => {
    const selection = `attributes.${keyArray[index]}`;
    const modelValue = get(currentModel, selection);

    if (typeof modelValue === 'undefined') {
      // cut the last part of the key and try again
      const split = keyArray[index].split('.');
      keyArray[index] = split[0];
      const keyToPush = split.slice(1, split.length).join('.');

      if (!keyToPush) {
        return componentType;
      }

      keyArray.push(keyToPush);

      return iteration(keyArray, currentModel, index);
    } else if (modelValue.type === 'component') {
      componentType = modelValue.repeatable ? 'repeatable_component' : 'component';

      const componentUid = modelValue.component;

      const newCurrentModel = allModels.find((model) => model.uid === componentUid);
      index += 1;

      return iteration(keyArray, newCurrentModel, index);
    } else if (modelValue.type === 'dynamiczone') {
      componentType = 'dynamiczone';

      const components = modelValue.components;
      components.forEach((componentUid) => {
        const newCurrentModel = allModels.find((model) => model.uid === componentUid);
        index += 1;

        return iteration(keyArray, newCurrentModel, index);
      });
    } else {
      // is a primitive type; the end of the recursion
      return componentType;
    }
  };

  return iteration(keyArray, currentModel);

};

module.exports = {
  async upload(ctx) {
    const messageReport = [];

    const PluginSettingsService = strapi
      .plugin("localazy")
      .service("pluginSettingsService");
    const StrapiService = strapi
      .plugin("localazy")
      .service("strapiService");

    /**
     * Check if content transfer setup is set up
     */
    const contentTransferSetup = await PluginSettingsService.getContentTransferSetup();
    if (!contentTransferSetup.has_setup) {
      const message = "Content transfer setup is not set up.";
      strapi.log.info(message);
      messageReport.push(message);
      success = false;
      ctx.body = {
        success,
        report: messageReport,
      };
      return;
    }

    /**
     * Evaluate all the picked collections paths
     */
    const pickedCollectionsPaths = [];
    const { setup } = contentTransferSetup;
    const collectionsNames = getCollectionsNames(setup);
    const transferEnabledCollectionsNames = collectionsNames.filter((collectionName) => {
      if (!isCollectionTransferEnabled(setup, collectionName)) {
        const message = `Collection ${collectionName} transfer is disabled.`;
        messageReport.push(message);
        strapi.log.info(message);
        return false;
      }
      return true;
    });

    const allModels = await StrapiService.getModels();
    const transferEnabledModels = allModels.filter((model) => {
      return !!transferEnabledCollectionsNames.includes(model.collectionName);
    });
    const collectionNameToUidMap = transferEnabledModels.reduce((acc, model) => {
      acc[model.collectionName] = model.uid;
      return acc;
    }, {});
    const setupDeepKeys = deepKeys(setup);
    const pickedDeepKeys = setupDeepKeys.filter((key) => {
      return (get(setup, key) === true && key.indexOf(".__model__") === -1) || key.indexOf(".__component__") !== -1;
    });

    // iterate over all the picked deep keys and map it
    // type
    // add ids
    // decide if it is a component
    // decide if it is a repeatable component
    // decide if it is a dynamic zone
    // build a mapping object based on the above
    const mappedPickedDeepKeys = pickedDeepKeys.map((key) => {
      const splitKey = key.split(".");
      const collectionName = splitKey[1];
      const collectionUid = collectionNameToUidMap[collectionName];

      if (!collectionUid) {
        return null;
      }

      const keyRest = splitKey.slice(2).join(".");
      const currentModel = allModels.find((model) => model.uid === collectionUid);
      const component = getComponentType(allModels, keyRest, currentModel)



      return {
        type: collectionUid,
        key: `data.${keyRest}`,
        // component 'none' | 'component' | 'repeatable_component' | 'dynamiczone'
      }
    }).filter((key) => !!key);
    Object.values(collectionNameToUidMap).forEach((collectionUid) => {
      mappedPickedDeepKeys.push({
        type: collectionUid,
        key: "id",
      });
    });





    for (const collectionName of transferEnabledCollectionsNames) {
      const currentModel = models.find((model) => model.collectionName === collectionName);
      const modelUid = currentModel.uid;
      if (!currentModel) {
        strapi.log.warn(`Model with uid ${modelUid} is not found.`);
        continue;
      }
    }


    // Export entities
    strapi.log.info("Exporting entities...");
    // execSync(`npx strapi export --no-encrypt --no-compress --file ${EXPORT_FILE_NAME} --only content`)
    strapi.log.info("Export complete");

    const tar = require("tar-stream");
    const fs = require("fs");

    const extract = tar.extract();
    fs.createReadStream(`${EXPORT_FILE_NAME}.tar`).pipe(extract);

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
