## The Official Strapi Localization Plugin by Localazy

Strapi localization doesn't have to be a headache! Install the Strapi localization plugin and seamlessly translate your content into multiple languages with [Localazy](https://localazy.com).

### Manage your multilingual content with ease
1. [Sign up](https://localazy.com/register) & Upload your content to Localazy.
2. Translate your content with machine translation assistance, or let the Localazy [Continuous Localization Team](https://localazy.com/blog/guide-localazy-translation-services) translate your content for you. You can also quickly pre-translate everything in bulk or invite your translators.
3. Download translated content back to Strapi and feel the seamless experience of multilingual content management.

📰 Learn more in the [Strapi + Localazy tutorial](https://localazy.com/blog/how-to-strapi-localization-with-localazy#getting-started-with-strapi-localization).

## Setup

### Install the plugin via NPM

The plugin is available on [NPM](https://www.npmjs.com/package/@localazy/strapi-plugin).
You can also follow the installation commands located in your Strapi project Marketplace. This is the recommended approach.

```
npm install @localazy/strapi-plugin
```

### Use the plugin in a clean project locally

Besides installing the plugin via `npm`, you can also use it in a project locally. Assuming you have a (clean) Strapi project set up, do:

1. Copy the whole contents.
2. Paste it into `./src/plugin/localazy` folder of your project (path from project root).
3. Create `./config/plugins.js` file (path from project root).
4. Add the following contents to `./config/plugins.js` file:

```
module.exports = {
  localazy: {
    enabled: true,
    resolve: "./src/plugins/localazy",
    config: {
      default: () => {},
      validator: () => {},
    },
  },
};
```

5. Run the project. The plugin will be available in the admin.

### Tests

To run tests, run the `npm run test` command. To watch tests, run the `npm run test:watch` command.

## Additional Resources
- Localazy Docs: [Introduction to Strapi](https://localazy.com/docs/strapi/strapi-plugin-introduction-installation)
- Localazy Blog: [Articles about the Strapi plugin](https://localazy.com/tags/strapi)

## Support
- If you encounter any issues or have questions, please contact us at [team@localazy.com](mailto:team@localazy.com).
- Join the [Localazy Discussion Forum](https://discuss.localazy.com/) to discuss all things localization.
