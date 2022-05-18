const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('webpack-parallel-uglify-plugin');
const vendors = [
  'react',
  'react-dom',
  'react-dom/server',
  'react-router-dom',
  'mobx',
  'mobx-react',
  'axios',
  'antd',
];

module.exports = {
  entry: {
    vendor: vendors,
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].dll.js',
    library: '[name]_library',
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../dist', '[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname,
    }),

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
  ],
};
