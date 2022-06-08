import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import isEqual from "lodash-es/isEqual";
import cloneDeep from "lodash-es/cloneDeep";
import { HeaderLayout } from "@strapi/design-system/Layout";
import Check from "@strapi/icons/Check";
import { Box } from "@strapi/design-system/Box";
import { Button } from "@strapi/design-system/Button";
import { Alert } from "@strapi/design-system/Alert";
import { Redirect } from "react-router-dom";
import { Flex } from "@strapi/design-system/Flex";
import { Divider } from "@strapi/design-system/Divider";
import { Typography } from "@strapi/design-system/Typography";
import set from "lodash-es/set";
import get from "lodash-es/get";
import PluginSettingsService from "../../services/plugin-settings-service";
import StrapiModelService from "../../services/strapi-model-service";
import getFilteredModelsSchemas from "../../utils/get-filtered-models-schemas";
import getModelsTree from "../../utils/get-models-tree";
import hasModelChanged from "../../functions/has-model-changed";
import buildContentTransferSetupSchema from "../../functions/build-content-transfer-setup-schema";
import { getLocalazyIdentity } from "../../../../state/localazy-identity";
import Tree from "../Tree";

import "../../../../i18n";

function ContentTransferSetup() {
  /**
   * Translation function
   */
  // eslint-disable-next-line no-unused-vars
  const { t } = useTranslation();

  /**
   * Is user logged in
   */
  const [localazyIdentity] = getLocalazyIdentity();
  const hasLocalazyIdentity = () => !!localazyIdentity.accessToken;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Component state
   */
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showModalChangedAlert, setShowModalChangedAlert] = useState(false);

  /**
   * Accordion expanded state model
   */
  const [, setItemsExpandedModel] = useState([]);
  const buildItemsExpandedModel = (models) => {
    const r = {};
    getFilteredModelsSchemas(models).forEach((model, index) => {
      r[model.modelUid] = index === 0;
    });

    return r;
  };

  /**
   * Helper form model object
   */
  const [, setTreeModelsSchemas] = useState([]);

  /**
   * Content transfer setup form model
   */
  const [originalFormModel, setOriginalFormModel] = useState([]);
  const [formModel, setFormModel] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const onCancelClick = () => {
    setFormModel(cloneDeep(originalFormModel));
    setHasUnsavedChanges(false);
  }

  /**
   * Save the content transfer setup
   */
  const saveContentTransferSetup = async (data) => {
    try {
      await PluginSettingsService.updateContentTransferSetup(data);
      setOriginalFormModel(cloneDeep(data));
      setHasUnsavedChanges(false);
      setShowAlert(true);
      setShowModalChangedAlert(false);
    } catch (e) {
      throw e.data;
    }
  };

  const onTreeItemClick = (keys, currentValue) => {
    setFormModel((prevState) => {
      // model of a subtree is the same for each of the keys
      const modelName = keys[0].split(".")[0];
      let arrayIndex;
      const model = prevState.find((m, index) => {
        if (Object.keys(m).includes(modelName)) {
          arrayIndex = index;

          return true;
        }

        return false;
      });

      if (model === undefined) {
        return prevState;
      }

      const newState = cloneDeep(prevState);
      keys.forEach((key) => {
        const isEditable = get(model, key) !== null;

        if (isEditable) {
          set(model, key, !currentValue);
        }
      });
      newState.splice(arrayIndex, 1, model);
      setHasUnsavedChanges(!isEqual(originalFormModel, newState) || showModalChangedAlert);

      return newState;
    });
  };

  const link = "https://localazy.com/docs/strapi";
  const onReadDocumentationClick = () => {
    window.open(link, "_blank");
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setIsLoggedIn(hasLocalazyIdentity());

      if (!hasLocalazyIdentity()) {
        setIsLoading(false);

        return;
      }

      /**
       * Fetch current models schemas
       */
      const [models, localizableModels] = await Promise.all([
        StrapiModelService.getModels(),
        StrapiModelService.getLocalizableModels(),
      ]);

      /**
       * Fetch stored content transfer setup
       */
      const storedContentTransferSetup =
        await PluginSettingsService.getContentTransferSetup();

      /**
       * Build and set accordion expanded state model
       */
      const itemsExpandedModel = buildItemsExpandedModel(localizableModels);
      setItemsExpandedModel(itemsExpandedModel);

      /**
       * Build and set form model
       */
      const allModelsTree = getModelsTree(models, models);

      const localizableTree = getModelsTree(models, localizableModels);
      setTreeModelsSchemas(localizableTree);

      const computedFormModel = buildContentTransferSetupSchema(
        localizableTree,
        storedContentTransferSetup.setup,
        allModelsTree
      );

      setFormModel(computedFormModel);
      setOriginalFormModel(cloneDeep(computedFormModel));

      /**
       * Handle alerts onload apperance
       */
      const localHasModelChanged = await hasModelChanged(localizableTree, storedContentTransferSetup.setup);
      setShowModalChangedAlert(localHasModelChanged);
      setHasUnsavedChanges(localHasModelChanged)

      setIsLoading(false);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isLoading && !isLoggedIn && <Redirect to="/plugins/localazy/login" />}

      <HeaderLayout
        title={t("plugin_settings.content_transfer_setup")}
        subtitle={t("plugin_settings.content_transfer_setup_description")}
        primaryAction={
          <Flex gap={2}>
            <Button
              variant="secondary"
              disabled={!hasUnsavedChanges}
              onClick={onCancelClick}
            >
              {t("plugin_settings.cancel")}
            </Button>
            <Button
              startIcon={<Check />}
              disabled={!hasUnsavedChanges}
              onClick={() => { saveContentTransferSetup(formModel) }}
            >
              {t("plugin_settings.save")}
            </Button>
          </Flex>
        }
        as="h2"
      />
      <Box marginRight={10} marginLeft={10}>
        {!isLoading && showAlert && (
          <Box marginBottom={8}>
            <Alert
              onClose={() => setShowAlert(false)}
              closeLabel={t("plugin_settings.close")}
              title={t("plugin_settings.content_transfer_setup_saved")}
              variant="success"
            >
              {t("plugin_settings.content_transfer_setup_saved_successfully")}
            </Alert>
          </Box>
        )}
        {!isLoading && showModalChangedAlert && (
          <Box marginBottom={8}>
            <Alert
              onClose={() => setShowModalChangedAlert(false)}
              closeLabel={t("plugin_settings.close")}
              title={t("plugin_settings.content_types_model_changed")}
              variant="default"
            >
              {t("plugin_settings.please_update_your_content")}
            </Alert>
          </Box>
        )}
        {!isLoading && (
          <Box
            background="neutral0"
            padding={7}
            paddingTop={6}
            shadow="tableShadow"
            hasRadius
          >
            {formModel.map((tree, index) => {
              return (
                <Box
                  // eslint-disable-next-line react/no-array-index-key
                  key={`box_tree_${index}`}
                  marginBottom={3}
                >
                  <Tree onTreeItemClick={onTreeItemClick} objects={tree} />
                </Box>
              );
            })}
            <Box
              paddingTop={6}
              paddingBottom={6}
            >
              <Divider />
            </Box>
            <Typography variant="omega">{t("plugin_settings.you_can_upload_download")}</Typography>
            <Typography variant="omega" fontWeight="semiBold">{t("plugin_settings.only_text_based_content")}</Typography>
            <br />
            <br />
            <Typography variant="omega">{t("plugin_settings.learn_more_in_docs_message_a")}</Typography>
            <Typography
              onClick={onReadDocumentationClick}
              variant="omega"
              fontWeight="semiBold"
              textColor="primary600"
              style={{ cursor: "pointer" }}
            >
              {t("plugin_settings.learn_more_in_docs_message_b")}
            </Typography>
          </Box>
        )
        }
      </Box>
    </>
  );
}

export default ContentTransferSetup;
