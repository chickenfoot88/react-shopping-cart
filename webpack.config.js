const HtmlWebpackPlugin     = require('html-webpack-plugin');
const path                  = require('path');
const ExtractTextPlugin     = require("extract-text-webpack-plugin");
const CleanWebpackPlugin    = require('clean-webpack-plugin');
const webpack               = require('webpack');
const bootstrapEntryPoints  = require('./webpack.bootstrap.config.js');
const PurifyCSSPlugin       = require('purifycss-webpack');
const glob                  = require('glob-all');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
};

module.exports = env => {

  const isProd = env === 'production';

  const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
  const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader'],
    publicPath: '/'
  });

  const cssConfig = isProd ? cssProd : cssDev;
  const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

  return {
    entry: {
      app: './src/index.js',
      bootstrap: bootstrapConfig
    },
    output: {
      path: PATHS.dist,
      filename: './js/[name].js'
    },
    module: {
      rules: [
        {
          test: /\.sass$/,
          use: cssConfig
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            'file-loader?name=images/[name].[ext]',
            'image-webpack-loader'
          ]
        },
        {
          test: /\.(woff2?)$/,
          use: 'url-loader?limit=10000&name=[name].[ext]&outputPath=fonts/'
        },
        {
          test: /\.(ttf|eot)$/,
          use: 'file-loader?name=[name].[ext]&outputPath=fonts/'
        },
        {
          test: /\.ico$/,
          use: 'file-loader?name=[name].[ext]&outputPath=images/favicons/'
        }
      ]
    },
    devServer: {
      contentBase: PATHS.dist,
      compress: true,
      host: '192.168.1.100',
      stats: 'errors-only',
      open: true,
      hot: true
    },
    plugins: [
      new CleanWebpackPlugin(['./dist/*']),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new HtmlWebpackPlugin({
        title: "Shopping cart",
        template: "./src/index.html",
        minify: {
          collapseWhitespace: false
        },
        hash: false,
        chunks: ['bootstrap', 'app'],
        chunksSortMode: 'manual'
      }),
      new ExtractTextPlugin({
        filename: 'css/[name].css',
        disable: !isProd,
        allChunks: true
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new PurifyCSSPlugin({
        paths: glob.sync([
          path.join(__dirname, 'src/*.html'),
          path.join(__dirname, 'src/js/app.js')
        ]),
      })
    ]
  }
};
//
// var orderByList = function(list) {
//   return function(chunk1, chunk2) {
//     var index1 = list.indexOf(chunk1.names[0]);
//     var index2 = list.indexOf(chunk2.names[0]);
//     if (index2 == -1 || index1 < index2) {
//       return -1;
//     }
//     if (index1 == -1 || index1 > index2) {
//       return 1;
//     }
//     return 0;
//   };
// };
