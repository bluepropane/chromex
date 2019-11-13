const resolveExtConfig = require('./resolveExtConfig');
const generateIcons = require('./generateIcons');
const { PAGE_TYPES } = require('../constants');
const path = require('path');
const merge = require('lodash.merge');
const ChromexReloaderPlugin = require('@chromex/reloader');
const CreateFileWebpack = require('create-file-webpack');
const copyTemplate = require('./copyTemplate');
const { capitalize } = require('./utils');

global.__DEV__ = process.env.NODE_ENV === 'development';

async function injectWebpackPlugins({ HtmlWebpackPlugin }) {
  const ext = await resolveExtConfig();
  const plugins = Object.entries(ext.pages)
    .flatMap(([pageType, pageConf]) => {
      switch (pageType) {
        case PAGE_TYPES.POPUP:
          return new HtmlWebpackPlugin({
            template: 'pages/Popup/index.html',
            filename: pageConf.htmlFilename,
            chunks: [pageType].concat(pageConf.scripts || []),
            hash: true,
            templateParameters: {
              title: pageConf.title || 'Popup Page',
              faviconPath: '',
              ...pageConf.templateParameters,
            },
          });
        case PAGE_TYPES.NEWTAB_OVERRIDE:
          return new HtmlWebpackPlugin({
            template: 'pages/NewTab/index.html',
            filename: pageConf.htmlFilename,
            chunks: [pageType, 'reloader'].concat(pageConf.scripts || []),
            hash: true,
            templateParameters: {
              title: pageConf.title || 'New Tab',
              faviconPath: '',
              ...pageConf.templateParameters,
            },
          });
        case PAGE_TYPES.RELOADER:
          return new ChromexReloaderPlugin();
        default:
          return null;
      }
    })
    .filter(plugins => !!plugins);

  // Plugin for generating manifest file
  plugins.push(
    new CreateFileWebpack({
      path: ext.outputDir,
      fileName: 'manifest.json',
      content: JSON.stringify(
        {
          ...(await configureManifest()),
          ...ext.manifest,
        },
        null,
        2
      ),
    })
  );

  console.log('chromex configured plugins:', plugins);
  return plugins;
}

async function injectWebpackEntrypoints() {
  const ext = await resolveExtConfig();
  let entrypoints = Object.entries(ext.pages).map(([pageType, pageConf]) => {
    switch (pageType) {
      case PAGE_TYPES.RELOADER:
        return {
          reloader: './lib/reloader-proxy.js',
        };
      default:
        return {
          [pageType]: pageConf.entrypoint,
        };
    }
  });

  console.log('chromex configured entrypoints:', merge({}, ...entrypoints));

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
            permissions: ['management', 'tabs'],
          };
        case PAGE_TYPES.OPTIONS:
          return {
            options_page: pageConf.htmlFilename,
          };
        case PAGE_TYPES.NEWTAB_OVERRIDE:
          return {
            chrome_url_overrides: {
              newtab: pageConf.htmlFilename,
            },
          };
        default:
          return {};
      }
    }
  );

  const manifest = merge(
    {
      name: ext.name,
    },
    ...manifestDiffs
  );
  console.log('chromex configured manifest fields:', manifest);
  return manifest;
}

async function generatePage(pageType, outputDir) {
  const ext = await resolveExtConfig();
  const targetDirName = capitalize(pageType);
  await copyTemplate(
    path.join(__dirname, `./boilerplates/${targetDirName}`),
    path.join(outputDir, targetDirName),
    {
      PROJECT_NAME: ext.name,
    }
  );
}

module.exports = {
  resolveExtConfig,
  injectWebpackPlugins,
  injectWebpackEntrypoints,
  configureManifest,
  generateIcons,
  generatePage,
  copyTemplate,
};
