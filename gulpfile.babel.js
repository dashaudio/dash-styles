import gulp from 'gulp'
import connect from 'gulp-connect'
import sass from 'gulp-sass'
import render from 'gulp-nunjucks-render'
import nano from 'gulp-cssnano'
import replace from 'gulp-token-replace'

import { version } from './package.json'

const tokens = {
  domain: process.env.DASH_ASSETS_BASE || '', version
}

gulp.task('styles:sources', () => {
  return gulp.src('styles/**/*.scss')
    .pipe(replace({ global: tokens }))
    .pipe(gulp.dest('build/'))
})

gulp.task('styles:minified', () => {
  return gulp.src('styles/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(replace({ global: tokens }))
    .pipe(nano({ safe: true }))
    .pipe(gulp.dest('build/'))
})

gulp.task('guide:markup', () => {
  return gulp.src('guide/**/*.html')
    .pipe(render({ path: 'guide/', data: tokens }))
    .pipe(gulp.dest('build/'))
})

gulp.task('guide:styles', () => {
  return gulp.src('guide/guide.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(replace({ global: tokens }))
    .pipe(nano({ safe: true }))
    .pipe(gulp.dest('build/'))
})

gulp.task('fonts', () => {
  return gulp.src('fonts/**/*')
    .pipe(gulp.dest('build/fonts/'))
})

gulp.task('images', () => {
  return gulp.src('images/**/*')
    .pipe(gulp.dest('build/images/'))
})

gulp.task('watch', () => {
  gulp.watch(['styles/**/*'], ['styles'])
  gulp.watch(['styles/**/*', 'guide/**/*'], ['guide'])
  gulp.watch(['fonts/**/*'], ['fonts'])
  gulp.watch(['images/**/*'], ['images'])
})

gulp.task('connect', () => {
  connect.server({ root: 'build/' })
})

gulp.task('styles', ['styles:sources', 'styles:minified'])
gulp.task('guide', ['guide:markup', 'guide:styles'])

gulp.task('build', ['styles', 'guide', 'fonts', 'images'])
gulp.task('serve', ['build', 'connect', 'watch'])

gulp.task('default', ['build'])
