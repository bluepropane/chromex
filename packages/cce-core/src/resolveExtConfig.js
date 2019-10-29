const findUp = require('find-up');
const fs = require('fs');
const { PAGE_TYPES } = require('./constants');
const merge = require('lodash.merge');

let cachedConfig = null;

function normalizePageConf(pageConfs) {
  const normalizedPageConfs = Object.entries(pageConfs).map(
    ([pageType, pageConf]) => {
      const defaultConf = {
        templateParameters: {},
      };

      switch (pageType) {
        case PAGE_TYPES.POPUP:
          defaultConf.title = 'Popup Page';
          defaultConf.entrypoint = './Popup/index.js';
          defaultConf.htmlFilename = 'popup.html';
          break;
        default:
          break;
      }
      return {
        [pageType]: {
          ...defaultConf,
          ...pageConf,
        },
      };
    }
  );

  normalizedPageConfs.push({ [PAGE_TYPES.RELOADER_BG]: true });

  return merge({}, ...normalizedPageConfs);
}

async function resolveExtConfig() {
  if (cachedConfig) return cachedConfig;
  const extConfigPath = await findUp('extension.config.js');

  if (!extConfigPath) {
    throw new Error(
      'No extension.config.js found! Are you in a create-chrome-extension directory?'
    );
  }

  try {
    const config = require(extConfigPath);
    config.pages = normalizePageConf(config.pages);
    cachedConfig = config;
    return config;
  } catch (err) {
    throw new Error('[Config file corrupted] ' + err);
  }
}

module.exports = resolveExtConfig;