
import gulp from 'gulp'
import * as s from 'sass'
import sass from 'gulp-sass'
import concat from 'gulp-concat'
import {build} from 'esbuild'

import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-source-buffer'
import path from 'path'
import fs from 'fs'

const sassProcessor = sass(s)

function styles() {
  return gulp.src('app/style/scss/**/*.scss')
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build'));
}

function scripts(cb) {
  const dir = path.resolve()
  const basedir = path.join(dir, "app/scripts")
  const files = []
  fs.readdirSync(basedir,{recursive: true}).forEach(f=>{
    if (f.endsWith(".js")) {
      files.push(path.join(basedir, f))
    }
  })

  gulp.src("app/scripts/libraries/**/*.js")  
  .pipe(gulp.dest("build/libraries"))
  
  const r = browserify(files)
  .transform(babelify, {presets:['@babel/preset-env']})
  .bundle()
  .on('error', function(e){
    throw e
  })
  .on("success", function(){
    console.log("success")
  })
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build'))
  .pipe(buffer())
  cb() 

}

function watch() {
  gulp.watch('app/style/**/*.scss', styles);
  gulp.watch('app/scripts/**/*.js', scripts);
}

const buildFiles = gulp.parallel(styles, scripts);

export {watch, buildFiles}