const puppeteer = require('puppeteer');
const path = require('path');

function main() {
  const CRX_PATH = path.join(__dirname, '..', 'ext');

  puppeteer
    .launch({
      // testing of extensions currently not supported in headless mode. https://github.com/GoogleChrome/puppeteer/blob/v2.0.0/docs/api.md#working-with-chrome-extensions
      headless: false,
      args: [
        `--disable-extensions-except=${CRX_PATH}`,
        `--load-extension=${CRX_PATH}`,
      ],
    })
    .then(async browser => {
      // ... do some testing ...
      // await browser.close();
    });
}

describe('$(MY_PROJECT)', () => {
  it('should load extension successfully ', async () => {
    browser.newPage();
    await jestPuppeteer.debug();
    expect();
  });
});
