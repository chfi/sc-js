"use strict";

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babel = require('gulp-babel');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');

// gulp.task('default', function() {
//     browserify({entries: 'lib/main.js'})
//         .transform(babelify, {presets: ["es2015"]})
//         .bundle()
//         .pipe(source('main.js'))
//         .pipe(buffer())
//         .pipe(gulp.dest('out'));
// });



gulp.task('default', function() {
    browserify({
        entries: ['lib/badmain.js'],
        debug: true
    })
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('out/'));
});
