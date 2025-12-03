
import gulp, { src } from 'gulp'
import * as s from 'sass'
import sass from 'gulp-sass'
import concat from 'gulp-concat'

import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import watchify from 'watchify'
import lodash from 'lodash'
import log from 'gulplog'

const sassProcessor = sass(s)

let customOpts = {
    entries: ["./app/scripts/initial.ts"],    
}
const opts = lodash.assign({}, watchify.args, customOpts)
const b = watchify(browserify(opts))
b.transform(babelify, {
    presets:['@babel/preset-typescript', '@babel/preset-env'],
    extensions:[".ts", ".js"]
})

gulp.task("build", bundle)
b.on("update", bundle)
b.on("log", log.info)

function bundle() {
    return b.bundle()
    .on("error", log.error.bind(log, 'Browserify Error'))
    .pipe(source("app.js"))    
    .pipe(gulp.dest("./build"))
}


function styles() {
  return gulp.src('app/style/scss/**/*.scss')
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build'));
}

gulp.task("scripts", async function() {
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
  
function watch() {
  //gulp.watch('app/scripts/**/*.ts' ,buildTs) 
  //gulp.watch('app/style/**/*.scss', styles);

  return gulp.watch(['app/scripts/**/*.ts', 'app/mods/**/*.ts'],
    {delay: 300,
      queue:true
    },
    gulp.series('styles', 'scripts'));
}

gulp.task("default",gulp.series(styles, "scripts"))

export {watch, styles}