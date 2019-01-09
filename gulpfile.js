// DEPENDENCIES
const gulp = require('gulp');
const bsync = require('browser-sync');
const tasks = require('./build-config/gulp-tasks');

const CONSTANTS = require('./build-config/paths-config.json');

gulp.task('gzip', tasks.gzip);
gulp.task('clean', tasks.cleanTask);
gulp.task('build-html', tasks.buildHTML);
gulp.task('build-less', () => tasks.buildLess(false));
gulp.task('build-less-prod', () => tasks.buildLess(true));
gulp.task('build-js', () => tasks.buildJS(false));
gulp.task('build-js-prod', () => tasks.buildJS(true));

gulp.task('build', gulp.parallel('build-less', 'build-js', 'build-html'));
gulp.task('build-prod', gulp.series(gulp.parallel('build-less-prod', 'build-js-prod', 'build-html'), 'gzip'));

function serveTask() {
    const browserSync = bsync.create();
    browserSync.init({
        server: [
            './' + CONSTANTS.OUTPUT_DIR,
            './' + CONSTANTS.ASSETS_DIR
        ],
        // files: [
        //     './' + CONSTANTS.OUTPUT_DIR,
        //     './' + CONSTANTS.ASSETS_DIR
        // ]
    });

    gulp.task('rebuild-html', () => tasks.buildHTML().pipe(browserSync.stream()));
    gulp.task('rebuild-less', () => tasks.buildLess(false).pipe(browserSync.stream()));
    gulp.task('rebuild-scripts', () => tasks.buildJS(false).pipe(browserSync.stream()));

    // INIT WATCH
    gulp.watch('src/js/*.js', gulp.series('rebuild-scripts'));
    gulp.watch('src/js/*.ts', gulp.series('rebuild-scripts'));
    gulp.watch('src/less/*.less', gulp.series('rebuild-less'));
    gulp.watch('src/**/*.html', gulp.series('rebuild-html'));
}

gulp.task('serve', serveTask);
gulp.task('default', gulp.series('build', 'serve'));