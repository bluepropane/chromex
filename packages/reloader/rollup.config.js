// const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
// const json = require('rollup-plugin-json');
const resolve = require('rollup-plugin-node-resolve');

const __DEV__ = process.env.NODE_ENV === 'development';

module.exports = {
  input: 'src/plugin.js',
  output: {
    file: 'dist/plugin.js',
    format: 'cjs',
  },
  plugins: [
    // json({
    //   preferConst: true,
    //   compact: true,
    // }),
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
};
