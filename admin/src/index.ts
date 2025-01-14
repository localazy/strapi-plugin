import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import Localazy from './modules/@common/components/Icons/Localazy';
import FetchIdentity from "./modules/login/components/FetchIdentity";
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
};

const addMenuLink = (app: any) => {
  app.addMenuLink({
    to: `plugins/${PLUGIN_ID}`,
    icon: Localazy,
    intlLabel: {
      id: `${PLUGIN_ID}.name`,
      defaultMessage: getTranslation('name'),
    },
    Component: async () => {
      const { App } = await import('./pages/App');
      const { LocalazyIdentityProvider } = await import('./state/localazy-identity');

      const WrappedApp = () =>
        React.createElement(
          LocalazyIdentityProvider,
          {
            children: React.createElement(
              React.Fragment,
              {},
              [
                React.createElement(FetchIdentity, {}),
                React.createElement(App, {})
              ]
            )
          }
        );

      return WrappedApp;
    },
  });
}

const addSettingsSection = (app: any) => {
  app.createSettingSection(
    {
      id: `${PLUGIN_ID}-settings`,
      intlLabel: {
        id: `${PLUGIN_ID}.localazy_settings`,
        defaultMessage: getTranslation('localazy_settings'),
      },
    },
    [
      // General
      {
        id: `${PLUGIN_ID}-settings-global`,
        intlLabel: {
          id: `${PLUGIN_ID}.localazy_settings`,
          defaultMessage: getTranslation('localazy_settings'),
        },
        to: `/settings/${PLUGIN_ID}/global-settings`,
        Component: async () => {
          const { GlobalSettings } = await import("./pages/GlobalSettings");
          const { LocalazyIdentityProvider } = await import("./state/localazy-identity");

          const WrappedGlobalSettings = () =>
            React.createElement(
              LocalazyIdentityProvider,
              { children: React.createElement(GlobalSettings, {}) }
            );

          return WrappedGlobalSettings;
        },
        permissions: [],
      },
      // Content Transfer Setup
      {
        id: `${PLUGIN_ID}-settings-content-transfer-setup`,
        intlLabel: {
          id: `${PLUGIN_ID}.content_transfer_setup`,
          defaultMessage: getTranslation('content_transfer_setup'),
        },
        to: `/settings/${PLUGIN_ID}/content-transfer-setup`,
        Component: async () => {
          const { ContentTransferSetup } = await import("./pages/ContentTransferSetup");
          const { LocalazyIdentityProvider } = await import("./state/localazy-identity");

          const WrappedContentTransferSetup = () =>
            React.createElement(
              LocalazyIdentityProvider,
              { children: React.createElement(React.Fragment, {}, [
                React.createElement(FetchIdentity, {}),
                React.createElement(ContentTransferSetup, {})
              ]) }
            );

          return WrappedContentTransferSetup;
        },
        permissions: [],
      },
    ]
  );
}

const addPlugin = (app: any) => {
  app.registerPlugin({
    id: PLUGIN_ID,
    initializer: Initializer,
    isReady: false,
    name: PLUGIN_ID,
  });
}
