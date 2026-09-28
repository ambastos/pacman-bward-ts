import gulp from 'gulp'
import * as s from 'sass'
import sass from 'gulp-sass'
import concat from 'gulp-concat'
import * as esbuild from 'esbuild'

const sassProcessor = sass(s)
const silenceDeprecations = Object.keys(s.deprecations)
  .filter(id => id !== 'user-authored')
  .filter(id => s.deprecations[id]?.status !== 'obsolete')

function styles() {
  return gulp.src('app/style/scss/**/*.scss')
    .pipe(sassProcessor({ silenceDeprecations }).on('error', sassProcessor.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build'));
}

gulp.task("scripts", async function() {
  await esbuild.build({
    entryPoints: ["app/scripts/initial.ts"],
    bundle: true,
    format: "iife",
    platform: "browser",
    outfile: "build/app.js",
    logLevel: "warning",
  })
})

function watch() {
  //gulp.watch('app/scripts/**/*.ts' ,buildTs)
  //gulp.watch('app/style/**/*.scss', styles);

  return gulp.watch(['app/scripts/**/*.ts'],
    {delay: 300,
      queue:true
    },
    gulp.series('styles', 'scripts'));
}

gulp.task("default",gulp.series(styles, "scripts"))

export {watch, styles}