const path = require('path');
// https://webpack.js.org/configuration/
module.exports = {
    mode: 'development',
    entry: './react/App.jsx',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': 'http://127.0.0.1:3001',
        },
        host: 'localhost',
        port: 8081,
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // stage-2 to allow destructuring
                        presets: ['react', 'stage-2'],
                    },
                },
            },
        ],
    },
};
