import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { Localazy } from './modules/@common/components/Icons/Localazy';
import React from 'react';

export default {
  register(app: any) {
    addMenuLink(app);
    addSettingsSection(app);
    addPlugin(app);
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },

  async bootstrap(app: any) {
    /**
     * The bulk action API doesn't support intlLabel, so text is hardcoded here
     */
    try {
      const contentManagerPlugin = app.getPlugin('content-manager');

      if (contentManagerPlugin?.apis?.addEditViewSidePanel) {
        const { default: LocalazyPanel } = await import('./components/LocalazyPanel');
        const apis = contentManagerPlugin.apis;
        apis.addEditViewSidePanel([LocalazyPanel]);
      } else {
        console.warn('Localazy Plugin: Content Manager "addEditViewSidePanel" API not available');
      }

      const { default: LocalazyStatusColumn } = await import('./components/LocalazyStatusColumn');

      // Register hook to add custom column to list view
      app.registerHook('Admin/CM/pages/ListView/inject-column-in-table', (params: any) => {
        try {
          console.log('Localazy: Hook called with params:', params);

          const { displayedHeaders, layout } = params;

          // Verify displayedHeaders is an array
          if (!Array.isArray(displayedHeaders)) {
            return params; // Return original params if structure is unexpected
          }

          // Add Localazy status column
          const localazyStatusColumn = {
            name: 'localazy_status',
            label: 'Localazy Status',
            searchable: false,
            sortable: false,
            attribute: { type: 'custom' },
            cellFormatter: (data: any, header: any, context: any) => {
              return React.createElement(LocalazyStatusColumn, {
                data,
                model: context?.model || '',
              });
            },
          };

          const updatedHeaders = [...displayedHeaders, localazyStatusColumn];

          return {
            displayedHeaders: updatedHeaders,
            layout,
          };
        } catch (error) {
          console.error('Localazy: Error in hook:', error);
          return params; // Return original params on error
        }
      });

      if (contentManagerPlugin?.apis?.addBulkAction) {
        const { useNotification } = await import('@strapi/strapi/admin');
        await import('./i18n');
        const { useTranslation } = await import('react-i18next');

        const ExcludeFromTranslationAction = (props: any) => {
          const { documents, model } = props;
          const { toggleNotification } = useNotification();
          const { t } = useTranslation();

          return {
            label: t('plugin_settings.bulk_action_exclude_from_translation'),
            variant: 'secondary',
            onClick: async () => {
              try {
                toggleNotification({
                  type: 'info',
                  message: t('plugin_settings.bulk_action_updating_entries'),
                });

                const { default: EntryExclusionService } = await import(
                  './modules/entry-exclusion/services/entry-exclusion-service'
                );

                // Extract document IDs from the selected documents
                const documentIds = documents.map((doc: any) => doc.documentId);

                // Set all selected entries as excluded
                await EntryExclusionService.setMultipleEntriesExclusion(model, documentIds, true);

                // Show success notification
                toggleNotification({
                  type: 'success',
                  message: t('plugin_settings.bulk_action_success_message'),
                  timeout: 5_000,
                });
              } catch (error) {
                console.error('Failed to exclude entries from translation:', error);

                // Show error notification
                toggleNotification({
                  type: 'danger',
                  message: t('plugin_settings.bulk_action_failed_message'),
                });
              }
            },
          };
        };
        ExcludeFromTranslationAction.type = 'exclude-translation';

        const IncludeToTranslationAction = ({ documents, model }: any) => {
          const { toggleNotification } = useNotification();
          const { t } = useTranslation();

          return {
            label: t('plugin_settings.bulk_action_include_to_translation'),
            variant: 'secondary',
            onClick: async () => {
              try {
                toggleNotification({
                  type: 'info',
                  message: t('plugin_settings.bulk_action_updating_entries'),
                });

                const { default: EntryExclusionService } = await import(
                  './modules/entry-exclusion/services/entry-exclusion-service'
                );

                // Extract document IDs from the selected documents
                const documentIds = documents.map((doc: any) => doc.documentId);

                // Set all selected entries as excluded
                await EntryExclusionService.setMultipleEntriesExclusion(model, documentIds, false);

                // Show success notification
                toggleNotification({
                  type: 'success',
                  message: t('plugin_settings.bulk_action_success_message'),
                  timeout: 5_000,
                });
              } catch (error) {
                console.error('Failed to include entries to translation:', error);

                // Show error notification
                toggleNotification({
                  type: 'danger',
                  message: t('plugin_settings.bulk_action_failed_message'),
                });
              }
            },
          };
        };

        IncludeToTranslationAction.type = 'include-translation';

        contentManagerPlugin.apis.addBulkAction([ExcludeFromTranslationAction, IncludeToTranslationAction]);
      } else {
        console.warn('Localazy Plugin: Content Manager "addBulkAction" API not available');
      }
    } catch (error) {
      console.error('Localazy Plugin: Error adding side panel:', error);
    }
  },
};

const addMenuLink = (app: any) => {
  app.addMenuLink({
    to: `plugins/${PLUGIN_ID}/`,
    icon: Localazy,
    intlLabel: {
      id: `${PLUGIN_ID}.name`,
      defaultMessage: 'Localazy',
    },
    Component: () => import('./pages/LocalazyApp'),
  });
};

const addSettingsSection = (app: any) => {
  app.addSettingsLink(
    {
      id: `${PLUGIN_ID}-settings`,
      intlLabel: {
        id: `${PLUGIN_ID}.localazy_settings`,
        defaultMessage: 'Localazy Settings',
      },
    },
    [
      // General
      {
        id: `${PLUGIN_ID}-settings-global`,
        intlLabel: {
          id: `${PLUGIN_ID}.localazy_settings`,
          defaultMessage: 'Localazy Settings',
        },
        to: `${PLUGIN_ID}/global-settings`,
        Component: () => import('./pages/LocalazyGlobalSettings'),
        permissions: [],
      },
      // Content Transfer Setup
      {
        id: `${PLUGIN_ID}-settings-content-transfer-setup`,
        intlLabel: {
          id: `${PLUGIN_ID}.content_transfer_setup`,
          defaultMessage: 'Content Transfer Setup',
        },
        to: `${PLUGIN_ID}/content-transfer-setup`,
        Component: () => import('./pages/LocalazyContentTransferSetup'),
        permissions: [],
      },
    ]
  );
};

const addPlugin = (app: any) => {
  app.registerPlugin({
    id: PLUGIN_ID,
    initializer: Initializer,
    isReady: false,
    name: PLUGIN_ID,
  });
};
