const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const json = require('@rollup/plugin-json');

const __DEV__ = process.env.NODE_ENV === 'development';

module.exports = {
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
  plugins: [
    babel({
      extends: require.resolve('./.babelrc'),
      plugins: ['@babel/plugin-transform-runtime'],
      exclude: ['node_modules/**'],
      runtimeHelpers: true,
    }),
    json(),
    resolve(),
    commonjs({
      exclude: /node_modules/,
    }),
  ],
};
