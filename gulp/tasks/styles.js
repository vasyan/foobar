var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var config = require('../config.js').sass;

gulp.task('styles', function() {
  gulp.src(config.src)
    .pipe(sass(config.settings))
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
});
