const path = require('path'); //引入node的路径

let ENV = process.env.NODE_ENV;
const webpackConfig = {
  //首页

  app: {
    port: '3000', //dev 端口

    devContentBase: path.resolve(__dirname, `../dist`), //dev访问目录

    entryMain: ['babel-polyfill', './client/app'], //入口文件

    path: path.resolve(__dirname,`../dist${ENV == 'development' ? '' : '/app'}`), //打包路径

    publicPath: ENV == 'development' ? '/' : '/app/', //公共路径

    jsonpFunction: 'jsonpFunctionApp',

    renderKey: 'App',
  },

  //投前

  beforeManage: {
    port: '5005', //dev 端口

    devContentBase: path.resolve(__dirname, `../dist/beforeManage`), //dev访问目录

    entryMain: `./client/config/routers/before/app`, //入口文件

    path: path.resolve(__dirname, `../dist/beforeManage`), //打包路径

    publicPath: '/beforeManage/', //公共路径

    jsonpFunction: 'jsonpFunctionBeforeManage',

    renderKey: 'BeforeManage',
  },

  //投中

  centerManage: {
    port: '5006', //dev 端口

    devContentBase: path.resolve(__dirname, `../dist/centerManage`), //dev访问目录

    entryMain: `./client/config/routers/center/app`, //入口文件

    path: path.resolve(__dirname, `../dist/centerManage`), //打包路径

    publicPath: '/centerManage/', //公共路径

    jsonpFunction: 'jsonpFunctionCenterManage',

    renderKey: 'CenterManage',
  },

  //投后

  afterManage: {
    port: '5007', //dev 端口

    devContentBase: path.resolve(__dirname, `../dist/afterManage`), //dev访问目录

    entryMain: `./client/config/routers/after/app`, //入口文件

    path: path.resolve(__dirname, `../dist/afterManage`), //打包路径

    publicPath: '/afterManage/', //公共路径

    jsonpFunction: 'jsonpFunctionAfterManage',

    renderKey: 'AfterManage',
  },
};

module.exports = webpackConfig;
