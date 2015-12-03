'use strict';

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

// Stylus task
gulp.task("stylus", function() {
    return gulp.src('stylus/index.styl')
      .pipe(plugins.stylus())
      .pipe(plugins.autoprefixer())
      .pipe(gulp.dest('./css/'));
});

// Run the project in default mode
gulp.task('default', ['stylus']);