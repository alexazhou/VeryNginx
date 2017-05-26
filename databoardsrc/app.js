
var express = require('express');
var path = require('path');
var app = express();


//view
app.set('views', path.join(__dirname, './server/views'))
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');



module.exports = app;