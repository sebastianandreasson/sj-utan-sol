const path = require('path')
const webpack = require('webpack')
const ChromeReloadPlugin = require('wcer')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let resolve = dir => path.join(__dirname, '..', 'src', dir)
module.exports = {
  entry: {
    content: resolve('./content'),
    background: resolve('./backend'),
    // inject: resolve('./content/inject'),
  },
  output: {
    path: path.join(__dirname, '..', 'build'),
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[name].js?[hash]',
    library: '[name]',
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, '..', 'src')],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'static') }]),
    new ChromeReloadPlugin({
      port: 9090,
      manifest: path.join(__dirname, '..', 'src', 'manifest.js'),
    }),
  ],
  performance: { hints: false },
}
