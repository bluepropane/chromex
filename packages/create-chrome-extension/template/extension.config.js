const pkg = require('./package.json');

module.exports = {
  srcDir: 'src',
  outputDir: 'ext',
  extIcon: 'assets/icon.png',
  liveReload: true,
  pages: { popup: {}, options: {} },

  name: '$(PROJECT_NAME)',
  manifest: {
    version: pkg.version,
    permissions: ['storage', 'activeTab'],
    content_security_policy: `script-src 'self' ${
      global.__DEV__ ? "'unsafe-eval'" : '' // unsafe-eval CSP is required in dev mode since webpack uses eval sourcemaps
    }; object-src 'self'`,
  },
};
