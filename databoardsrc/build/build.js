// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

var path = require('path');
var config = require('../config/client');
var ora = require('ora');
var webpack = require('webpack');
var program = require('commander');
program.option('-e, --entry <n> ', '模块名')
  .parse(process.argv);
var webpackConfig = require('./webpack.prod.conf')(program);

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
//cp('-R', 'static/*', assetsPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: true,
    children: true,
    chunks: true,
    chunkModules: true
  }) + '\n')
})
