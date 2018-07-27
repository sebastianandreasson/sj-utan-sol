const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let resolve = dir => path.join(__dirname, '..', 'src', dir)
module.exports = {
  entry: {
    inject: resolve('./content'),
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
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json',
        to: '',
      },
    ]),
  ],
  performance: { hints: false },
}
