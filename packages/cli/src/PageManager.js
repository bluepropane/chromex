const path = require('path');
const { resolveExtConfig } = require('@chromex/core');
const { copyTemplate } = require('@chromex/utils');
const del = require('del');

async function add(pageType) {
  const extConfig = await resolveExtConfig();
  const outputDir = path.join(extConfig.projectRoot, extConfig.srcDir, 'pages');
  await copyTemplate(
    path.join(__dirname, 'boilerplates', pageType),
    path.join(outputDir, pageType),
    {
      PROJECT_NAME: extConfig.name,
    }
  );
}

async function remove(pageType, dryRun = false) {
  const extConfig = await resolveExtConfig();
  const targetDir = path.join(
    extConfig.projectRoot,
    extConfig.srcDir,
    'pages',
    pageType
  );
  return del([targetDir], { dryRun });
}

module.exports = {
  add,
  remove,
};
