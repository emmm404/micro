const path = require('path');//引入node的路径

const webpack = require('webpack'); //引入webpack

const MiniCssExtractPlugin = require('mini-css-extract-plugin');//抽离css的插件

const HappyPack = require('happypack');//开启多进程 提高效率 优化webpack

const os = require('os');//配和happypack插件来用

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });//获取cpu的数量

const ManifestPlugin = require('webpack-manifest-plugin');//生成文件索引文件

const CopyWebpackPlugin = require('copy-webpack-plugin');//复制粘贴文件的插件 npm install copy-webpack-plugin -D 来安装

const HtmlWebpackPlugin = require('html-webpack-plugin');//处理HTML

const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');//压缩css

const UglifyJsPlugin = require('webpack-parallel-uglify-plugin');//压缩JS

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



/**

 * 自定义插件

 */

// const CleanDistWebpackPlugin = require('./plugins/CleanDistWebpackPlugin');//压缩JS



//环境变量

let ENV = process.env.NODE_ENV;

const BUILD_ENV = process.env.BUILD_ENV;

let MODULE = process.env.MODULE;

let npm_config_report = process.env.npm_config_report;



module.exports = {

    devtool: ENV == 'development' ? 'source-map' : 'none',

    //配置开发服务功能

    devServer: {

        // 设置服务器的ip地址,可以是localhost

        host: '127.0.0.1',

        // 设置端口

        port: 3000,

        disableHostCheck: true,

        inline: true,

        compress: true,

        hot: true,

        historyApiFallback: true,

        overlay: true,

        before(app) {

            app.use('*', function (req, res, next) {

                res.header('Access-Control-Allow-Origin', req.headers.origin); //这个表示任意域名都可以访问，这样写不能携带cookie了。

                res.header('Access-Control-Allow-Headers', `Content-Type, Content-Length, Authorization, Accept, X-Requested-With , ${req.headers['access-control-request-headers'] || ''}`);

                res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法

                res.header('Access-Control-Allow-Credentials', 'true'); //是否支持cookie跨域

                next();

            });

        }

    },

    stats: 'errors-only',

    context: path.resolve(__dirname, '..'),

    //出口文件

    output: {

        //打包文件名

        filename: ENV == 'development' ? 'js/[name].js' : 'js/[name].[chunkhash:8].js',

        //chunk名

        chunkFilename: ENV == 'development' ? 'js/chunk.[name].js' : 'js/chunk.[name].[chunkhash:8].js'

    },

    //模块：例如 less jsx 图片压缩等

    module: {

        rules: [

            //es6语法转换加载器 配合happypack用多进程处理 效率更高

            {

                test: /\.jsx?$/,

                exclude: /(node_modules|plugin.js)/,

                // loader: ['cache-loader', 'happypack/loader?id=js']

                loader: 'happypack/loader?id=js'

            },

            //less处理器

            {

                test: /\.less$/,

                include: [

                    path.resolve(__dirname, '../node_modules/antd'),

                    path.resolve(__dirname, '../client')

                ],

                use: [

                    MiniCssExtractPlugin.loader,

                    'css-loader',

                    'postcss-loader',

                    {

                        loader: 'less-loader',

                        options: {

                            sourceMap: ENV == 'development' ? true : false,

                            javascriptEnabled: true

                        }

                    }

                ]

            },

            //css处理器

            {

                test: /\.css$/,

                include: [

                    path.resolve(__dirname, '../node_modules/braft-editor'),

                    path.resolve(__dirname, '../client')

                ],

                use: [

                    'style-loader',

                    MiniCssExtractPlugin.loader,

                    'css-loader',

                    'postcss-loader'

                ]

            },

            //图片加载器

            {

                test: /\.(png|jpeg|jpg|gif)$/,

                exclude: /node_modules/,

                use: [

                    {

                        loader: 'url-loader',

                        options: {

                            limit: 2048,//2048以内的文件我们打包进js

                            name: 'images/[hash:8].[name].[ext]'//2048之外的图片我们直接放到这个目录下 不打包

                        }

                    }

                ]

            },

            //字体加载器

            {

                test: /\.(woff|eot|ttf|otf)(\?.*)?$/,

                exclude: /node_modules/,

                loader: 'file-loader',

                options: {

                    limit: 10000,

                    name: 'fonts/[name].[ext]'

                }

            },

            //svg处理器

            {

                test: /\.svg$/,

                use: [

                    {

                        loader: '@svgr/webpack',

                        options: {

                            native: false

                        }

                    }

                ]

            }

        ]

    },


    resolve: {

        extensions: ['.js', '.jsx', '.json'], //优先去找.js文件依赖 然后是.jsx 最后是.json

        alias: {
            '@': path.resolve(__dirname, '..', 'client'),
            '@c': path.resolve(__dirname, '..', 'client/config'),
            '@page': path.resolve(__dirname, '..', 'client/page'),
            '@before': path.resolve(__dirname, '..', 'client/page/before'),
            '@center': path.resolve(__dirname, '..', 'client/page/center'),
            '@after': path.resolve(__dirname, '..', 'client/page/after'),
        }

    },

    //插件

    plugins: [

        MODULE == 'app' ? new CopyWebpackPlugin([

            {

                from: path.resolve(__dirname, '../client/lib'),//复制来自于

                to: path.resolve(__dirname, '../dist/app/lib')//粘贴到dist文件下lib

            }

        ]) : () => { },

        MODULE == 'app' ? new HtmlWebpackPlugin({

            favicon: './client/favicon.png',

            title: '平安不动产',

            buildTime: new Date() - 0,

            filename: path.resolve(__dirname, '../dist/index.html'),

            // template: ENV === 'development' ? './views/tpl/index_dev.tpl.html' : BUILD_ENV == 'test' ? './views/tpl/index_stg.tpl.html' : './views/tpl/index.tpl.html',
            template: './views/tpl/index.tpl.html',

            inject: true,    //是否自动添加资源引入

            minify: ENV == 'production' ? {//html文件的压缩规则

                removeComments: true,//去除注释

                collapseWhitespace: true,//去除空格

                removeAttributeQuotes: true//删除引号，删除不需要引号的值。

            } : false

        }) : () => { },

        ENV == 'development' ? new webpack.NamedModulesPlugin() : () => { }, // HMR在更新时在控制台显示正确的文件名

        ENV == 'development' ? new webpack.NoEmitOnErrorsPlugin() : () => { },//当编译出现错误的时候 来跳过输出阶段 可以确保资源输出不会包含错误

        new ManifestPlugin({

            // fileName: `./asset-manifest.${new Date().getTime()}.json`

            fileName: `./asset-manifest.json`

        }),

        new webpack.DllReferencePlugin({

            context: __dirname,

            manifest: require('../dist/vendor-manifest.json')

        }),

        new MiniCssExtractPlugin({//抽离css文件的插件

            filename: ENV == 'development' ? 'css/[name].css' : 'css/[name].[contenthash:8].css',//文件命名

            chunkFilename: ENV == 'development' ? 'css/[name].css' : 'css/[name].[contenthash:8].css'//打包完文件的存放地址

        }),

        new HappyPack({

            //用id来标识 happypack处理那里类文件

            id: 'js',

            //如何处理  用法和loader 的配置一样

            loaders: [{

                loader: 'babel-loader?cacheDirectory=true'

            }],

            //共享进程池

            threadPool: happyThreadPool,

            //允许 HappyPack 输出日志

            verbose: true

        }),

        //压缩JS

        ENV == 'production' ? new UglifyJsPlugin({

            uglifyJS: {

                output: {

                    beautify: false,

                    comments: false

                },

                compress: {

                    // warnings: false,

                    drop_debugger: true,

                    drop_console: true,

                    dead_code: true

                    // unused: true,

                }

            }

        }) : () => { },

        //压缩CSS

        ENV == 'production' ? new OptimizeCSSPlugin() : () => { },

        //Analyzer

        (ENV == 'production' && npm_config_report) ? new BundleAnalyzerPlugin(

            {

                analyzerMode: 'server',

                analyzerHost: '127.0.0.1',

                analyzerPort: 8888,

                reportFilename: 'report.html',

                defaultSizes: 'parsed',

                openAnalyzer: true,

                generateStatsFile: false,

                statsFilename: 'stats.json',

                statsOptions: null,

                logLevel: 'info'

            }

        ) : () => { },

        // // 自定义插件

        // (ENV == 'production') ? new CleanDistWebpackPlugin(

        //     {

        //         allowRepeatCount: 1,

        //         MODULE,

        //         dTime: (BUILD_ENV === 'test') ? 0.01 : 15



        //     }

        // ) : () => { }


    ]

};