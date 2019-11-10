const pkg = require('../package.json');
const chromex = require('@chromex/core');

module.exports = async env => {
  const DEV = env === 'development';
  const manifest = {
    ...(await chromex.configureManifest()),
    name: '$(PROJECT_NAME)',
    version: pkg.version,
    manifest_version: 2,
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
  };
  manifest['content_security_policy'] = `script-src 'self' ${
    DEV ? "'unsafe-eval'" : ''
  } https://www.googletagmanager.com  https://www.google-analytics.com; object-src 'self'`;
  return manifest;
};
