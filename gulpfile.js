var os = require('os');
var isWindows = os.platform() === "win32";
var isProduction = process.env.NODE_ENV === 'production';

if (isWindows){
    console.warn('You are running Microsoft Windows. Image compression won\'t be run on this platform');
}

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    imagemin = isWindows ? null : require('gulp-imagemin'),
    bump = require('gulp-bump'),
    htmlreplace = require('gulp-html-replace'),
    livereload = require('gulp-livereload');

var version = require(__dirname + '/package.json').version;


var mainOutput = 'dist/';
var cssOutput = mainOutput + 'css';
var jsOutput = mainOutput + 'js';
var imgOutput = mainOutput + 'img';
var fontOutput = mainOutput + 'fonts';
var layoutOutput = 'layout.ejs';
var ieOutput = mainOutput + 'ie';

var stylesheets = [
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'src/css/app.css'
]

var fonts = [
    'bower_components/fontawesome/fonts/**/*',
    'bower_components/bootstrap/fonts/**/*'
]

var images = [
    'src/img/**/*'
]

var scripts = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'src/js/app.js'
]

var ie = [
    'src/ie/**/*'
]


var layout = 'views/layout_src.ejs';


gulp.task('styles', function() {
    return gulp.src(stylesheets)
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(cssOutput))
        .pipe(rename({suffix: '.' + version + '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(cssOutput));
});

gulp.task('fonts', function(){
    return gulp.src(fonts)
        .pipe(gulp.dest(fontOutput));
});

gulp.task('images', function(){
    var g = gulp.src(images);

    if (!isWindows)
        g = g.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }));

    return g.pipe(gulp.dest(imgOutput));
});

gulp.task('scripts', function(){
    return gulp.src(scripts)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsOutput))
        .pipe(rename({suffix: '.' + version + '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(jsOutput));
});

gulp.task('ie', function(){
    return gulp.src(ie)
        .pipe(gulp.dest(ieOutput));
});

gulp.task('clean', function() {
    return gulp.src([cssOutput, jsOutput, imgOutput, fontOutput], {read: false})
        .pipe(clean());
});

gulp.task('bump', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

gulp.task('html-replace', function() {
    
    var cssDestination = isProduction ? 'styles.'+version+'.min.css' : 'styles.css';
    var jsDestination = isProduction ? 'scripts.'+version+'.min.js' : 'scripts.js';

  gulp.src(layout)
    .pipe(rename(layoutOutput))
    .pipe(htmlreplace({
        'css': '/assets/css/' + cssDestination,
        'js': '/assets/js/' + jsDestination 
    }))
    .pipe(gulp.dest('views'));
});

gulp.task('watch', function() {
  gulp.watch(stylesheets, ['styles']);
  gulp.watch(scripts, ['scripts']);
  gulp.watch(images, ['images']);
  gulp.watch('gulpfile.js', ['styles', 'fonts', 'scripts', 'html-replace', 'ie']);  

  // Create LiveReload server
  var server = livereload();

  // Watch any files in dist/, reload on change
  gulp.watch([mainOutput + '**']).on('change', function(file) {
    server.changed(file.path);
  });

});

gulp.task('default', ['clean'], function() {
    if (isProduction) {
        gulp.start('styles', 'fonts', 'images', 'scripts', 'html-replace', 'ie');
    }
    else {
        gulp.start('styles', 'fonts', 'images', 'scripts', 'bump', 'html-replace', 'ie');
    }
    
});