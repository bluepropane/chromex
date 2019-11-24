const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const parserConfig = {
  plugins: ['decorators-legacy', 'objectRestSpread', 'dynamicImport'],
  sourceType: 'module',
};
const fs = require('fs');
const prettier = require('prettier');

class ConfigUpdater {
  constructor(extConfig) {
    this.extConfig = extConfig;

    this.initialized = this.init();
  }

  async init() {
    this.confFileString = (
      await fs.promises.readFile(this.extConfig.configPath)
    ).toString();
    this.ast = parse(this.confFileString, parserConfig);
    this.prettierConfig =
      (await prettier
        .resolveConfig(this.extConfig.configPath)
        .catch(_ => {})) || {};

    return;
  }

  async commit() {
    await this.initialized;
    const output = generate(this.ast, {
      retainLines: true,
      retainFunctionParens: true,
    }).code;
    fs.promises.writeFile(
      this.extConfig.configPath,
      prettier.format(output, this.prettierConfig)
    );
  }

  async exec(visitors) {
    await this.initialized;
    traverse(this.ast, visitors);
  }

  async addPageProperty(pageName) {
    this.exec({
      ObjectProperty(path) {
        if (path.node.key.name === 'pages') {
          // extConfig.pages
          let targetExists = false;
          path.traverse({
            ObjectProperty(p2) {
              if (p2.node.key.name === pageName) {
                // extConfig.pages[pageName]
                targetExists = true;
                p2.stop();
              }
            },
          });
          if (!targetExists) {
            const member = t.objectProperty(
              t.stringLiteral(pageName),
              t.objectExpression([])
            );
            path.get('value').pushContainer('properties', member);
          }
        }
        // We only want top level properties from the config, so prevent further traversal
        path.skip();
      },
    });
  }

  async removePageProperty(pageName) {
    this.exec({
      ObjectProperty(path) {
        if (path.node.key.name === 'pages') {
          // extConfig.pages
          path.traverse({
            ObjectProperty(p2) {
              if (p2.node.key.name === pageName) {
                // extConfig.pages[pageName]
                p2.remove();
              }
            },
          });
        }
        // We only want top level properties from the config, so prevent further traversal
        path.skip();
      },
    });
  }
}

module.exports = ConfigUpdater;
