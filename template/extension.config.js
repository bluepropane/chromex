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
    popup: {},
    newtab_override: {
      title: "$(PROJECT_NAME)'s New Tab",
    },
    bg: {},
  },
  name: '$(PROJECT_NAME)',
  manifest: {
    version: pkg.version,
    manifest_version: 2,
    permissions: ['storage', 'activeTab'],
    content_security_policy: `script-src 'self' ${
      global.__DEV__ ? "'unsafe-eval'" : '' // unsafe-eval CSP is required in dev mode since webpack uses eval sourcemaps
    }; object-src 'self'`,
  },
};
