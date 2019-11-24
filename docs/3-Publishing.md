# Publishing your extension

There are some good articles out there that guide you on publishing your extension for the world to see, e.g.: [How To Publish Your Chrome Extension](https://www.freecodecamp.org/news/how-to-publish-your-chrome-extension-dd8400a3d53/)

In general, some points to note are:
  1. There is a one-time $5 one signup fee made payable to Google if you want to be able to publish Chrome extensions. This will give you the ability to publish up to 20 extensions
  2. You are required to submit your extension packaged as a zip file. 
  3. Your extension will be published with the version number specified in your `extension.config.js`'s `manifest.version` field. By default, we will use the version number in your project's `package.json`. This allows for easier version management.

`create-chrome-extension` provides you with a convenience command to do just that:

        npm run release 

 This will 1) bump the version number in `package.json` according to [standard-version](https://github.com/conventional-changelog/standard-version), and 2) create a production-ready ZIP of your extension (named `ext.zip`) in your project root folder.