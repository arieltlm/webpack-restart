const path = require('path');

module.exports = {
    // entry: './src/index.js',
entry:{
    app: './src/index.js',
    print: './src/print.js'
},
    output: {
        // filename: 'bundle.js',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
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
    }
};