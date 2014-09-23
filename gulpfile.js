var gulp = require('gulp'),
    tap = require('gulp-tap'),
    rename = require('gulp-rename'),
    open = require('gulp-open'),
    sass = require('gulp-sass'),
    runSequence = require('run-sequence'),
    request = require('request');

var urls = [];

gulp.task('scrape', function() {
    return gulp.src('src/*.js')
        .pipe(require('./lib/scrape')())
        .pipe(rename({
                dirname: '',
                extname: '.json'
            }))
        .pipe(gulp.dest('./cache'));
});

gulp.task('html', function() {
    return gulp.src('./cache/*.json')
        .pipe(tap(require('./lib/html')))
        .pipe(rename({
            dirname: '',
            extname: '.html'
        }))
        .pipe(gulp.dest('./output'));
});

gulp.task('open', function() {
    return gulp.src('./output/*.html')
        .pipe(open("<%file.path%>"));
});

gulp.task('sass', function() {
    return gulp.src('./lib/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./output'));
});

gulp.task('default', ['sass'], function() {
    runSequence('scrape', 'html');
});
