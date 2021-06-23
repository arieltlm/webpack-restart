const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HelloWorldPlugin = require('./src/plugins/hello-world');
const MyPlugin = require('./src/plugins/my-plugin');
const MyAsyncPlugin = require('./src/plugins/my-async-plugin')
const AddWordPlugin = require('./src/plugins/addword-bundle-plugin')


module.exports = {
    // mode: 'none',
    mode: 'development',
    // entry: './src/index.js',
    entry:{
        app: './src/index.js',
        print: './src/print.js',
        // note: './src/note.js',
    },
    devtool: 'inline-source-map',
    // devtool: 'eval',
    // devtool: 'nosources-source-map',
    output: {
        // filename: 'bundle.js',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    target:'web', // 热更新需要配置
    devServer: {
        contentBase: path.join(__dirname, 'dist'), // 告诉 dev server，从什么位置查找文件,可以有多个 [path.join(__dirname, 'public'), path.join(__dirname, 'assets')]
        publicPath: '/', 
        compress: true, // 一切服务都启用 gzip 压缩
        historyApiFallback:true,// 任意的 404 响应都可能需要被替代为 index.html。 默认禁用;还可以写rewrites
        host:'localhost',
        hot:true,
        https: true, // 可以自己增加key,cert,ca
        inline: true, // 在 dev-server 的两种不同模式之间切换。默认情况下，应用程序启用内联模式(inline mode)。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。也可以使用 iframe 模式，它在通知栏下面使用 <iframe> 标签，包含了关于构建的消息。切换到 iframe 模式
        port: 8081, // 指定要监听请求的端口号
        // open:true,
    },
    module: {
        rules: [
            /* {
                // 命中 JavaScript 文件
                test: /\.js$/,
                // 用 babel-loader 转换 JavaScript 文件
                // ?cacheDirectory 表示传给 babel-loader 的参数，用于缓存 babel 编译结果加快重新编译速度
                use: ['babel-loader?cacheDirectory'],
                // 只命中src目录里的js文件，加快 Webpack 搜索速度
                include: path.resolve(__dirname, 'src')
            },     */      
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            /* {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                        limit: 8192,
                        },
                    },
                ],
            }, */
            // webpack5中
            {
                //处理图片资源
                test: /\.(jpg|png|gif|)$/,
                type: "asset",
                generator: {
                    // 输出文件位置以及文件名
                    filename: "images/[name][ext]"
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 //超过10kb不转base64
                    }
                }
            },
            /*  {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                'file-loader'
                ]
            }, */
            // webpack5中
            {
                test: /\.(eot|svg|ttf|woff|)$/,
                type: "asset/resource",
                generator: {
                    // 输出文件位置以及文件名
                    filename: "fonts/[name][ext]"
                },
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                'csv-loader'
                ]
            },
            {
                test: /\.xml$/, 
                use: [
                    // {
                    //     loader:path.resolve('./src/loader/xml-loader.js') // 此写法也可以
                    // }
                    {
                        loader:'xml-loader',
                        options: {
                            limit: 8192,
                        },
                    }
                ]
            },
            {
                test: /\.txt$/,
                use: {
                  loader: path.resolve(__dirname, './src/loader/name-loader.js'),
                  options:{
                      name:'Tom'
                  }
                },
            },
            // { // 这个loader报错
            //     test: /\.js$/,
            //     // 因为配置了resolveLoader，在loader文件夹下找到了rfjsnote-loader
            //     // loader: "rfjsnote-loader",
            //     use: {
            //         loader: path.resolve(__dirname, './src/loader/rfjsnote-loader.js'),
            //         options:{
            //             oneLine: true, // 是否删除单行注释
            //             multiline: true, // 是否删除多行注释
            //         }
            //     }
            // }
        ]
    },
    resolveLoader: {
        // 去哪些目录下寻找 Loader，有先后顺序之分
        modules: ['node_modules',path.join(__dirname, '/src/loader')]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: '管理输出'
        }),
        new HelloWorldPlugin(),
        new MyPlugin({
            name:"my plugin"
        }),
        new MyAsyncPlugin({
            title:'异步插件'
        }),
        new AddWordPlugin()
    ],
};