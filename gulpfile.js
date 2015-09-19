var gulp = require('gulp');
var browserify = require('gulp-browserify');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');  

gulp.task('default', function() {
  return gulp.src('main.js')
    .pipe(babel())
    .pipe(browserify({
       debug: true,
       transform: [ 'reactify' ]
     }))
     .pipe(gulp.dest('./public/'));
});
