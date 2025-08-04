const path = require('path');
const Plugin_To_Prevent_Webpack_From_Scanning_Inaccessible_Android_Folders = require("./Plugin_To_Prevent_Webpack_From_Scanning_Inaccessible_Android_Folders.cjs");

const config = {
  watchOptions: {
  poll: true,
  ignored: /node_modules/
    },
    plugins: [new Plugin_To_Prevent_Webpack_From_Scanning_Inaccessible_Android_Folders()],
    
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