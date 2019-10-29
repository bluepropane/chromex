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
};
