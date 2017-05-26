var path = require('path')
var config = require('../config/client/index')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

var env = process.env.NODE_ENV
  // check env & config/index.js to decide weither to enable CSS Sourcemaps for the
  // various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

module.exports = function (program) {
  var configexport = {
    entry: {
      app: './client/' + program.entry + '/main.js'
    },
    output: {
      path: config.build.assetsRoot,
      publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
      filename: '[name].js'
    },
    resolve: {
      extensions: ['', '.js', '.vue'],
      fallback: [path.join(__dirname, '../node_modules')],
      alias: {
        'vue$': 'vue/dist/vue.common.js',
        'src': path.resolve(__dirname, '../client/' + program.entry),
        'assets': path.resolve(__dirname, '../client/' + program.entry + '/assets'),
        'components': path.resolve(__dirname, '../client/' + program.entry + '/components')
      }
    },
    resolveLoader: {
      fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
      loaders: [{
        test: /\.vue$/,
        loader: 'vue'
      }, {
        test: /vux.src.*?js$/,
        loader: 'babel'
      }, {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: [new RegExp(`node_modules\\${path.sep}(?!vue-bulma-.*)`)]
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }]
    },
    vue: {
      loaders: utils.cssLoaders({
        sourceMap: useCssSourceMap
      }),
      postcss: [
        require('autoprefixer')({
          browsers: ['last 2 versions']
        })
      ]
    }
  }
  return configexport
};