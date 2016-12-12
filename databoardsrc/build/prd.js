var config = require('../config/client/index')
process.env.NODE_ENV = 'production'
var path = require('path')
var app=require('../app')
var express=require('express')
var opn = require('opn')
var router=require('../server/lib/route-map.lib');
var logger=require('../server/lib/logger.lib')

var port = process.env.PORT || config.dev.port

/**
 * 转给 Roter 处理路由
 * 根据server/router.js路由表设置express路由
 */
app.use(router);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.body);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  logger.client.createUnhandledException(err, 'express').addRequestInfo(req).submit();
  console.log(err)
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    logger.error(err)
    return
  }
  logger.debug('app','app start finished')
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')
  // opn(uri)

})
