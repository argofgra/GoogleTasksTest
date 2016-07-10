/**
 * Created by JCole on 6/28/2016.
 */
var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || config.defaultPort;

gulp.task('default', ['serve-dev']);

gulp.task('help', $.taskListing);

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

gulp.task('styles', /*['clean-styles'],*/ function() {
    "use strict";
    log('Compiling Less -> CSS');
    return gulp
       .src(config.less)
       .pipe($.plumber())
       .pipe($.less())
       .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
       .pipe(gulp.dest(config.temp));
});

gulp.task('fonts', ['clean-fonts'], function() {
    log('Copying fonts');
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function() {
    log('Shrinking and copying images');
    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean', function(done) {
    var delconfig = [].concat(config.build, config.temp);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

gulp.task('clean-fonts', function(done) {
    var files = config.build + 'fonts/**/*.*';
    clean(files, done);
});

gulp.task('clean-images', function(done) {
    var files = config.build + 'images/**/*.*';
    clean(files, done);
});

gulp.task('clean-styles', function(done) {
    "use strict";
    var files = config.temp + '**/*.css';
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
        .pipe(gulp.dest('./src/'));
});

gulp.task('inject', ['wiredep', 'styles'], function() {
    "use strict";

    if (args.noinject) {
        //return gulp.pipe(); TODO: figure this out
        //return;
    }

    log('Wire up and inject custom JS/CSS into index.html');
    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.js)))
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest('./src/'));
});

gulp.task('serve-dev', ['inject'], function() {
    var isDev = true;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function() {
                browserSync.notify('browsersync reloading now...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function() {
            log('*** nodemon started');
            startBrowserSync();
        })
        .on('crash', function() {
            log('*** nodemon crashed');
        })
        .on('exit', function() {
            log('*** nodemon exited cleanly');
        });
});

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('^^^File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync() {
    if (browserSync.active || args.nosync) {
        return;
    }

    log('Starting browser sync');
    gulp.watch([config.less], ['styles'])
        .on('change', function(event) {changeEvent(event);});

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [
            './src/**/*.*',
            '!src/*.less',
            config.temp + '**/*.css'
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0,
        browser: 'google chrome'
    };

    browserSync(options);
}

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