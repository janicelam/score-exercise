var gulp          = require('gulp');
var sass          = require('gulp-sass');
var browserSync   = require('browser-sync');
var rename        = require('gulp-rename');
var autoprefixer  = require('gulp-autoprefixer');
var sourcemaps    = require('gulp-sourcemaps');
var cssGlobbing   = require('gulp-css-globbing');
var cleanCSS      = require('gulp-clean-css');
var gutil         = require('gutil');
var htmlmin       = require('gulp-htmlmin');

// images
var imagemin      = require('gulp-imagemin');

// js
var browserify    = require('gulp-browserify');
var uglify        = require('gulp-uglify');

// static site
var assemble      = require('assemble');
var app           = assemble();

var paths = {
  src: 'src/',
  build: 'build/'
};

var sassPaths = [
  'node_modules/foundation-sites/scss'
];

gulp.task('default', ['scss','js','assemble'], function() {

  browserSync.init({
    server: "./build"
  });

  gulp.watch(paths.src+'assets/scss/**/*.scss', ['scss']);
  gulp.watch(paths.src+'assets/js/**/*.js', ['js-watch']);
  gulp.watch(paths.src+'assets/imgs/**/*', ['images-watch']);
  gulp.watch(paths.src+'views/**/*.hbs', ['assemble-watch']);

});

// create tasks that ensures the given task is complete before reloading

// js watch
gulp.task('js-watch', ['js'], browserSync.reload);

// html watch
gulp.task('assemble-watch', ['assemble'], browserSync.reload);

// images watch
gulp.task('images-watch', ['images'], browserSync.reload);


gulp.task('build', ['clean'], function() {
  gulp.run('default');
});

gulp.task('clean', function(cb) {
  var del = require('del');

  return del([paths.build+'**/*'], cb);
});

// ----------------------------------------------------------------

// Generate Css from Scss
gulp.task('scss', function() {
  gulp.src(paths.src+'assets/scss/main.scss')
    //.pipe(sourcemaps.init())
    .pipe(cssGlobbing({
      extensions: ['.css', '.scss']
    }))
    .pipe(sass({
      includePaths: sassPaths
    })
      .on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 8 versions', 'ie >= 9']
    }))
    .pipe(cleanCSS())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.build+'assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

// ----------------------------------------------------------------

// Copy all static images
// gulp.task('images', function() {
//   return gulp.src(paths.src+'assets/imgs/**/*')
//     //.pipe(imagemin())
//     .pipe(gulp.dest(paths.build+'assets/imgs'));
// });

// Copy all fonts
// gulp.task('fonts', function() {
//   return gulp.src(paths.src+'assets/fonts/**/*')
//     .pipe(gulp.dest(paths.build+'assets/fonts'));
// });

// Generate JS with browserify with sourcemaps
gulp.task('js', function() {
  gulp.src(paths.src+'assets/js/main.js')
    .pipe(browserify({
      debug : false
    }))
    .on('error', function (err) {
      gutil.log('ERROR: '+err.message);
      this.emit('end');
    })
    .pipe(uglify())
    .pipe(gulp.dest(paths.build+'assets/js'))
});

// Compress js
gulp.task('compressjs', ['js'], function() {
  gulp.src(paths.build+'assets/js/main.js')
    .pipe(uglify())
    .pipe(rename('min.js'))
    .pipe(gulp.dest(paths.build+'assets/js'))
});

// Assemble
app.data(paths.src+'data/**/*.{json,yml}');
app.helpers(paths.src+'helpers/**/*.js');

gulp.task('assemble', function(cb) {
  app.partials(paths.src+'views/partials/**/*.hbs');
  app.layouts(paths.src+'views/layouts/**/*.hbs');
  app.pages(paths.src+'views/pages/**/*.hbs');
  app.build(['views'], function(err) {
    if (err) return cb(err);
    console.log('Pages Are Complete!');
    cb();
  });
});

app.task('views', function() {
  return app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(rename(function (path) {
      path.extname = ".html"
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(app.dest(paths.build));
});

module.exports = app;
