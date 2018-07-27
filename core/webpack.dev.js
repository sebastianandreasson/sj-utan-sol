const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./webpack.base')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
module.exports = merge(baseWebpack, {
  // cheap-module-eval-source-map быстрее для разработки
  watch: true,
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),
    new FriendlyErrorsPlugin(),
  ],
})
