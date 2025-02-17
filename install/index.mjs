#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);
const installSpinner = ora();

// To prevent node experimental features warning after `import(package.json)` require is used instead.
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

/**
 * This will be run via npx @localazy/strapi-plugin-v5
 * Decide whether the root project uses Vite or Webpack
 * and create the appropriate example file
 */
const isVite =
  fs.existsSync(path.join(process.cwd(), 'src/admin/vite.config.ts')) ||
  fs.existsSync(path.join(process.cwd(), 'src/admin/vite.config.js'));
const isWebpack =
  fs.existsSync(path.join(process.cwd(), 'src/admin/webpack.config.ts')) ||
  fs.existsSync(path.join(process.cwd(), 'src/admin/webpack.config.js'));
const isTs =
  fs.existsSync(path.join(process.cwd(), 'src/admin/vite.config.ts')) ||
  fs.existsSync(path.join(process.cwd(), 'src/admin/webpack.config.ts'));
const type = isVite ? 'vite' : isWebpack ? 'webpack' : 'fallback';
const extension = isTs ? 'ts' : 'js';

const exampleFileName =
  type === 'vite'
    ? `vite.config.localazy-strapi-plugin.example.${extension}`
    : `webpack.config.localazy-strapi-plugin.example.${extension}`;
const template =
  type === 'vite'
    ? await fs.readFile(path.join(__dirname, `vite.config.example.${extension}`))
    : await fs.readFile(path.join(__dirname, `webpack.config.example.${extension}`));

// https://patorjk.com/software/taag/#p=display&h=1&v=1&f=Sub-Zero&t=Localazy
const banner = chalk.blue(`
 __       ______   ______   ______   __       ______   ______   __  __
/\\ \\     /\\  __ \\ /\\  ___\\ /\\  __ \\ /\\ \\     /\\  __ \\ /\\___  \\ /\\ \\_\\ \\
\\ \\ \\____\\ \\ \\/\\ \\\\ \\ \\____\\ \\  __ \\\\ \\ \\____\\ \\  __ \\\\/_/  /__\\ \\____ \\
 \\ \\_____\\\\ \\_____\\\\ \\_____\\\\ \\_\\ \\_\\\\ \\_____\\\\ \\_\\ \\_\\ /\\_____\\\\/\\_____\\
  \\/_____/ \\/_____/ \\/_____/ \\/_/\\/_/ \\/_____/ \\/_/\\/_/ \\/_____/ \\/_____/
`);
const name = `${chalk.bold.green(pkg.name)}`;
const version = `${chalk.grey(`@${pkg.version}`)}`;
const file = `${chalk.bold.green(exampleFileName)}`;

const install = () =>
  new Promise(async (resolve, reject) => {
    // load parent package.json
    const parentPkg = await fs.readJson(path.join(process.cwd(), 'package.json'));
    const isLinkedLocally = parentPkg.dependencies[pkg.name].includes('.yalc');
    try {
      // Skip installation if we're using yalc (local development)
      if (isLinkedLocally) {
        installSpinner.info('Local development detected via yalc, skipping npm install');
        resolve();
        return;
      }

      await execAsync(`npm install ${pkg.name}`, { stdio: 'ignore' });
      resolve();
    } catch (err) {
      // If installation fails, log the error but continue
      installSpinner.fail(`Installation failed - ${err.message}`);
      resolve();
    }
  });

const createWebpackConfigSample = () =>
  new Promise(async (resolve, reject) => {
    try {
      await fs.writeFile(`src/admin/${exampleFileName}`, template);
      resolve();
    } catch (err) {
      reject(err);
    }
  });

const updateEnvConfig = () =>
  new Promise(async (resolve, reject) => {
    try {
      await fs.appendFile('.env', 'STRAPI_ADMIN_LOCALAZY_ENV=\n');
      resolve();
    } catch (err) {
      reject(err);
    }
  });

console.log(banner);

if (type === 'vite') {
  installSpinner.succeed(`Vite detected using ${extension === 'ts' ? 'TypeScript' : 'JavaScript'}`);
} else if (type === 'webpack') {
  installSpinner.succeed(`Webpack detected using ${extension === 'ts' ? 'TypeScript' : 'JavaScript'}`);
} else if (type === 'fallback') {
  installSpinner.warn('No Webpack or Vite config found - fallback to Webpack using JavaScript');
} else {
  process.exit(1);
}

installSpinner.start(`Installing ${name}${version}`);
await install();
installSpinner.succeed();

installSpinner.start(`Creating example ${file} file in ${chalk.bold.green('src/admin')} folder`);
await createWebpackConfigSample();
installSpinner.succeed();
installSpinner.start(
  `Updating ${chalk.bold.green('.env')} file with ${chalk.bold.green('STRAPI_ADMIN_LOCALAZY_ENV')} variable`
);
await updateEnvConfig();
installSpinner.succeed();
installSpinner.succeed(
  `To run the plugin, you need to update your webpack config in ${chalk.bold.green('src/admin/webpack.config.js')} file`
);
installSpinner.succeed(`Don't forget to build the admin panel with ${chalk.bold.green('npm run build')} command`);
