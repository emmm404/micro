const merge = require('webpack-merge');

const base = require('./webpack.base.config');

const config = require('./config');

//环境变量

const MODULE = process.env.MODULE;

const {
  devContentBase,
  port,
  entryMain,
  path,
  publicPath,
  jsonpFunction,
} = config[MODULE];

let realPath = publicPath;

if (process.env.NODE_ENV === 'development') {
  realPath = `http://127.0.0.1:${port}${publicPath}`;
}

const webpackConfig = {
  // devtool: 'source-map',

  devServer: {
    // 设置服务器访问的基本目录

    contentBase: devContentBase,

    // 设置端口

    port,
  },

  //入口文件

  entry: {
    main: entryMain,
  },

  //出口文件
  output: {
    //打包路径
    path,
    //公共路径
    publicPath: realPath,
    //jsonpFunction

    jsonpFunction,
  },

  //插件
  plugins: [],
};

module.exports = merge(base, webpackConfig);
