
import gulp, { src } from 'gulp'
import cache from 'gulp-cached'
import * as s from 'sass'
import sass from 'gulp-sass'
import concat from 'gulp-concat'

import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-source-buffer'
import path, { resolve } from 'path'
import fs from 'fs'
import ts from 'gulp-typescript'
const tsProject = ts.createProject('tsconfig.json');

const sassProcessor = sass(s)

function styles() {
  return gulp.src('app/style/scss/**/*.scss')
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build'));
}

async function buildTs(cb) {
  tsProject.src()    
    .pipe(tsProject())
    .js.pipe(gulp.dest('dist/temp'))
    cb()
}

async function scripts(cb) {
  const dir = path.resolve()
  const basedir = path.join(dir, "dist/temp")
  const files = []
  fs.readdirSync(basedir,{recursive: true}).forEach(f=>{
    if (f.endsWith(".ts") || f.endsWith(".js")) {
      files.push(path.join(basedir, f))
    }
  })  

  gulp.src("app/scripts/libraries/**/*.js")  
  .pipe(gulp.dest("build/libraries"))
  // browserify(files)
  // .plugin(tsify, {target: 'es5'})
  // .transform(babelify, {presets:['@babel/preset-env']})
  // .bundle()
  // .on("error",(error)=>{
  //   throw error
  // })
  // .pipe(source('app.js'))
  // .pipe(gulp.dest('build'))
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
  
function watch(cb) {
  //gulp.watch('app/scripts/**/*.ts' ,buildTs) 
  //gulp.watch('app/style/**/*.scss', styles);

  gulp.watch(['app/scripts/**/*.ts', 'app/mods/**/*.ts'],
    {delay: 600,
      queue:true
    },
    gulp.series(styles, buildTs, scripts));
}

const buildFiles = gulp.series(styles, buildTs, scripts);
gulp.task('default', buildFiles)

export {watch, buildTs}