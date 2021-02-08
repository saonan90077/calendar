const { task, src, dest, parallel, series, watch } = require('gulp')
const clean = require('gulp-clean')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const copy = require('gulp-copy')
const reload = browserSync.reload


function cleanDirDist() {
	return (
		src('dist/', { read: false })
		.pipe(clean())
	)
}

function cleanDirStatic() {
	return (
		src('./src/static', { read: false })
		.pipe(clean())
	)
}

function compileStyles() {
	return (
		src('./src/styles/*.scss')
		.pipe(sass())
		.pipe(dest('src/static/css'))
		.pipe(reload({ stream: true }))
	)
}

function compileJs() {
	return (
		src('./src/js/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(dest('src/static/js'))
		.pipe(reload({ stream: true }))
	)
}


function serve() {
	browserSync.init({
		server: {
			baseDir: 'src'
		}
	})
	watch('src/styles/*.scss', compileStyles)
	watch('src/js/*.js', compileJs)
	watch('src/*.html').on('change', reload)
}

function copyFile() {
	return (
		src(['./src/static/**/*', './src/*.html'])
		.pipe(copy('dist/', { prefix: 1 }))
	)
}

task('serve', series(parallel(compileStyles, compileJs), serve))
task('build', series(cleanDirDist, parallel(compileStyles, compileJs), copyFile, cleanDirStatic))


