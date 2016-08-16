const gutil = require('gulp-util');
const gulp = require('gulp');

const html2pug = require('gulp-html2pug');

gulp.task('pug', function() {
  // Backend locales
  return gulp.src('index.html')
  .pipe(html2pug())
  .pipe(gulp.dest('pug'));
});