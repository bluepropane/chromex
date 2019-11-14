/* global __DEV__ */
global.__DEV__ = process.env.NODE_ENV === 'development';

const resolveExtConfig = require('./resolveExtConfig');
const generateIcons = require('./generateIcons');
const { PAGE_TYPES, ICON_OUTPUT_SIZES } = require('../constants');
const path = require('path');
const merge = require('lodash.merge');
const ChromexReloaderPlugin = require('@chromex/reloader');
const CreateFileWebpack = require('create-file-webpack');
const copyTemplate = require('./copyTemplate');
const { dimensionedIconNames, getPageDir } = require('./utils');

async function injectWebpackPlugins({ HtmlWebpackPlugin }) {
  const ext = await resolveExtConfig();
  const plugins = Object.entries(ext.pages)
    .flatMap(([pageType, pageConf]) => {
      const pageDir = getPageDir(pageType);
      switch (pageType) {
        case PAGE_TYPES.POPUP:
          return new HtmlWebpackPlugin({
            template: path.join(pageDir, 'index.html'),
            filename: `${pageType}.html`,
            chunks: [pageType, 'vendor'].concat(pageConf.bundles),
            hash: true,
            templateParameters: pageConf.templateParameters,
          });
        case PAGE_TYPES.NEWTAB_OVERRIDE:
          return new HtmlWebpackPlugin({
            template: path.join(pageDir, 'index.html'),
            filename: `${pageType}.html`,
            chunks: [pageType, 'vendor'].concat(
              pageConf.bundles,
              __DEV__ ? ['reloader'] : []
            ),
            hash: true,
            templateParameters: {
              title: "$(PROJECT_NAME)'s New Tab",
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
    const pageDir = getPageDir(pageType);
    switch (pageType) {
      case PAGE_TYPES.RELOADER:
        return {
          reloader: require.resolve('@chromex/reloader/client', {
            path: ext.projectRoot,
          }),
        };
      default:
        return {
          [pageType]: path.join(
            ext.projectRoot,
            ext.srcDir,
            pageDir,
            'index.js'
          ),
        };
    }
  });

  console.log('chromex configured entrypoints:', merge({}, ...entrypoints));

  return merge({}, ...entrypoints);
}

async function configureManifest() {
  const ext = await resolveExtConfig();
  const icons = dimensionedIconNames(ext.extIcon, ICON_OUTPUT_SIZES, {
    fileExt: '.png',
  });
  const manifestDiffs = Object.entries(ext.pages).map(
    ([pageType, pageConf]) => {
      const pageDir = getPageDir(pageType);
      switch (pageType) {
        case PAGE_TYPES.POPUP:
          return {
            browser_action: {
              default_icon: icons,
              default_title: pageConf.title,
              default_popup: path.join(pageDir, 'index.html'),
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
              newtab: `${pageType}.html`,
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
      icons,
    },
    ...manifestDiffs
  );
  console.log('chromex configured manifest fields:', manifest);
  return manifest;
}

async function generatePage(pageType, outputDir) {
  const ext = await resolveExtConfig();
  await copyTemplate(
    path.join(__dirname, 'boilerplates', pageType),
    path.join(outputDir, pageType),
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
