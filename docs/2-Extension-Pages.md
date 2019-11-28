# Customizing Extension Pages

Let's take a look in the `src/pages` directory of your extension. You should see one folder named `popup`. This folder contains code related to the example browser action popup that you have seen earlier.

## Defining a new extension page

Your generated extension project comes with a lightweight Chromex CLI that can be used to conveniently generate boilerplate for new extension pages. We will use the CLI to generate a [new tab override](https://developer.chrome.com/extensions/override) page. In your project root, run the following command:

    npx chromex add newtab_override

Or, if you are using yarn:

    yarn chromex add newtab_override

Two things happen here:
1. The page boilerplate is generated in `src/pages/newtab_override`
2. The `newtab_override` config entry is generated in `extension.config.js`'s `pages` property.

If you have your development environment (`npm run dev`) running, try navigating to a new tab in chrome. You should see that your default new tab page has been overriden by your very own New Tab page!


## Page Config API

The following properties are generic to all page types:

### `popup`: browser action Popup
[Chrome documentation](https://developer.chrome.com/extensions/browserAction)


### `bg`: background script
[Chrome documentation](https://developer.chrome.com/extensions/background_pages)

### `newtab_override`: new tab override
[Chrome documentation](https://developer.chrome.com/extensions/override)

### `options`: options page
[Chrome documentation](https://developer.chrome.com/extensions/options)
- `embedded` {Boolean} if `true`, will use an embedded options page as described [here](https://developer.chrome.com/extensions/options#declare_options). Full page options will be used if otherwise.