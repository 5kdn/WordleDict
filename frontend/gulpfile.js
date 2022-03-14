#!/usr/bin/env node

const paths = require('./paths')

const gulp = require('gulp')
const pug = require('gulp-pug')
const sass = require('gulp-sass')(require('sass'))
const notify  = require('gulp-notify')
const plumber = require('gulp-plumber')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfigDev = require('./webpack.config.dev.js')
const webpackConfigRelease = require('./webpack.config.release.js')


/**
* @description pugファイルをhtmlファイルに変換する
*/
function pug2html() {
    return gulp.src((paths.html.src.entry).concat(paths.html.src.ignore))
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug({
        // pug's setting
        pretty: true,
    }))

    .pipe(gulp.dest(paths.html.dest))
}


/**
* @description SASS/SCSSファイルをリリースビルド用CSSに変換する.
* [sass file name].min.cssへのリネームとファイル圧縮
*/
function sass2css() {
    return gulp.src((paths.css.src.entry).concat(paths.css.src.ignore))
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest(paths.css.dest))
}


/**
* @description SASS/SCSSファイルを開発用CSSに変換する.
* [sass file name].min.cssへのリネーム
*/
function sass2css_dev() {
    return gulp.src((paths.css.src.entry).concat(paths.css.src.ignore))
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest(paths.css.dest))
}

function ts2js_dev() {
    return webpackStream(webpackConfigDev, webpack)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest(paths.js.dest))
}


function ts2js() {
    return webpackStream(webpackConfigRelease, webpack)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest(paths.js.dest))
}


// ============================================================================
/// develop mode
exports.default = (done) => {
    gulp.watch(paths.html.src.entry, pug2html)
    gulp.watch(paths.css.src.entry, sass2css_dev)
    gulp.watch(paths.js.src.target, ts2js_dev)
    done()
}

// release build
exports.release = gulp.series(
    gulp.parallel(
        pug2html,
        sass2css,
        ts2js
    )
)
