#!/usr/bin/env node

const os = require('os')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const paths = require('./paths')


module.exports = {
    mode: 'production',
    target: ['web'],
    entry: paths.js.src.entry,
    output: {
        path: paths.js.dest,
        filename: path.join('[name].bundle.js'),
    },
    resolve: { extensions: ['.vue', '.ts', '.js'],},
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                        },
                    },
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.pug$/,
                loader: "pug-plain-loader",
            },
            {
                test: /\.css$/,
                use:[
                    "style-loader",
                    "css-loader",
                ],
            },
            {
                test: /\.(scss|sass)$/,
                use:[
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),  // vue-loader v15以上を使う場合に必要
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: os.cpus().length - 1,
                extractComments: false,
                terserOptions: {
                    compress: {
                        drop_console: true, // console.log削除
                    },
                },
            }),
        ],
    },
}
