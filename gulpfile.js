var del = require('del');

var gulp = require('gulp');
var cache = require('gulp-cache');
var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();

var useref = require('gulp-useref');

var uglify = require('gulp-uglify');    //optimize js
var gulpIf = require('gulp-if');

var cssnano = require('gulp-cssnano');  //optimize css

var imagemin = require('gulp-imagemin');    //optimize images
/**
 * Simple task
 */
gulp.task('hello', function () {
    console.log('Hello Jove');
});

/**
 * Convert sass to css
 * Patterns:
 *      *.scss          match any
 *      **\/*.scss      root folder and any child
 *      !not-me.scss    exclude
 *      *.+(scss|sass)  multiple
 */
gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

/**
* Inject new sass in the browser
*/
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

/**
 * Auto convert on save and live-reloading
 */
gulp.task('watch', gulp.parallel(['browserSync', 'sass'], function () {
    gulp.watch('app/scss/**/*.scss', gulp.series(['sass']));
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    // Other watchers
}));

/**
 * Optimizations - js css
 */
gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

/**
 * Optimizations - images
 */
gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

/**
 * Copy fonts to dist
 */
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

/**
 * Clean
 */
gulp.task('clean:dist', (done) => {
    del.sync('dist');
    done();
})

/**
 * Clear cache
 */
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
})

/**
 * Build
 */
gulp.task('build', gulp.series('sass', 'useref', 'images', 'fonts', function (done) {
    done();
}));

