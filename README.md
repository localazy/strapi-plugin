# The Official Strapi Plugin by Localazy

### The Official Strapi Plugin by Localazy

Manage your multilingual content with ease. Upload your content in default language to Localazy. Let us translate your content for you, use machine translation or let your translators do it for you. Download translated content back to Strapi and feel the seamless experience of multilingual content.

### General information

This repository contains all the code needed to run the Official Strapi Plugin by Localazy.

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
      default: () => ({}),the user configuration is valid
      validator: () => {},
    },
  },
};

```

5. Run the project. Plugin will be available in the admin.

### Tests

To run tests, run `npm run test` command. To watch tests, run `npm run test:watch` command.

In case you have an access, you might also want to check the README file located in development project root for more information on tests debugging.
