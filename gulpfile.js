var gulp = require('gulp');
var sass = require('gulp-sass');
var sync = require('browser-sync');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var del = require('del');
var runSequence = require('run-sequence');

var dependencies = [
	'react',
  	'react-dom'
];


gulp.task('hello', function(){
    console.log('Hello Sagar!');
});

gulp.task('sass',function(){    
    return gulp.src('app/styles/**/*.scss')
    .pipe(sass({})
    .on('error', sass.logError))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('dist/styles/'))    
});

gulp.task('html', function() {    
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js',uglify()))
        .pipe(gulp.dest('dist/'))
        .pipe(sync.reload(
        {
            stream : true
        }
    )) 
});

gulp.task('image',function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
});

gulp.task('sync',function(){
    sync.init({
        server:{
            baseDir : 'dist'
        },
    })
});

gulp.task('bundlejs',function(){
    return bundleApp(false);
});

function bundleApp(isProduction) {	
	// Browserify will bundle all our js files together in to one and will let
	// us use modules in the front end.
	var appBundler = browserify({
    	entries: ['./app/scripts/app.js'],
        insertGlobals: true,
        cache: {},
        packageCache: {},
    	debug: true
  	})  		
  	appBundler
  		// transform ES6 and JSX to ES5 with babelify
	  	.transform("babelify", {presets: ["es2015", "react"]})
	    .bundle()
	    .on('error',gutil.log)
	    .pipe(source('./app.js'))
	    .pipe(gulp.dest('./dist/scripts/'));
}


var bundler = {
    w: null,
    init: function() {
        this.w = watchify(browserify({
            entries: ['./app/scripts/app.js'],           
            insertGlobals: true,
            cache: {},
            packageCache: {}
        }));
    },
    bundle: function() {
        return this.w && this.w.transform("babelify", {presets: ["es2015", "react"]})
            .bundle()
            .on('error', gutil.log)
            .pipe(source('app.js'))
            .pipe(gulp.dest('dist/scripts'));
    },
    watch: function() {
        this.w && this.w.on('update', this.bundle.bind(this));
    },
    stop: function() {
        this.w && this.w.close();
    }
};

gulp.task('scripts', function() {
    bundler.init();
    return bundler.bundle();
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
})


gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'bundlejs','image', 'html','sync'],
    callback
  );
gulp.watch('app/scripts/**/*.js', ['bundlejs']);
})

gulp.task('watch',['sync','sass','image','html','bundlejs'],function(){    
    gulp.watch('app/scripts/**/*.js', ['bundlejs']);
    gulp.watch('app/styles/**/*.scss',['sass']);  
    gulp.watch('app/*.html',['html']);
});


//*******************   Typeahead demo  ************************/
gulp.task('type',function(){        
        browserify('./app/scripts/typeahead-demo.js')
	  	.transform("babelify", {presets: ["es2015", "react"]})
	    .bundle()
	    .on('error',gutil.log)
        .pipe(source('./app/scripts/typeahead-demo.js'))
	    .pipe(gulp.dest('./dist/scripts/'));	    
});