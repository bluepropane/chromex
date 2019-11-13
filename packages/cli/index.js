#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const chromex = require('@chromex/core');
const { PAGE_TYPES } = require('@chromex/core/constants');
const path = require('path');
const inquirer = require('inquirer');

program.command('add [pageType]').action(async pageType => {
  const pageChoices = Object.values(PAGE_TYPES);
  if (!pageType) {
    pageType = (await inquirer.prompt({
      type: 'list',
      name: 'value',
      choices: pageChoices,
      default: 0,
      message: 'Choose a page type to add:',
    })).value;
  }
  const extConfig = await chromex.resolveExtConfig();
  if (!pageChoices.includes(pageType)) {
    console.log(`\`${pageType}\` is not a valid page type.`);
    console.log(`Valid page types: ${Object.values(PAGE_TYPES).join('|')}`);
    return;
  }

  const pagesDir = path.join(extConfig.projectRoot, 'src/pages');
  const targetDir = path.join(pagesDir, pageType);

  if (fs.existsSync(targetDir)) {
    console.log(
      `\`${pageType}\` already exists (in ${targetDir}). Please remove/rename the directory first.`
    );
    return;
  }
  console.log(pageType, extConfig);
  await chromex.generatePage(pageType, pagesDir);
});

program.command('remove <pageType>').action(async pageType => {
  const extConfig = await chromex.resolveExtConfig();
  if (!Object.values(PAGE_TYPES).includes(pageType)) {
    console.log(`\`${pageType}\` is not a valid page type.`);
    console.log(`Valid page types: ${Object.values(PAGE_TYPES).join('|')}`);
    return;
  }

  const pagesDir = path.join(extConfig.projectRoot, 'src/pages');
  const targetDir = path.join(pagesDir, pageType);

  if (fs.existsSync(targetDir)) {
    const { confirmed } = await inquirer.prompt({
      type: 'confirm',
      message: `Confirm removal of \`${pageType}\` page (in ${targetDir})?`,
      default: false,
      name: 'confirmed',
    });
    console.log(confirmed);
  }
});

program.parse(process.argv);
