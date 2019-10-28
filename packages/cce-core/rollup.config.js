const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

const __DEV__ = process.env.NODE_ENV === 'development';

module.exports = [
  {
    input: 'src/index.js',
    output: {
      file: `dist/index.js`,
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
    external: [
      'child_process',
      'stream',
      'http',
      'url',
      'https',
      'zlib',
      'path',
      'fs',
      'btoa',
    ],
    // plugins: [resolve(), commonjs()],
  },
  {
    input: 'src/hot/bg.js',
    output: {
      file: 'dist/hot/bg.js',
      format: 'iife',
    },
  },
];
