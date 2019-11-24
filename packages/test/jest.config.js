const path = require('path');

process.env.JEST_PUPPETEER_CONFIG = path.join(
  __dirname,
  'jest-puppeteer.config.js'
);

module.exports = {
  preset: 'jest-puppeteer',
};
