var config = require('../config/client/index')
if (!process.env.NODE_ENV) process.env.NODE_ENV = config.dev.env
var path = require('path')
var app=require('../app')
var express=require('express')
var webpack = require('webpack')
var program = require('commander');
program.option('-e, --entry <n> ', '模块名')
  .parse(process.argv);
var webpackConfig = require('./webpack.dev.conf')(program)

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port


var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})


// handle fallback for HTML5 history API
//app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
 app.use(hotMiddleware)

// // // serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))




// catch 404 and forward to error handler
app.use(function(req, res, next) {

  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
 
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: JSON.stringify(err)
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
 
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)  
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')

})
