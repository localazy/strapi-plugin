import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash-es/isEqual';
import cloneDeep from 'lodash-es/cloneDeep';
import { Layouts } from '@strapi/strapi/admin';
import { Check } from '@strapi/icons';
import { Box, Button, Alert, Flex, Divider, Typography } from '@strapi/design-system';
import set from 'lodash-es/set';
import get from 'lodash-es/get';
import PluginSettingsService from '../modules/plugin-settings/services/plugin-settings-service';
import StrapiModelService from '../modules/plugin-settings/services/strapi-model-service';
import getFilteredModelsSchemas from '../modules/plugin-settings/utils/get-filtered-models-schemas';
import getModelsTree from '../modules/plugin-settings/utils/get-models-tree';
import hasModelChanged from '../modules/plugin-settings/functions/has-model-changed';
import buildContentTransferSetupSchema from '../modules/plugin-settings/functions/build-content-transfer-setup-schema';
import { Tree } from '../modules/plugin-settings/components/Tree';
import { ContentTransferSetupEmpty } from '../modules/plugin-settings/components/ContentTransferSetupEmpty';

// import and load resources
import '../i18n';

// TODO: ADD TYPES

const ContentTransferSetup: React.FC = () => {
  /**
   * Translation function
   */
  const { t } = useTranslation();

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
  const buildItemsExpandedModel = (models: any) => {
    const r: Record<string, boolean> = {};
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
  };

  /**
   * Save the content transfer setup
   */
  const saveContentTransferSetup = async (data: any) => {
    try {
      await PluginSettingsService.updateContentTransferSetup(data);
      setOriginalFormModel(cloneDeep(data));
      setHasUnsavedChanges(false);
      setShowAlert(true);
      setShowModalChangedAlert(false);
    } catch (e: any) {
      throw e.data;
    }
  };

  const onTreeItemClick = (keys: any, currentValue: any) => {
    setFormModel((prevState: any) => {
      // model of a subtree is the same for each of the keys
      const modelName = keys[0].split('.')[0];
      let arrayIndex;
      const model = prevState.find((m: any, index: any) => {
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
      keys.forEach((key: any) => {
        // * if there's a "__component__" in the key; skip
        if (key.includes('__component__')) {
          return;
        }

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

  const link = 'https://localazy.com/docs/strapi';
  const onReadDocumentationClick = () => {
    window.open(link, '_blank');
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

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
      const storedContentTransferSetup = await PluginSettingsService.getContentTransferSetup();

      /**
       * Build and set accordion expanded state model
       */
      const itemsExpandedModel = buildItemsExpandedModel(localizableModels);
      setItemsExpandedModel(itemsExpandedModel as any);

      /**
       * Build and set form model
       */
      const allModelsTree = getModelsTree(models, models);

      const localizableTree = getModelsTree(models, localizableModels);
      setTreeModelsSchemas(localizableTree as any);

      const computedFormModel = buildContentTransferSetupSchema(
        localizableTree as any,
        storedContentTransferSetup.setup as any,
        allModelsTree as any
      );

      setFormModel(computedFormModel as any);
      setOriginalFormModel(cloneDeep(computedFormModel as any));

      /**
       * Handle alerts onload apperance
       */
      const localHasModelChanged = await hasModelChanged(localizableTree, storedContentTransferSetup.setup);
      setShowModalChangedAlert(localHasModelChanged);
      setHasUnsavedChanges(localHasModelChanged);

      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Layouts.Header
        title={t('plugin_settings.content_transfer_setup')}
        subtitle={t('plugin_settings.content_transfer_setup_description')}
        primaryAction={
          <Flex gap={2}>
            <Button variant='secondary' disabled={!hasUnsavedChanges} onClick={onCancelClick}>
              {t('plugin_settings.cancel')}
            </Button>
            <Button
              startIcon={<Check />}
              disabled={!hasUnsavedChanges}
              onClick={() => {
                saveContentTransferSetup(formModel);
              }}
            >
              {t('plugin_settings.save')}
            </Button>
          </Flex>
        }
        as='h2'
      />
      <Box marginRight={10} marginLeft={10}>
        {!isLoading && showAlert && (
          <Box marginBottom={8}>
            <Alert
              onClose={() => setShowAlert(false)}
              closeLabel={t('plugin_settings.close')}
              title={t('plugin_settings.content_transfer_setup_saved')}
              variant='success'
            >
              {t('plugin_settings.content_transfer_setup_saved_successfully')}
            </Alert>
          </Box>
        )}
        {!isLoading && showModalChangedAlert && (
          <Box marginBottom={8}>
            <Alert
              onClose={() => setShowModalChangedAlert(false)}
              closeLabel={t('plugin_settings.close')}
              title={t('plugin_settings.content_types_model_changed')}
              variant='default'
            >
              {t('plugin_settings.please_update_your_content')}
            </Alert>
          </Box>
        )}
        {!isLoading && (
          <Box background='neutral0' padding={7} paddingTop={6} shadow='tableShadow' hasRadius>
            {!formModel.length && (
              // empty state
              <ContentTransferSetupEmpty />
            )}
            {formModel.map((tree, index) => {
              return (
                <Box key={`box_tree_${index}`} marginBottom={3}>
                  <Tree onTreeItemClick={onTreeItemClick} objects={tree} initiallyExpanded={index === 0} />
                </Box>
              );
            })}
            {!!formModel.length && (
              <Box>
                <Box paddingTop={6} paddingBottom={6}>
                  <Divider />
                </Box>
                <Typography variant='omega'>{t('plugin_settings.you_can_upload_download')}</Typography>
                <Typography variant='omega' fontWeight='semiBold'>
                  {t('plugin_settings.only_text_based_content')}
                </Typography>
                <br />
                <br />
                <Typography variant='omega'>{t('plugin_settings.learn_more_in_docs_message_a')}</Typography>
                <Typography
                  onClick={onReadDocumentationClick}
                  variant='omega'
                  fontWeight='semiBold'
                  textColor='primary600'
                  style={{ cursor: 'pointer' }}
                >
                  {t('plugin_settings.learn_more_in_docs_message_b')}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export { ContentTransferSetup };
