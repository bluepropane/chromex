const path = require('path');

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
      // entrypoint: 'src/Popup/index.html'
      // htmlFilename: 'popup.html'
    },
  },
};
