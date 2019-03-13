// DEPENDENCIES
const gulp = require('gulp');
const tasks = require('./build/gulp-tasks');

gulp.task('gzip', tasks.gzip);
gulp.task('clean', tasks.cleanTask);
gulp.task('build-html', tasks.buildHTML);
gulp.task('build-less', () => tasks.buildLess(false));
gulp.task('build-less-prod', () => tasks.buildLess(true));
gulp.task('build-js', () => tasks.buildJS(false));
gulp.task('build-js-prod', () => tasks.buildJS(true));

gulp.task('build', gulp.series('clean', gulp.parallel('build-less', 'build-js', 'build-html')));
gulp.task('build-prod', gulp.series(gulp.parallel('build-less-prod', 'build-js-prod', 'build-html'), 'gzip'));

const DEV_PORT = 8081;
function serveTask() {
    const { spawn } = require('child_process');
    const browserSync = require('browser-sync').create();

    const serverProcess = spawn('node', ['index.js'], {
        env: {
            PORT: DEV_PORT,
            GZIP: false,
            CACHE: false
        }
    });
    serverProcess.stdout.on('data', (data) => console.log(data.toString()));
    serverProcess.stderr.on('data', (data) => console.error(data.toString()));

    browserSync.init({
        proxy: {
            target: `localhost:${DEV_PORT}`,
            ws: true
        },
        port: 8080
    });

    gulp.task('rebuild-html', () => tasks.buildHTML().pipe(browserSync.stream()));
    gulp.task('rebuild-less', () => tasks.buildLess(false).pipe(browserSync.stream()));
    gulp.task('rebuild-scripts', () => tasks.buildJS(false).pipe(browserSync.stream()));

    // INIT WATCH
    gulp.watch('src/ts/**/*.ts', gulp.series('rebuild-scripts'));
    gulp.watch('src/less/**/*.less', gulp.series('rebuild-less'));
    gulp.watch('src/**/*.html', gulp.series('rebuild-html'));
}

gulp.task('serve', serveTask);
gulp.task('default', gulp.series('build', 'serve'));