Let's take a look in the `src/pages` directory of your extension. You should see one folder named `popup`. This folder contains code related to the example browser action popup that you have seen earlier.

## Defining a new extension page

Your generated extension project comes with a lightweight Chromex CLI that can be used to conveniently generate boilerplate for new extension pages. We will use the CLI to generate a [new tab override](https://developer.chrome.com/extensions/override) page. In your project root, run the following command:

    npx chromex add newtab_override

Or, if you are using yarn:

    yarn chromex add newtab_override