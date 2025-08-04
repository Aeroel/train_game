const path = require('path');
const Webpack_Plugin_To_Fix_Termux_Scandir_Issue = require("./Webpack_Plugin_To_Fix_Termux_Scandir_Issue.cjs");

const config = {
  watchOptions: {
  poll: true,
  ignored: /node_modules/
    },
    plugins: [new Webpack_Plugin_To_Fix_Termux_Scandir_Issue()],
    
    entry: './src/StartApp.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        // allows to use absolute imports relative to src using "#root/file"
        alias: {
            '#root': path.resolve(__dirname, 'src/'),
        },
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/build'),
    },
}

module.exports = config;