#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import shell from 'shelljs';
import { createRequire } from 'module';

// To prevent node experimental features warning after `import(package.json)` require is used instead.
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

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
const file = `${chalk.bold.green('webpack.config.example.js')}`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const template = (await fs.readFile(path.join(__dirname, 'webpack.js'))).toString();
const installSpinner = ora();

const install = () => new Promise((resolve, reject) => {
  try {
    shell.exec(`npm install ${pkg.name}`, { silent: true }, () => {
      resolve();
    });
  } catch (err) {
    reject(err);
  }
});

const updateConfig = () => new Promise((resolve, reject) => {
  try {
    shell.exec(`echo "${template}" > src/admin/webpack.config.example.js`, { silent: true }, () => {
      resolve();
    });
  } catch (err) {
    reject(err);
  }
});

console.log(banner);

installSpinner.start(`Installing ${name}${version}`);
await install();
installSpinner.succeed();

installSpinner.start(`Updating ${file}`);
await updateConfig();
installSpinner.succeed();
