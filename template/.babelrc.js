module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: ['@babel/plugin-transform-async-to-generator'],
      },
    ],
    [
      '@babel/preset-react',
      {
        pragma: 'h',
        throwIfNamespace: false,
      },
    ],
  ],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
        alias: {
          constants: './constants.js',
          animejs: 'animejs/lib/anime.es.js',
        },
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    'lodash',
  ],
};
