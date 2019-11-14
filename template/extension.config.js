const pkg = require('./package.json');

/*
  Vars on a global scope:
  PROJECT_NAME
  USER_NAME
  USER_EMAIL
*/
module.exports = {
  srcDir: 'src',
  outputDir: 'ext',
  extIcon: 'assets/icon.png',
  pages: {
    popup: {
      entrypoint: './pages/Popup/index.js',
      htmlFilename: 'popup.html',
    },
    newtab_override: {
      title: "$(PROJECT_NAME)'s New Tab",
      entrypoint: './pages/NewTab/index.js',
      htmlFilename: 'newtab.html',
    },
    // bg: {
    //   entrypoint: './pages/Bg/index.js',
    // },
  },
  name: '$(PROJECT_NAME)',
  manifest: {
    version: pkg.version,
    manifest_version: 2,
    permissions: ['storage', 'activeTab'],
    content_security_policy: `script-src 'self' ${
      global.__DEV__ ? "'unsafe-eval'" : ''
    } https://www.googletagmanager.com  https://www.google-analytics.com; object-src 'self'`,
  },
};
