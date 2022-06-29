# The Official Strapi Localization Plugin by Localazy

### The Official Strapi Localization Plugin by Localazy

Strapi localization doesn't have to be a headache! Install the Strapi localization plugin and seamlessly translate your content into multiple languages with [Localazy](https://localazy.com).

![The Official Strapi Localization Plugin by Localazy](https://directus9.localazy.com/assets/e08d0418-5669-4255-9c2c-f5cc6e403edd)

### Manage your multilingual content with ease.
1. [Sign up](https://localazy.com/register?ref=strapi_marketplace) & Upload your content to Localazy.
2. Translate your content with machine translation assistance, or let the Localazy Continuous Localization Team translate your content for you. You can also quickly pre-translate everything in bulk or invite your translators.
3. Download translated content back to Strapi and feel the seamless experience of multilingual content management.

Learn more in the [Strapi + Localazy tutorial](https://localazy.com/blog/how-to-strapi-localization-with-localazy#getting-started-with-strapi-localization).

### General information

This repository contains all the code needed to run the Strapi Localization Plugin by Localazy.

### Install plugin via NPM

The plugin is available on [NPM](https://www.npmjs.com/package/@localazy/strapi-plugin).
You can also follow the installation commands located in your Strapi project Marketplace. This is the recommended approach.

### Use plugin in a clean project locally

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

To run tests, run `npm run test` command. To watch tests, run `npm run test:watch` command.

In case you have an access, you might also want to check the README file located in development project root for more information on tests debugging.

### Support
- If you encounter any issues or have questions, please contact us at [team@localazy.com](mailto:team@localazy.com).
- Join the [Localazy Discord](https://discord.gg/CAVhHrh) to discuss all things localization.
