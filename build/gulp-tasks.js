// DEPENDENCIES
const path = require('path');
const gulp = require('gulp');
const named = require('vinyl-named');
const plugins = require('gulp-load-plugins')({lazy: false});

// POSTCSS PLUGINS
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

// WEBPACK
const wpConfig = require('./webpack-config');
const webpackStream = require('webpack-stream');

// CONSTANTS
const CONSTANTS = require('./paths-config.json');
const BUNDLE_DIR = path.join(__dirname, '../', CONSTANTS.BUNDLE_DIR);
const OUTPUT_DIR = path.join(__dirname, '../', CONSTANTS.OUTPUT_DIR);

function cleanTask() {
    return gulp.src(path.join(OUTPUT_DIR, '/*'), {read: false}).pipe(plugins.clean());
}

function buildHTML() {
    return gulp.src(path.join(BUNDLE_DIR, '/pages/*.html'))
        .pipe(require('./html-processor')())
        .pipe(plugins.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(OUTPUT_DIR));
}

function buildLess(prod) {
    let tmp = gulp.src(path.join(BUNDLE_DIR, 'less/*.less'));
    tmp = prod ? tmp : tmp.pipe(plugins.sourcemaps.init());
    tmp = tmp.pipe(plugins.less())
        .pipe(plugins.postcss([
            autoprefixer(),
            cssnano()
        ]));
    tmp = prod ? tmp : tmp.pipe(plugins.sourcemaps.write());
    tmp = tmp.pipe(gulp.dest(OUTPUT_DIR));
    return tmp;
}

function buildJS(prod) {
    return gulp.src(path.join(BUNDLE_DIR, 'ts/*.ts'))
        .pipe(named())
        .pipe(webpackStream(prod ? wpConfig.getProdConfig() : wpConfig.getDevConfig()))
        .pipe(gulp.dest(OUTPUT_DIR));
}

function gzip() {
    return gulp.src([path.join(OUTPUT_DIR, '/*'), '!**/*.gz'])
        .pipe(plugins.gzip())
        .pipe(gulp.dest(OUTPUT_DIR));
}

module.exports = { cleanTask, buildHTML, buildLess, buildJS, gzip };