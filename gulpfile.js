
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
import watchify from 'watchify'
import fancy_log from 'fancy-log'
import tsify from 'tsify'
import sourcemaps from 'gulp-sourcemaps'
import { on } from 'events'

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
  const basedir = path.join(dir, "dist")
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
  // .transform(babelify, {presets:['@babel/preset-env']})
   .bundle()
  .on('error', function(e){
    throw e
  })
  .on("success", function(){
    console.log("success")
  })
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build'))
  //.pipe(buffer())
  cb()  
}


function bundleFiles() {
  const dir = path.resolve()
  let basedir = path.join(dir, "app/scripts")
  const files = []
  fs.readdirSync(basedir,{recursive: true}).forEach(f=>{
    if (f.endsWith(".ts")) {
      files.push(path.join(basedir, f))
    }
  })  
  basedir = path.join(dir, "app/mods")
  fs.readdirSync(basedir,{recursive: true}).forEach(f=>{
    if (f.endsWith(".ts")) {
      files.push(path.join(basedir, f))
    }
  })  
  
  return watchify(
      browserify(files,{
        debug: true,
        cache: {},
        packageCache: {},
      })
      .plugin(tsify)
      .transform(babelify, {
        presets:["@babel/preset-env"],
        extensions:["*.ts"]
      })
    )
    .bundle()
    .on("error", fancy_log)
    .pipe(source("build/app.js"))
    .pipe(buffer())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest('dist'))
}

gulp.task("default", async function() {
  return browserify().add("app/scripts/initial.ts")  
  .transform(babelify, {
    presets:['@babel/preset-typescript', '@babel/preset-env'],
    extensions:[".ts", ".js"]
  })
  .bundle()
  .pipe(source('app.js'))
  //.pipe(buffer())
  .pipe(gulp.dest('./build'))
  .on("error",(err)=>{
    console.error(err.toString())
  })  
})

gulp.task("run", gulp.series(bundleFiles));
  
function watch(cb) {
  //gulp.watch('app/scripts/**/*.ts' ,buildTs) 
  //gulp.watch('app/style/**/*.scss', styles);

  gulp.watch(['app/scripts/**/*.ts', 'app/mods/**/*.ts'],
    {delay: 600,
      queue:true
    },
    gulp.series('default'));
}

const buildFiles = gulp.series(styles, buildTs, scripts);
gulp.task('default2', buildFiles)

export {watch, buildTs, scripts}