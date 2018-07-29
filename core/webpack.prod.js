const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./webpack.base')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = merge(baseWebpack, {
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new CleanWebpackPlugin(['build/*.*']),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
})
