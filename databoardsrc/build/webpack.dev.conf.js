var config = require('../config/client/index')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')

var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')



module.exports =function(program){
  var baseWebpackConfig = require('./webpack.base.conf')(program)
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

  var configexport2=merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../client/'+program.entry+'/index.html'),
      inject: true
    })
  ]
});
return configexport2;
} 
