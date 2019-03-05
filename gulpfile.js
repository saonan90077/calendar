var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
gulp.task("sass", function() {
	gulp.src("src/scss/*.scss")
	.pipe(sass())
	.pipe(gulp.dest("src/css"))
	.pipe(reload({stream: true}));
});
gulp.task("serve", ["sass"], function() {
	browserSync({
	    server: {
	      baseDir: "src"
	    }
	});
	gulp.watch("src/scss/*.scss", ["sass"]);
	gulp.watch("**/*.*", {cwd: "src"}, reload);
});