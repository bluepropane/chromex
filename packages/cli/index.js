#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const chromex = require('@chromex/core');
const { PAGE_TYPES } = require('@chromex/core/constants');
const path = require('path');

program.command('generate <pageType>').action(async pageType => {
  const extConfig = await chromex.resolveExtConfig();
  if (!Object.values(PAGE_TYPES).includes(pageType)) {
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

program.parse(process.argv);
