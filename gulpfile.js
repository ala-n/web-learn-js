// DEPENDENCIES
const path = require('path');
const gulp = require('gulp');
const tasks = require('./build/gulp-tasks');

gulp.task('gzip', tasks.gzip);
gulp.task('clean', tasks.cleanTask);
gulp.task('build-html', tasks.buildHTML);
gulp.task('build-less', () => tasks.buildLess(false));
gulp.task('build-less-prod', () => tasks.buildLess(true));
gulp.task('build-js', () => tasks.buildJS(false));
gulp.task('build-js-prod', () => tasks.buildJS(true));
gulp.task('prepare-static', tasks.prepareStaticSite);

gulp.task('build', gulp.series('clean', gulp.parallel('build-less', 'build-js', 'build-html'), 'prepare-static'));
gulp.task('build-prod', gulp.series('clean', gulp.parallel('build-less-prod', 'build-js-prod', 'build-html'), 'prepare-static', 'gzip'));

function serveTask() {
    const browserSync = require('browser-sync').create();

    browserSync.init({
        server: {
            baseDir: path.join(__dirname, 'publish')
        },
        port: 8080
    });

    gulp.task('rebuild-html', gulp.series(
        tasks.buildHTML,
        tasks.prepareStaticSite,
        (done) => {
            browserSync.reload();
            done();
        }
    ));
    gulp.task('rebuild-less', () => tasks.buildLess(false).pipe(browserSync.stream()));
    gulp.task('rebuild-scripts', gulp.series(
        () => tasks.buildJS(false),
        (done) => {
            browserSync.reload();
            done();
        }
    ));
    gulp.task('rebuild-static', gulp.series(
        tasks.prepareStaticSite,
        (done) => {
            browserSync.reload();
            done();
        }
    ));

    // INIT WATCH
    gulp.watch('src/ts/**/*.ts', gulp.series('rebuild-scripts'));
    gulp.watch('src/less/**/*.less', gulp.series('rebuild-less'));
    gulp.watch('src/**/*.html', gulp.series('rebuild-html'));
    gulp.watch('src/codepens/**/*', gulp.series('rebuild-static'));
    gulp.watch('assets/**/*', gulp.series('rebuild-static'));
}

gulp.task('serve', serveTask);
gulp.task('default', gulp.series('build', 'serve'));