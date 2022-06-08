# The Official Strapi Plugin by Localazy

### Sample development project for Official Strapi Plugin by Localazy's README

This README file describes main features of Official Strapi Plugin by Localazy. To read more about sample development project for the plugin, check README file located in project root.

### General information

This repository contains all the code needed to run the Official Strapi Plugin by Localazy.

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

You might also want to check the README file located in project root for more information on tests debugging.
