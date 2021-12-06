const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const ArcGISPlugin = require('@arcgis/webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyPlugin = require('copy-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const path = require('path');

/**
 * Application options.
 */

// Application information.
const title = 'COMPA JS V2';
const description = 'COMPA JS V2';
const themeColor = '#007ac2';
const deployUrl = 'http://localhost:8080/';
const appImageUrl = 'socialcard.png';

// HTML plugin options for index.ejs. Primarily for title and meta tags.
// Mixes in...be careful.
// https://github.com/jantimon/html-webpack-plugin#options
const indexHtml = {
  hash: true,
  title,
  meta: {
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'theme-color': themeColor,
    'og:url': deployUrl,
    'og:type': 'website',
    'og:site_name': title,
    'og:title': title,
    'og:description': description,
    'og:image': appImageUrl,
  },
};

/**
 * Webpack options.
 */

// Output public path.
// Single page/routing apps must set to '/'.
// https://webpack.js.org/configuration/output/#outputpublicpath
const outputPublicPath = '';

// Dev server options.
// https://webpack.js.org/configuration/dev-server/
const devServer = {
  static: ['dist'],
  // historyApiFallback: true, // single page/routing apps
  compress: true,
  port: 8080,
  open: true
};

// Webpack devtool for source map generation.
// https://webpack.js.org/configuration/devtool/
const developmentDevtool = 'inline-source-map';
const productionDevtool = false;

// Add any aliases to config.resolve.
// Useful for aliasing packages or paths in source.
// https://webpack.js.org/configuration/resolve/#resolvealias
const resolveAlias = {
  app: path.resolve(__dirname, 'src'),
};

// Workbox service workers.
// Important! Read up on and understand Workbox before use: https://developers.google.com/web/tools/workbox
// There are potential browser cache pitfalls and other repercussions for deploying an app with Workbox.
const workbox = false;
// Exclude files or patterns from Workbox.
const workboxExcludes = [];

/**
 * Webpack configuration.
 *
 * Editing only required to add additional plugins or effect how Webpack operates.
 */
module.exports = (_, args) => {
  const mode = args.mode;

  const config = {
    // https://webpack.js.org/configuration/node/
    node: false,

    // Entry points.
    entry: {
      index: ['./src/css/main.scss', '@babel/polyfill', './src/index.ts'],
    },

    // Output parameters.
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[chunkhash].js',
      chunkFilename: 'chunks/[id].js',
      publicPath: outputPublicPath,
    },

    // Development server parameters (provided in Webpack options above).
    devServer,

    devtool: mode === 'development' ? developmentDevtool : productionDevtool,

    // Optimize output in production only.
    optimization: {
      minimize: mode === 'production',
      splitChunks: { minChunks: Infinity, chunks: 'all' },
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      runtimeChunk: {
        name: 'runtime',
      },
    },

    // Module handling and loaders.
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(ttf|eot|svg|png|jpg|gif|ico|wsv|otf|woff(2)?)(\?[a-z0-9]+)?$/,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                url: false,
                importLoaders: 2,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },

    // Configure how modules are resolved.
    resolve: {
      modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
      alias: resolveAlias || {},
      extensions: ['.ts', '.tsx', '.js', '.scss', '.css'],
    },

    // Webpack plugins.
    plugins: [
      new CleanWebpackPlugin(),

      new ArcGISPlugin({ 
        locales: ['fr'],
        copyAssets: false
       }),

      new HtmlWebPackPlugin({
        template: './src/index.ejs',
        filename: 'index.html',
        favicon: './src/assets/favicon.ico',
        chunksSortMode: 'none',
        mode: mode,
        showErrors: mode === 'development',
        ...indexHtml,
      }),

      new HtmlWebPackPlugin({
        template: './src/oauth-callback.html',
        filename: 'oauth-callback.html',
        inject: false,
      }),

      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].css',
        chunkFilename: '[id].css',
      }),

      new HTMLInlineCSSWebpackPlugin({
        filter: (fileName) => {
          return fileName.includes('index');
        },
      }),

      new WebpackPwaManifest({
        name: 'COMPA JS V2',
        short_name: 'Compa',
        description: 'COMPA JS V2',
        background_color: '#1F529F',
        theme_color: '#1F529F',
        ios: true,
        icons: [
          {
            src: path.resolve('src/assets/icon.png'),
            sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
          },
        ],
      }),

      new CopyPlugin({
        patterns: [
          { from: 'src/config', to: 'config' },
          {
            context: 'src/assets/',
            from: '**/*',
            to: 'assets',
          },
        ],
      }),
    ],
  };

  // Workbox plugin.
  if (mode === 'production' && workbox) {
    config.plugins.push(
      new GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        exclude: [...workboxExcludes],
      }),
    );
  }

  return config;
};
