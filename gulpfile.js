// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var concatCss     = require('gulp-concat-css');

var directories = {
	assets:      'web/app',
   source:      'src'
};

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(directories.source + '/**/*.css', gulp.series('concatCss'));
});

gulp.task('concatCss', function () {
  return gulp.src(directories.source + '/**/*.css')
    .pipe(concatCss("app.css"))
    .pipe(gulp.dest(directories.assets));
});

gulp.task('build', gulp.series('concatCss'))

// Default Task
gulp.task('default', gulp.series('concatCss', 'watch'));
