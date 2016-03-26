// general plugins
const fs = require('fs');
const gulp = require('gulp');
const gutil = require('gulp-util');
const sequence = require('run-sequence');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const changed = require('gulp-changed');
const flatten = require('gulp-flatten');
const del = require('del');

gulp.task('clean', function(done) {
  del('dist').then(() => done());
})

gulp.task('copy-assets', function() {
  return gulp.src('source/assets/**/*')
    .pipe(gulp.dest('dist/assets'))
})

// style plugins
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer-core');

// Task `styles`
// compiles stylesheet and optimises file 
gulp.task('styles', function() {
  return gulp.src('source/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({ browsers: ['last 2 version'] })
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/assets'));
});
 

// script plugins
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

// Task `scripts`
// compiles app script and optimises files 
gulp.task('scripts-compile', scripts(false));
gulp.task('scripts-develop', scripts(true));

function scripts(watch) {
  return function(done) {
    var bundler = browserify({ 
      entries: './source/main.js',
      debug: true,
      extensions: ['.js'],
      cache: {},
      packageCache: {}
    });

    bundler.transform(babelify, { 
      presets: ['es2015']
    });
   
    if (watch) {
      bundler.plugin(watchify);
      bundler.on('update', rebundle);
      done();
    } else {
      rebundle();
    }

    function rebundle() {
      gutil.log(watch ? '-> Rebundling' : '-> Bundling');
      
      return bundler.bundle()
        .on('error', function(err) { 
          gutil.log(err)
          this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist/assets'))
        .on('end', function() { 
          gutil.log('-> Bundling complete');
          if (!watch) done();
        });
    }
  };
}

// template plugins
const Rogulp = require('rogulp');
const through = require('through2');
const prettify = require('gulp-prettify');

var config = require('./rogain-config.js');

gulp.task('precompile-components', function() {
  return gulp.src('components/**/*.rogain')
    .pipe(flatten())
    .pipe(changed('dist/assets/components', { extension: '.json' }))
    .pipe(Rogulp.parse(config))
    .pipe(Rogulp.register(config.components))
    .pipe(gulp.dest('dist/assets/components'));
});

gulp.task('precompile-pages', function() {
  return gulp.src('source/pages/**/*.rogain')
    .pipe(changed('dist/assets/pages', { extension: '.json' }))
    .pipe(Rogulp.parse(config)) 
    .pipe(gulp.dest('dist/assets/pages'));
});

// Task `templates`
// compile html templates
gulp.task('render-pages', function() {
  var stream = gulp.src('dist/assets/pages/**/*.json')
    .pipe(changed('dist', { extension: '.html' }));

  return renderPages(stream).pipe(gulp.dest('dist'));
});

gulp.task('force-render-pages', function() {
  return renderPages(gulp.src('dist/assets/pages/**/*.json'))
    .pipe(gulp.dest('dist'));
});

function renderPages(stream) {
  return stream
    .pipe(Rogulp.renderToString(function(file, done) {
      fs.readFile(__dirname + '/source/data.json', function(err, data) {
        done(err, JSON.parse(data));
      });
    }, config))
    .pipe(rename(function (path) { path.extname = ".html"; }));
}

gulp.task('templates', function(done) {
  sequence(['precompile-components', 'precompile-pages'], 'render-pages', done);
});

gulp.task('pages', function(done) {
  sequence('precompile-pages', 'render-pages', done);
});


// Task `watch`
// run various tasks on file changes
gulp.task('watch', function () {
  gulp.watch('./source/**/*.scss', ['styles']);
  gulp.watch('./components/**/*.scss', ['styles']);
  
  gulp.watch('./source/*.json', ['force-render-pages']);
  gulp.watch('./source/**/*.rogain', ['pages']);
  gulp.watch('./components/**/*.rogain', ['templates']);
});
 
// Task `compile`
// Deletes dist folder and builds site from scratch
gulp.task('compile', function(done) {
  sequence('clean', ['templates', 'copy-assets', 'styles'], done);
});
 
// Task `develop`
// Runs `compile` task then watches for file changes
gulp.task('develop', function(done) {
  sequence(['compile', 'scripts-develop'], 'watch', done);
});
 
gulp.task('default', ['compile', 'scripts-compile']);