const constants = require('./constants');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const JSOutputFilePlugin = require('js-output-file-webpack-plugin');
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const TerserPlugin = require('terser-webpack-plugin');

const outputDir = path.join(__dirname, 'ext');
const srcDir = path.join(__dirname, 'src');

const __DEV__ = process.env.NODE_ENV === 'development';
const gTagPath = './gtag.js';

const mainConfig = {
  context: srcDir,
  entry: {
    bundle: './MainPage/index.js',
    pagePopup: './PopupPage/index.js',
    bg: './background.js',
    gtag: gTagPath,
  },
  output: {
    path: outputDir,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // publicPath: '../',
              hmr: __DEV__,
            },
          },
          // 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')],
  },
  plugins: [
    new DashboardPlugin(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/MainPage/index.html'),
      chunks: ['bundle'],
      hash: __DEV__,
      templateParameters: {
        title: 'New Tab',
        gTagPath,
        faviconPath: '',
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/MainPage/index.html'),
      filename: constants.PAGE_POPUP_HTML_NAME,
      hash: __DEV__,
      chunks: ['pagePopup'],
      templateParameters: {
        title: 'TIL',
        gTagPath,
        faviconPath: 'icons/icon48.png',
      },
    }),
    new JSOutputFilePlugin({
      sourceFile: 'manifest.json.js',
    }),
    new GoogleFontsPlugin({
      fonts: [
        { family: 'Chau Philomene One', variants: ['400'], subsets: ['latin'] },
        { family: 'Open Sans', variants: ['400'], subsets: ['latin'] },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new WebpackShellPlugin({
      onBuildEnd: [
        `mkdir ${outputDir}/icons`,
        `node scripts/genicon.js ${srcDir}/assets/icon.png ${outputDir}/icons`,
        `cp ${srcDir}/assets/icon.png ${outputDir}/favicon.ico`,
      ],
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
};

if (!__DEV__) {
  mainConfig.optimization = {
    minimizer: [
      new TerserPlugin({
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  };
}

module.exports = mainConfig;
