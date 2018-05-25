var gulp = require('gulp');
var beautify = require('gulp-html-beautify');
var browserSync = require('browser-sync')
var inlineCss = require('gulp-inline-css');
var inky = require('inky');
var nunjucksMd = require('gulp-nunjucks-md');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var typograf = require('gulp-typograf');

gulp.task('default', ['build', 'img', 'serve']);

gulp.task('build', function () {
  return gulp.src(['*.md', '*.html'], {
      cwd: './src'
    })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(nunjucksMd({
      path: ['./src/templates/'],
      data: 'data.json',
      marked: {
        gfm: true,
        breaks: true
      }
    }))
    .pipe(inky())
    .pipe(inlineCss({
      removeStyleTags: false,
      applyStyleTags: true,
      removeLinkTags: false,
      applyLinkTags: false,
      applyWidthAttributes: true,
      applyTableAttributes: true,
      removeHtmlSelectors: false
    }))
    .pipe(beautify())
    .pipe(typograf({
      locale: ['ru']
    }))
    .pipe(notify({
      title: "kilogram",
      message: "Ready",
      sound: "Pop"
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('img', function () {
  return gulp.src('src/templates/img/*')
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: 'dist',
      directory: true
    },
    notify: false
  });

  gulp.watch(['./src/*.md', './src/*.html', './src/templates/*.njk', './src/templates/css/*.css', 'data.*'], ['build']);
  gulp.watch(['./src/templates/img/**'], ['img']);
  gulp.watch('./dist/*').on('change', browserSync.reload);
});
