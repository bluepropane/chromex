const path = require('path');
const CRX_PATH = path.join(__dirname, '../../template', 'ext');

module.exports = {
  launch: {
    dumpio: true,
    headless: false,
    args: [
      `--disable-extensions-except=${CRX_PATH}`,
      `--load-extension=${CRX_PATH}`,
    ],
  },
};
