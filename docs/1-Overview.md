***NOTE**: Before you proceed, it is recommended that you have some basic knowledge of [chrome extensions and how they are developed](https://developer.chrome.com/extensions). However, it's not a must!*

`create-chrome-extension` takes a very declarative approach to building your extension: Most of the extension-related logic is defined in a configuration file named **`extension.config.js`**.

Let's quickly run through the directory structure in `my-extension` that you've generated (from [Quickstart](../README.md#quickstart)):

```
├── ext/
├── src/
│   ├── assets/
│   ├── pages/
│   │   ├── popup/
├── .babelrc.js
├── .eslintrc.js
├── .gitignore
├── .prettierrc.js
├── extension.config.js
├── package.json
├── README.md
└── webpack.config.js
```


- `extension.config.js`: Under the hood, `create-chrome-extension` uses a custom built JS library called `Chromex` that will look for this  `extension.config.js` configuration file in your project folder, do some heavy lifting based on it, and generate the appropriate files required for your chrome extension to work (e.g. `manifest.json`, icons, HTML/CSS/JS files).

  This is the reason why, as you might have noticed, the `manifest.json` file is not used in the source code. Instead, we specify it as the `manifest` property of the configuration object exported in `extension.config.js`.
---
- `package.json`: This file is used by package managers to manage the node ecosystem specific to your project directory. Read more [here](https://docs.npmjs.com/files/package.json).
---
- `ext/`: This is where your "end product" goes. It contains bundled code that follows [the chrome extension structure](https://developer.chrome.com/extensions/overview#arch), i.e. you can [load an unpacked extension in chrome](https://developer.chrome.com/extensions/getstarted#manifest) by selecting this folder, or [literally zip it and submit to the chrome web store for publishing](https://developer.chrome.com/webstore/publish#create-your-apps-zip-file). However, we're not gonna do that now.

  **Notes:**
  - *You should not be editing any of the files in `ext/` manually. They are generated in the build process and anything you edit here will be overwritten!*
  - If you have followed the official [Getting Started Tutorial][chrome-getting-started-url] for chrome extensions, you will find that the contents in this folder to be very similar to it.

---
- `src/pages/`: This is where the bulk of your app's source code is kept. Each subdirectory in this directory should represent a component of your extension. *As an extension developer, most of the changes you make should be in this directory.*
---
- `.*`: The files that start with a period (`.`) are considered hidden files. You typically do not have to touch them as they are configured out of the box. However, go ahead and edit them if it fits your use case and you know what you're doing. 
---
- `webpack.config.js`: [webpack](https://webpack.js.org) is used under the hood to bundle your extension; you can view the webpack-specific settings in this file. Again, this should work out of the box, but if you require a more advanced webpack configuration this would be the file to change.


It is recommended to stick to this directory structure unless you have special requirements not to do so. 

Now that we have familiarized ourselves with the directory contents, let's move on to customizing your extension!



[chrome-getting-started-url]: https://developer.chrome.com/extensions/getstarted