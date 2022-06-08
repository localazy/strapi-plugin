import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";

const name = pluginPkg.strapi.name;
const SETTINGS_SETUP = [
  {
    sectionId: `${pluginId}-settings`,
    intlId: `localazy_settings`,
    sectionDefaultLabel: "Localazy Settings",
    links: [
      {
        linkId: `${pluginId}-settings-content-transfer-setup`,
        intlId: `content_transfer_setup`,
        defaultLabel: "Content Transfer Setup",
        to: `/settings/${pluginId}/content-transfer-setup`,
        Component: async () => {
          const component = await import("./pages/PluginSettings");

          return component;
        },
        permissions: [
          // TODO: only allow access to this page if the user has the right permissions
        ],
      },
    ],
  },
];

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import("./pages/Index");

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.createSettingSection(
      {
        id: SETTINGS_SETUP[0].sectionId,
        intlLabel: {
          id: SETTINGS_SETUP[0].intlId,
          defaultMessage: SETTINGS_SETUP[0].sectionDefaultLabel,
        },
      },
      [
        // links
        {
          id: SETTINGS_SETUP[0].links[0].linkId,
          intlLabel: {
            id: SETTINGS_SETUP[0].links[0].intlId,
            defaultMessage: SETTINGS_SETUP[0].links[0].defaultLabel,
          },
          to: SETTINGS_SETUP[0].links[0].to,
          Component: SETTINGS_SETUP[0].links[0].Component,
          permissions: SETTINGS_SETUP[0].links[0].permissions,
        },
      ]
    );
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap() { },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
