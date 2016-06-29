/**
 * Created by JCole on 6/28/2016.
 */
var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('vet', function() {
    "use strict";

    log('Analyzing source with JSHint and JSCS');
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        //.pipe($.jscs.reporter())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function() {
    "use strict";
    log('Compiling Less -> CSS');
    return gulp
       .src(config.less)
       .pipe($.plumber())
       .pipe($.less())
       .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
       .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function(done) {
    "use strict";
    var files = config.temp + '*.css';
    clean(files, done);

});

gulp.task('less-watcher', function() {
    "use strict";
    gulp.watch([config.less], ['styles']);
});

/* utilities */
function clean(path, done) {
    "use strict";

    log("Cleaning up " + path);
    del(path).then(done());
}

function log(msg) {
    "use strict";

    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.yellow(msg.item));
            }
        }
    } else {
        $.util.log($.util.colors.yellow(msg));
    }
}