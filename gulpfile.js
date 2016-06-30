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

gulp.task('wiredep', function() {
    "use strict";

    log('Inject Bower JS/CSS into index.html');
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(config.wiredepOptions))
        .pipe(gulp.dest('./'));
});

gulp.task('inject', ['wiredep', 'styles'], function() {
    "use strict";

    log('Wire up and inject custom JS/CSS into index.html');
    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.js), {relative: true}))
        .pipe($.inject(gulp.src(config.css), {relative: true}))
        //.pipe($.inject(gulp.src(config.js), {addPrefix: 'GoogleTasksTest'}))
       //.pipe($.inject(gulp.src(config.css), {addPrefix: 'GoogleTasksTest'}))
        .pipe(gulp.dest('./'));
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