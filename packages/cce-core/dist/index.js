#!/usr/bin/env node
'use strict';

const resolveExtConfig = require('./resolveExtConfig');
const generateIcons = require('./generateIcons');
const { PAGE_TYPES } = require('./constants');
const path = require('path');
const merge = require('lodash.merge');
const CCEHotReloadPlugin = require('./CCEHotReloadPlugin');

async function injectWebpackPlugins({ HtmlWebpackPlugin, JSOutputFilePlugin }) {
  const ext = await resolveExtConfig();
  const plugins = Object.entries(ext.pages)
    .flatMap(([pageType, pageConf]) => {
      switch (pageType) {
        case PAGE_TYPES.POPUP:
          return new HtmlWebpackPlugin({
            template: 'Popup/index.html',
            filename: `popup.html`,
            chunks: [pageConf.entrypoint].concat(pageConf.scripts || []),
            hash: true,
            templateParameters: {
              title: pageConf.title || 'Popup Page',
              gTagPath: path.join(ext.srcDir, 'gtag.js'),
              faviconPath: '',
              ...pageConf.templateParameters,
            },
          });
        case PAGE_TYPES.RELOADER_BG:
          return new CCEHotReloadPlugin();
        default:
          return null;
      }
    })
    .filter(plugins => !!plugins);

  console.log(plugins);
  return plugins;
}

async function injectWebpackEntrypoints() {
  const ext = await resolveExtConfig();
  let entrypoints = Object.entries(ext.pages).map(([pageType, pageConf]) => {
    switch (pageType) {
      case PAGE_TYPES.POPUP:
        return {
          popup: pageConf.entrypoint,
        };
      case PAGE_TYPES.RELOADER_BG:
        return {
          reloaderBg: './lib/reloader-bg.js',
        };
      default:
        return {};
    }
  });

  console.log(merge({}, ...entrypoints));

  return merge({}, ...entrypoints);
}

async function configureManifest() {
  const ext = await resolveExtConfig();

  const manifestDiffs = Object.entries(ext.pages).map(
    ([pageType, pageConf]) => {
      switch (pageType) {
        case PAGE_TYPES.POPUP:
          return {
            browser_action: {
              default_icon: {
                '16': 'icons/icon16.png',
                '19': 'icons/icon19.png',
                '48': 'icons/icon48.png',
              },
              default_title: pageConf.title,
              default_popup: path.join(ext.outputDir, pageConf.htmlFilename),
            },
          };
        case PAGE_TYPES.BG:
          return {
            background: {
              scripts: ['bg.js'],
              persistent: false,
            },
          };
        case PAGE_TYPES.RELOADER_BG:
          return {
            background: {
              scripts: ['reloaderBg.js'],
            },
          };
        default:
          return {};
      }
    }
  );

  const manifest = merge({}, ...manifestDiffs);
  console.log('CCE configured manifest fields:', manifest);
  return manifest;
}

module.exports = {
  resolveExtConfig,
  injectWebpackPlugins,
  injectWebpackEntrypoints,
  configureManifest,
  generateIcons,
};
