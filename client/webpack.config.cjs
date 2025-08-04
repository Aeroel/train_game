const path = require('path');

const config = {
  watchOptions: {
  poll: true,
  ignored: /node_modules/
},
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