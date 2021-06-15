const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    // entry: './src/index.js',
    entry:{
        app: './src/index.js',
        print: './src/print.js'
    },
    // devtool: 'inline-source-map',
    // devtool: 'eval',
    // devtool: 'nosources-source-map',
    output: {
        // filename: 'bundle.js',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'), // 告诉 dev server，从什么位置查找文件,可以有多个 [path.join(__dirname, 'public'), path.join(__dirname, 'assets')]
        publicPath: '/', 
        compress: true, // 一切服务都启用 gzip 压缩
        filename: '[name].bundle.js',
        historyApiFallback:true,// 任意的 404 响应都可能需要被替代为 index.html。 默认禁用;还可以写rewrites
        host:'localhost',
        hot:true,
        https: true, // 可以自己增加key,cert,ca
        inline: true, // 在 dev-server 的两种不同模式之间切换。默认情况下，应用程序启用内联模式(inline mode)。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。也可以使用 iframe 模式，它在通知栏下面使用 <iframe> 标签，包含了关于构建的消息。切换到 iframe 模式
        open: true, // 告诉 dev-server 在 server 启动后打开浏览器。默认禁用
        port: 8080, // 指定要监听请求的端口号
    },
    module: {
        rules: [
        {
            test: /\.css$/,
            use: [
            'style-loader',
            'css-loader'
            ]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                    limit: 8192,
                    },
                },
            ],
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
            'file-loader'
            ]
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
            'xml-loader'
            ]
        }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: '管理输出'
        })
    ],
};