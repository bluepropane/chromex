const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const JSOutputFilePlugin = require('js-output-file-webpack-plugin');
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PostCompile = require('post-compile-webpack-plugin');

const outputDir = path.join(__dirname, 'ext');

const chromex = require('@chromex/core');
const pkg = require('./package.json');
const ext = require('./extension.config');

const __DEV__ = process.env.NODE_ENV === 'development';

const configBuilder = async () => {
  const mainConfig = {
    context: path.join(__dirname, ext.srcDir),
    entry: {
      ...(await chromex.injectWebpackEntrypoints()),
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
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
      }),
      new JSOutputFilePlugin({
        sourceFile: 'manifest.json.js',
      }),
      ...(await chromex.injectWebpackPlugins({
        HtmlWebpackPlugin,
        JSOutputFilePlugin,
      })),
      // new GoogleFontsPlugin({
      //   fonts: [
      //     {
      //       family: 'Chau Philomene One',
      //       variants: ['400'],
      //       subsets: ['latin'],
      //     },
      //     { family: 'Open Sans', variants: ['400'], subsets: ['latin'] },
      //   ],
      // }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new PostCompile(async () => {
        console.log('Generating icons for required dimensions...');
        await fs.promises.mkdir(path.join(outputDir, 'icons')).catch(err => {
          // EEXIST: Thrown when re-bundling is triggered and `icons` dir already exists. We don't care about this, so just proceed
          console.debug('[Post Compile]', err);
        });
        chromex.generateIcons(
          `${ext.srcDir}/assets/icon.png`,
          `${outputDir}/icons`
        );
        fs.promises.copyFile(
          path.join(__dirname, ext.srcDir, 'assets', 'icon.png'),
          path.join(outputDir, 'favicon.ico')
        );
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
  return mainConfig;
};
module.exports = configBuilder;
