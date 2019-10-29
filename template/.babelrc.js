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
