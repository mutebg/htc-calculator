var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', function () {
    return gulp.src('es6/*.js')
        .pipe(babel())
        .pipe(gulp.dest(''));
});

gulp.task('watch', function() {
	gulp.watch( 'es6/*.js', ['default'] );
});