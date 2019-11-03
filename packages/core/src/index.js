const resolveExtConfig = require('./resolveExtConfig');
const generateIcons = require('./generateIcons');
const { PAGE_TYPES } = require('./constants');
const path = require('path');
const merge = require('lodash.merge');
const CCEReloaderPlugin = require('@chromex/reloader/plugin');

async function injectWebpackPlugins({ HtmlWebpackPlugin, JSOutputFilePlugin }) {
  const ext = await resolveExtConfig();
  const plugins = Object.entries(ext.pages)
    .flatMap(([pageType, pageConf]) => {
      switch (pageType) {
        case PAGE_TYPES.POPUP:
          const chunks = [pageType, 'reloader'].concat(pageConf.scripts || []);
          return new HtmlWebpackPlugin({
            template: 'pages/Popup/index.html',
            filename: `popup.html`,
            chunks,
            hash: true,
            templateParameters: {
              title: pageConf.title || 'Popup Page',
              gTagPath: path.join(ext.outputDir, 'gtag.js'),
              faviconPath: '',
              ...pageConf.templateParameters,
            },
          });
        case PAGE_TYPES.RELOADER:
          return new CCEReloaderPlugin();
        default:
          return null;
      }
    })
    .filter(plugins => !!plugins);

  // Plugin for generating manifest file

  console.log('CCE configured plugins:', plugins);
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
      case PAGE_TYPES.RELOADER:
        return {
          reloader: './lib/reloader-proxy.js',
        };
      default:
        return {};
    }
  });

  console.log('CCE configured entrypoints:', merge({}, ...entrypoints));

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
              default_popup: pageConf.htmlFilename,
            },
          };
        case PAGE_TYPES.BG:
          return {
            background: {
              scripts: ['bg.js'],
              persistent: false,
            },
          };
        case PAGE_TYPES.RELOADER:
          return {
            background: {
              scripts: ['reloader.js'],
            },
            permissions: ['management', 'tabs'],
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
