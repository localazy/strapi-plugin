## The Official Strapi Localization Plugin by Localazy

Strapi localization doesn't have to be a headache! Install the Strapi localization plugin and seamlessly translate your content into multiple languages with [Localazy](https://localazy.com).

### Manage your multilingual content with ease.
1. [Sign up](https://localazy.com/register?ref=strapi_marketplace) & Upload your content to Localazy.
2. Translate your content with machine translation assistance, or let the Localazy Continuous Localization Team translate your content for you. You can also quickly pre-translate everything in bulk or invite your translators.
3. Download translated content back to Strapi and feel the seamless experience of multilingual content management.

Learn more in the [Strapi + Localazy tutorial](https://localazy.com/blog/how-to-strapi-localization-with-localazy#getting-started-with-strapi-localization).

## Setup

### Install plugin via NPM

The plugin is available on [NPM](https://www.npmjs.com/package/@localazy/strapi-plugin).
You can also follow the installation commands located in your Strapi project Marketplace. This is the recommended approach.

```
npm install @localazy/strapi-plugin
```

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

## Tests

To run tests, run `npm run test` command. To watch tests, run `npm run test:watch` command.

## Support
- If you encounter any issues or have questions, please contact us at [team@localazy.com](mailto:team@localazy.com).
- Join the [Localazy Discord](https://discord.gg/CAVhHrh) to discuss all things localization.

## Configuration
### API Endpoints Prefix
In case the Strapi Instance is running under a subfolder (`url` parameter in [Strapi documentation](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/server.html#available-options)), Localazy Plugin needs to be additionally configured.

We provide a support for `.env ` variable `STRAPI_ADMIN_LOCALAZY_PLUGIN_BACKEND_PREFIX`. A value assigned to this variable will be used as a prefix.
