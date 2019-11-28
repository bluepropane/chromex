const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PostCompile = require('post-compile-webpack-plugin');

const outputDir = path.join(__dirname, 'ext');

const chromex = require('@chromex/core');
const pkg = require('./package.json');
const ext = require('./extension.config');

global.__DEV__ = process.env.NODE_ENV === 'development';

const configBuilder = async () => {
  const mainConfig = {
    context: path.join(__dirname, ext.srcDir),
    entry: {
      ...(await chromex.injectWebpackEntrypoints()),
    },
    output: {
      path: outputDir,
      filename: '[name].js',
      chunkFilename: '[id].[chunkhash].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: __DEV__,
              },
            },
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
      new webpack.DefinePlugin({
        __DEV__,
      }),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
      }),
      ...(await chromex.injectWebpackPlugins({
        HtmlWebpackPlugin,
      })),
      new MiniCssExtractPlugin({
        filename: __DEV__ ? '[name].css' : '[name].[hash].css',
        chunkFilename: __DEV__ ? '[id].css' : '[id].[hash].css',
      }),
      new PostCompile(async () => {
        console.log('[Post Compile] Generating icons for required dimensions');
        chromex.generateIcons(path.join(ext.srcDir, ext.extIcon), outputDir);
      }),
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
  };

  if (!__DEV__) {
    mainConfig.optimization.minimizer = [
      new TerserPlugin({
        // sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ];
    mainConfig.plugins.push(new webpack.HashedModuleIdsPlugin());
  }
  return mainConfig;
};
module.exports = configBuilder;
