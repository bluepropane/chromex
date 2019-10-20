const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

const __DEV__ = process.env.NODE_ENV === 'development';

if (__DEV__) {
  console.log('Robin is running in dev mode');
}

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
    resolve(),
    commonjs(),
  ],
};
