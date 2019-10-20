const pkg = require('../package.json');

module.exports = env => {
  const DEV = env === 'development';
  const manifest = {
    name: '$(PROJECT_NAME)',
    version: pkg.version,
    manifest_version: 2,
    icons: {
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png',
    },
    background: {
      scripts: ['bg.js'],
      persistent: false,
    },
    // options_page: 'dist/options_custom.html',
    chrome_url_overrides: {
      newtab: 'index.html',
    },
    permissions: [],
    browser_action: {
      default_icon: {
        '16': 'icons/icon16.png',
        '19': 'icons/icon19.png',
        '48': 'icons/icon48.png',
      },
      default_title: 'Today I learned',
      // default_popup: 'dist/index.html'
    },
  };
  manifest['content_security_policy'] = `script-src 'self' ${
    DEV ? "'unsafe-eval'" : ''
  } https://www.googletagmanager.com  https://www.google-analytics.com; object-src 'self'`;
  return manifest;
};
