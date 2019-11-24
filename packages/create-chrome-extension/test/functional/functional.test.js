function main() {
  const puppeteer = require('puppeteer');

  const CRX_PATH = '/path/to/crx/folder/';

  puppeteer
    .launch({
      headless: false, // extensions only supported in full chrome.
      args: [
        `--disable-extensions-except=${CRX_PATH}`,
        `--load-extension=${CRX_PATH}`,
        '--user-agent=PuppeteerAgent',
      ],
    })
    .then(async browser => {
      // ... do some testing ...
      await browser.close();
    });
}
