const path = require('path');
const CONSTANTS = require('./paths-config.json');
const TS_LINT = path.join(__dirname, './../tslint.json');
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
        extensions: ['.ts']
    }
};

module.exports.getDevConfig = function () {
    const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
    return Object.assign({}, MAIN_CONFIG, {
        mode: 'development',
        devtool: 'inline-source-map',
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                tslint: TS_LINT,
               // tslintAutoFix: true,
                tsconfig: TS_CONFIG
            })
        ]
    });
};

module.exports.getProdConfig = function () {
    return Object.assign({}, MAIN_CONFIG, {
        watch: false,
        mode: 'production'
    });
};