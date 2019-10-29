/*
  Vars on a global scope:
  PROJECT_NAME
  USER_NAME
  USER_EMAIL
*/
module.exports = {
  srcDir: 'src',
  outputDir: 'ext',
  pages: {
    popup: {
      title: '$(PROJECT_NAME)',
      entrypoint: './pages/Popup/index.js',
      htmlFilename: 'popup.html',
    },
  },
  name: '$(PROJECT_NAME)',
  manifest: {
    icons: {
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png',
    },
    // options_page: 'dist/options_custom.html',
    // chrome_url_overrides: {
    //   newtab: 'index.html',
    // },
    permissions: ['tabs'],
  },
};
