const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //抽离css的插件c

const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'); //压缩css

const UglifyJsPlugin = require('webpack-parallel-uglify-plugin');

const HappyPack = require('happypack'); //开启多进程 提高效率 优化webpack

const os = require('os'); //配和happypack插件来用

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length }); //获取cpu的数量

const path = require('path');

const {
  stats,
  context,
  module: configModule,
  resolve,
} = require('./webpack.base.config');

configModule.rules[3].use[0].options.limit = 1024 * 1024; //1mb

const config = {
  //入口文件

  entry: './client/plugins/register.js',

  stats,

  context,

  module: configModule,

  resolve,

  output: {
    path: path.resolve(__dirname, '../client/plugins/publish'),

    filename: 'plugin.js',
  },

  plugins: [
    new MiniCssExtractPlugin({
      //抽离css文件的插件

      path: path.resolve(__dirname, '../client/plugins/publish'),

      filename: 'plugin.css', //文件命名
    }),

    new HappyPack({
      //用id来标识 happypack处理那里类文件

      id: 'js',

      //如何处理  用法和loader 的配置一样

      loaders: [
        {
          loader: 'babel-loader?cacheDirectory=true',
        },
      ],

      //共享进程池

      threadPool: happyThreadPool,

      //允许 HappyPack 输出日志

      verbose: true,
    }),

    //压缩JS

    new UglifyJsPlugin({
      uglifyJS: {
        output: {
          beautify: false,

          comments: false,
        },

        compress: {
          // warnings: false,

          drop_debugger: true,

          drop_console: true,

          dead_code: true,

          // unused: true,
        },
      },
    }),

    //压缩CSS

    new OptimizeCSSPlugin(),
  ],
};

module.exports = config;
