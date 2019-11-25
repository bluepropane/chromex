#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const { resolveExtConfig } = require('@chromex/utils');
const path = require('path');
const inquirer = require('inquirer');
const pkg = require('../package.json');
const ConfigUpdater = require('./ConfigUpdater');
const PageManager = require('./PageManager');
const cceProxy = require('./cceProxy');

const ALLOWED_PAGE_TYPES = {
  popup: 'popup',
  bg: 'bg',
  newtab_override: 'newtab_override',
  options: 'options',
};

program.version(pkg.version);
program.command('add [pageType]').action(async pageType => {
  const extConfig = await resolveExtConfig();
  const pageChoices = Object.values(ALLOWED_PAGE_TYPES);
  if (!pageType) {
    pageType = (
      await inquirer.prompt({
        type: 'list',
        name: 'value',
        choices: pageChoices,
        default: 0,
        message: 'Choose a page type to add:',
      })
    ).value;
  }
  if (!pageChoices.includes(pageType)) {
    console.log(`\`${pageType}\` is not a valid page type.`);
    console.log(
      `Valid page types: ${Object.values(ALLOWED_PAGE_TYPES).join('|')}`
    );
    return;
  }

  const pagesDir = path.join(extConfig.projectRoot, extConfig.srcDir, 'pages');
  const targetDir = path.join(pagesDir, pageType);

  if (fs.existsSync(targetDir)) {
    console.log(
      `\`${pageType}\` already exists (in ${targetDir}). Please remove/rename the directory first.`
    );
    return;
  }

  const configUpdater = new ConfigUpdater(extConfig);
  console.log(`Generating ${pageType} page...\n`);
  await configUpdater.addPageProperty(pageType);
  PageManager.add(pageType)
    .then(() => {
      configUpdater.commit();
      console.log(`Created ${pageType} page in ${pagesDir}`);
      console.log(`Registered ${pageType} page in extension.config.js`);
    })
    .catch(console.log);
});

program.command('remove <pageType>').action(async pageType => {
  const extConfig = await resolveExtConfig();
  if (!Object.values(ALLOWED_PAGE_TYPES).includes(pageType)) {
    console.log(`\`${pageType}\` is not a valid page type.`);
    console.log(
      `Valid page types: ${Object.values(ALLOWED_PAGE_TYPES).join('|')}`
    );
    return;
  }

  const pagesDir = path.join(extConfig.projectRoot, 'src', 'pages');
  const targetDir = path.join(pagesDir, pageType);

  if (!fs.existsSync(targetDir)) {
    console.log(`Attempted to remove non-existent directory ${targetDir}.`);
    return;
  }
  const { confirmed } = await inquirer.prompt({
    type: 'confirm',
    message: `Confirm removal of \`${pageType}\` page (in ${targetDir})?`,
    default: false,
    name: 'confirmed',
  });

  if (confirmed) {
    const configUpdater = new ConfigUpdater(extConfig);
    configUpdater.removePageProperty(pageType);
    console.log(`${await PageManager.remove(pageType)} removed`);
    configUpdater.commit();
    console.log(`Removed ${pageType} page entry from extension.config.js`);
  }
});

program.command('describe').action(async () => {
  const chromex = require('@chromex/core');
  console.log(
    'Chromex configured webpack entrypoints:',
    await chromex.injectWebpackEntrypoints()
  );

  console.log(
    'Chromex configured webpack plugins:',
    await chromex.injectWebpackPlugins()
  );
});

program.parse(process.argv);
