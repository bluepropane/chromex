const extensionPath = './test-out/';

module.exports = {
  launch: {
    dumpio: true,
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  },
  browserContext: 'default', // or 'incognito'
};
