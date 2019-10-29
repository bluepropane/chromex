const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const resolve = require('rollup-plugin-node-resolve');
const builtins = require('rollup-plugin-node-builtins');

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
    plugins: [
      json({
        preferConst: true,
        compact: true,
      }),
      resolve(),
      commonjs({
        include: 'node_modules/**',
      }),
    ],
  },
  {
    input: 'src/hot/client.js',
    output: {
      file: 'dist/hot/client.js',
      format: 'cjs',
    },
  },
  {
    input: 'src/hot/plugin.js',
    output: {
      file: 'dist/hot/plugin.js',
      format: 'cjs',
    },
    plugins: [
      json({
        preferConst: true,
        compact: true,
      }),
      resolve(),
      commonjs({
        include: 'node_modules/**',
      }),
    ],
  },
];
