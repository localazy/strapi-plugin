<div align="center">

[<img src="https://localazy.com/directus9/assets/9fc36b9c-81b7-4dbf-bd82-b64cd984090f" width="285" height="50" alt="Localazy" >](https://localazy.com)

### 📦 `@localazy/strapi-plugin`

[**Documentation**](https://localazy.com/docs/strapi/strapi-plugin-introduction-installation) &nbsp;|&nbsp;
[**Blog Articles**](https://localazy.com/tags/strapi)

_The official Strapi Plugin by Localazy_

[![version](.github/badges/version.svg)](https://www.npmjs.com/package/@localazy/strapi-plugin)

</div>

## 🚀 Quick Start

This is a README for Strapi v5. For Strapi v4, please refer to the [Strapi v4 README](https://github.com/localazy/strapi-plugin/tree/strapi-v4#readme) file.

```
npm install @localazy/strapi-plugin@latest && npx @localazy/strapi-plugin
```

## ✨ The Official Strapi Localization Plugin by Localazy

Strapi localization doesn't have to be a headache! Install the Strapi localization plugin and seamlessly translate your content into multiple languages with [Localazy](https://localazy.com).

### Manage your multilingual content with ease

1. [Sign up](https://localazy.com/register) & Upload your content to Localazy.
2. Translate your content with machine translation assistance, or let the Localazy [Continuous Localization Team](https://localazy.com/blog/guide-localazy-translation-services) translate your content for you. You can also quickly pre-translate everything in bulk or invite your translators.
3. Download translated content back to Strapi and feel the seamless experience of multilingual content management.

📰 Learn more in the [Strapi + Localazy tutorial](https://localazy.com/blog/how-to-strapi-localization-with-localazy#getting-started-with-strapi-localization).

## 🔧 Installation & Setup

The plugin is available on [NPM](https://www.npmjs.com/package/@localazy/strapi-plugin).
You can also follow the installation commands located in your Strapi project Marketplace or [Strapi Marketplace > Localazy](https://market.strapi.io/plugins/@localazy-strapi-plugin) itself. This is the recommended approach.

```
npm install @localazy/strapi-plugin@latest && npx @localazy/strapi-plugin
```

Note: Localazy plugin requires an updated bundler configuration of your Strapi project. Follow the instructions in the console output during the installation process. Steps are also available in the [Install plugin via NPM](https://localazy.com/docs/strapi/strapi-plugin-introduction-installation#install-plugin-via-npm) section of the Localazy Docs.

Plugin supports automatic recognition of a bundler configuration. If you are using either Vite or Webpack, respectively, the plugin will automatically create an example configuration file for you.

Due to the changes in Strapi core code it's also necessary to add an environment variable to your Strapi project. Add the following line to your `.env` file (value is empty):

```
STRAPI_ADMIN_LOCALAZY_ENV=
```

## ⚙️ Configuration

Additional configuration object may be provided in the `plugins.js` file. The following options are available:

```js
localazy: {
    config: {
      /**
       * both options may help guard against DoS attacks
       * if `populateMaxDepth` < 5; the Localazy Strapi Plugin may not work as expected
       */
      populateDefaultDepth?: number, // default is 5
      populateMaxDepth?: number, // default is 10
      skipCreatorFields?: boolean, // default is false
      enableSocketIO?: boolean, // default is true
    },
  },
```

## 🛟 Support

If you encounter any issues or have questions, feel free to contact us through whichever channel suits you best:

- [Intercom chat](https://localazy.com)
- [GitHub issues](https://github.com/localazy/strapi-plugin/issues)
- [Discussion forum](https://discuss.localazy.com/)
- [team@localazy.com](mailto:team@localazy.com)

## 📜 License

This project is licensed under the MIT License.

See [LICENSE](LICENSE) for details.
