## Quick Installation

```
npm install @localazy/strapi-plugin@latest && npx @localazy/strapi-plugin
```

## The Official Strapi Localization Plugin by Localazy

Strapi localization doesn't have to be a headache! Install the Strapi localization plugin and seamlessly translate your content into multiple languages with [Localazy](https://localazy.com).

### Manage your multilingual content with ease

1. [Sign up](https://localazy.com/register) & Upload your content to Localazy.
2. Translate your content with machine translation assistance, or let the Localazy [Continuous Localization Team](https://localazy.com/blog/guide-localazy-translation-services) translate your content for you. You can also quickly pre-translate everything in bulk or invite your translators.
3. Download translated content back to Strapi and feel the seamless experience of multilingual content management.

📰 Learn more in the [Strapi + Localazy tutorial](https://localazy.com/blog/how-to-strapi-localization-with-localazy#getting-started-with-strapi-localization).

## Installation & Setup

The plugin is available on [NPM](https://www.npmjs.com/package/@localazy/strapi-plugin).
You can also follow the installation commands located in your Strapi project Marketplace or [Strapi Marketplace > Localazy](https://market.strapi.io/plugins/@localazy-strapi-plugin) itself. This is the recommended approach.

```
npm install @localazy/strapi-plugin@latest && npx @localazy/strapi-plugin
```

Note: Localazy plugin requires an updated Webpack configuration of your Strapi project. Follow the instructions in the console output during the installation process. Steps are also available in the [Install plugin via NPM](https://localazy.com/docs/strapi/strapi-plugin-introduction-installation#install-plugin-via-npm) section of the Localazy Docs.

Due to the changes in Strapi core code it's also necessary to add an environment variable to your Strapi project. Add the following line to your `.env` file (value is empty):

```
STRAPI_ADMIN_LOCALAZY_ENV=
```

## Configuration

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
    },
  },
```

## Additional Resources

- Localazy Docs: [Introduction to Strapi](https://localazy.com/docs/strapi/strapi-plugin-introduction-installation)
- Localazy Blog: [Articles about the Strapi plugin](https://localazy.com/tags/strapi)

## Support

- If you encounter any issues or have questions, please contact us at [team@localazy.com](mailto:team@localazy.com).
- Join the [Localazy Discussion Forum](https://discuss.localazy.com/) to discuss all things localization.
