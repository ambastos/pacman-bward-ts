/*
 * Build do console de texto (app/scripts/text/textRenderer.ts).
 *
 * Fica num gulpfile separado de proposito: o gulpfile.js original gera um unico
 * bundle (build/app.js) a partir de app/scripts/initial.ts, e mexer nele
 * misturaria a interface PIXI com a de texto. Aqui so empacota o console, que
 * nao tem nenhuma importacao -- ele le o GameCoordinator que o bundle
 * principal publica em window.gc.
 *
 *   npm run build:text     gera build/textRenderer.js
 *   npm run watch:text     refaz a cada alteracao
 */

import gulp from 'gulp'
import * as esbuild from 'esbuild'

const buildOptions = {
  entryPoints: ['app/scripts/text/textRenderer.ts'],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  outfile: 'build/textRenderer.js',
  logLevel: 'warning',
}

function buildText() {
  return esbuild.build(buildOptions)
}

async function watchText() {
  const context = await esbuild.context(buildOptions)
  await context.watch()
  console.log('assistindo app/scripts/text/textRenderer.ts')
}

gulp.task('buildText', buildText)
gulp.task('watchText', watchText)
gulp.task('default', gulp.series('buildText'))

export { buildText, watchText }
