const path = require('path');
const webpack = require('webpack');

const config = {
    mode: 'development',
    entry: ['./js/modules/main.js'],
    output: {
        path: __dirname + '/build',
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                loader:'babel-loader',
                test: /\.js$/,
                exclude:  /node_modules/,
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    },
    resolve: {
        alias: {
            SAT: path.resolve(__dirname, 'js/vendor/SAT.min.js'),
            FabricJS: path.resolve(__dirname, 'node_modules/fabric/dist/fabric.js'),
            jQuery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
            contextMenu: path.resolve(__dirname, 'js/vendor/justContext.js-master/justcontext.js')
        },
        extensions:['js']
    },
    devtool: 'eval-source-map',
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jQuery',
            'jQuery': 'jQuery'
        })
    ]
}
module.exports = config;