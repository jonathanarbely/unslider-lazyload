var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    pug = require('gulp-pug'),
    autoprefixer = require('gulp-autoprefixer');

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('hello', function () {
    console.log('Hello Gulp!')
});

gulp.task('c', function () {
    connect.server();
});

gulp.task('pug', function () {
    gulp.src('./demo/pug/**/!(_)*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./demo'));
});

gulp.task('scss', function () {
  return gulp
    .src('./scss/*.scss')
    .pipe(maps.init())
    .pipe(sass({ /*outputStyle: 'compressed'*/ }).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('./static/css'));
});

gulp.task('watch', function() {
    gulp.watch('./demo/pug/**/*.pug', ['pug']);
    gulp.watch('./scss/**/*.scss', ['scss']);
});

gulp.task('sassywatch', function() {
    gulp.watch('./scss/**/*.scss', ['scss']);
});

gulp.task('default', ['pug','scss','watch']);