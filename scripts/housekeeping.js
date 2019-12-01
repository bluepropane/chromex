#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const pkgPath = path.join(process.cwd(), 'package.json');
const pkg = require(pkgPath);
console.log(pkg.name);

const commonFields = {
  repository: 'https://github.com/bluepropane/chromex',
  author: 'bluepropane <rbluepropane@gmail.com>',
  license: 'MIT',
  keywords: [
    'chrome-extension',
    'chrome',
    'boilerplate',
    'livereload',
    'live-reload',
    'extension',
  ],
};

Object.assign(pkg, commonFields);

fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), console.log);
