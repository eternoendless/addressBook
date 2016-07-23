// based on https://omarfouad.com/
var gulp = require('gulp');
var notify = require('gulp-notify');
var connect = require('gulp-connect');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var sass = require('gulp-ruby-sass');
var bower = require('gulp-bower');

var config = {
    sassPath: './src/sass',
    jsPath: './src/js',
    bowerDir: './bower_components',
    publicPath: './public'
};

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('connect', function() {
    connect.server({
        root: config.publicPath,
        port: 4000
    });
});

gulp.task('css', function() {
    return sass(config.sassPath + '/**/*.scss', {
        style: 'compressed',
        loadPath: [
            config.sassPath,
            config.bowerDir + '/bootstrap-sass-official/assets/stylesheets'
        ]})
        .on("error", notify.onError(function (error) {
            return "Error: " + error.message;
        }))
        .pipe(gulp.dest(config.publicPath + '/css'));
});

gulp.task('browserify', function() {
    // grab the app.js file
    return browserify(config.jsPath + '/app.js', {debug: true})
        .transform('babelify', {
            presets: ['es2015']
        })
        .bundle()
        .pipe(source('app.js'))
        // save it in the public/js/ directory
        .pipe(gulp.dest(config.publicPath + '/js/'));
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['browserify']);
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
});

gulp.task('copy-files', function() {
    // copy javascript files
    gulp.src([
        config.bowerDir + '/jquery/dist/jquery.min.js',
        config.bowerDir + '/handlebars/handlebars.min.js',
        config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap.min.js',
        config.bowerDir + '/bootstrap-validator/dist/validator.min.js',
        config.bowerDir + '/jquery-confirm2/dist/jquery-confirm.min.js'
    ])
        .pipe(gulp.dest(config.publicPath + '/js/'));

    // copy css
    gulp.src([
        config.bowerDir + '/jquery-confirm2/dist/jquery-confirm.min.css'
    ])
        .pipe(gulp.dest(config.publicPath + '/css/'));

    // copy fonts
    gulp.src([
        config.bowerDir + '/bootstrap-sass-official/assets/fonts/bootstrap/*'
    ])
        .pipe(gulp.dest(config.publicPath + '/fonts/bootstrap/'));
});

gulp.task('init', ['bower', 'copy-files', 'browserify', 'css']);

gulp.task('default', ['connect', 'watch']);
