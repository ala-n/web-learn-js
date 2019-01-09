const path = require('path');
const CONSTANTS = require('./paths-config.json');
const TS_CONFIG = path.join(__dirname, './../tsconfig.json');

const MAIN_CONFIG = {
    context: path.join(__dirname, '../', CONSTANTS.BUNDLE_DIR),
    output: {
        path: path.join(__dirname, '../', CONSTANTS.OUTPUT_DIR),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: true,
                    configFile: TS_CONFIG
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
};

const PROD_CONFIG = {
    watch: false,
    mode: 'production'
};

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const DEV_CONFIG = {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tsconfig: TS_CONFIG
        })
    ]
};

module.exports.getConfig = function (prod) {
    return Object.assign({}, MAIN_CONFIG, prod ? PROD_CONFIG : DEV_CONFIG);
};