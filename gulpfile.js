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

var gfutil = {
    bangArray: function(array) {
        var bangedArray = [];
        for (var i = 0; i < array.length; i++) {
            bangedArray[i] = '!' + array[i];
        }

        return bangedArray;
    }
};

gulp.task('default', ['help']);

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

gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'app/**/*.js'
    );
    clean(files, done);
});

gulp.task('templatecache', ['clean-code'], function() {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
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
        .pipe(gulp.dest(config.source));
});

gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function() {
    "use strict";

    log('Wire up and inject custom JS/CSS into index.html');

    var gulpObj = gulp
        .src(config.index)
        .pipe($.plumber());

    log('Removing template cache...');
    gulpObj.pipe($.replace(/<!--\s*inject:templates:js\s*-->([\s\S]+?)<!--\s*endinject\s*-->/g, '<!--inject:templates:js-->\r\n<!--endinject-->'));

    if (args.templatecache === true) {
        log('Injecting template cache...');
        var templateCache = config.temp + config.templateCache.file;
        gulpObj.pipe($.inject(gulp.src(templateCache, {read: false}), { starttag: '<!-- inject:templates:js -->' }));
    }

    var jsModulesFirst = config.js.concat(gfutil.bangArray(config.utilities));
    var utilsModulesFirst = '';
    return gulpObj.pipe($.inject(gulp.src(jsModulesFirst)))
        .pipe($.inject(gulp.src(config.css)))
        .pipe($.inject(gulp.src(config.utilities, {read: false}), {
            starttag: '<!--inject:utilities:js-->'
        }))
        .pipe(gulp.dest(config.source));
});

gulp.task('optimize', ['inject'], function() {
    "use strict";

    log('Optimizing JS/CSS/HTML');
    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateCache, {read: false}), {
            starttag: '<!--inject:templates:js-->'
        }))
        .pipe($.useref({searchPath: './'}))
        .pipe($.if('**/*.css', $.csso()))
        .pipe($.if('**/' + config.optimized.main, $.ngAnnotate()))
        .pipe($.if('**/' + config.optimized.main, $.uglify()))
        .pipe($.if('**/' + config.optimized.lib, $.uglify()))
        .pipe($.if(['**/*.js', '**/*.css'], $.rev()))
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.build));
});

gulp.task('bump', function() {
    var msg = 'Bumping version';
    var type = args.type;
    var version = args.version;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }

    log(msg);
    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe($.bump(options))
        .pipe(gulp.dest('./'));
});

gulp.task('test', [/*'vet', */'templatecache'], function(done) {
    startTests(true /*single run*/, done);
});

gulp.task('autotest', [/*'vet', */'templatecache'], function(done) {
    startTests(false /*single run*/, done);
});

gulp.task('serve-dev', ['inject'], function() {
    return serve(true);
});

gulp.task('serve-build', ['optimize'], function() {
    return serve(false);
});

gulp.task('build-specs', ['templatecache'], function() {
    log('building the spec runner');

    var wiredep = require('wiredep').stream;
    var options = config.wiredepOptions;
    var specs = config.specs;
    options.devDependencies = true;

    if (args.startServers) {
        specs = [].concat(specs, config.serverIntegrationSpecs);
    }

    return gulp.src(config.specRunner)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.testlibraries, {read: false}),
            {name: 'inject:testlibraries'}))
        .pipe($.inject(gulp.src(config.js, {read: false})))
        .pipe($.inject(gulp.src(config.specHelpers, {read: false}),
            {name: 'inject:spechelpers'}))
        .pipe($.inject(gulp.src(specs, {read: false}),
            {name: 'inject:specs'}))
        .pipe($.inject(gulp.src(config.temp + config.templateCache.file, {read: false}),
            {name: 'inject:templates'}))
        .pipe(gulp.dest(config.source));
});

gulp.task('serve-specs', ['build-specs'], function(done) {
    log('run the spec runner');
    serve(true /*isDev*/, true /*specRunner*/);
    done();
});

function startTests(singleRun, done) {
    var child;
    var fork = require('child_process').fork;
    var karma = require('karma').server;
    var excludeFiles = [];
    var serverSpecs = config.serverIntegrationSpecs;

    if (args.startServers) { // gulp test --startServers
        log('Starting server');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = fork(config.nodeServer);
    } else {
        if (serverSpecs && serverSpecs.length) {
            excludeFiles = serverSpecs;
        }
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    function karmaCompleted(karmaResult) {
        log('Karma completed');
        if (child) {
            log('Shutting down the child process');
            child.kill();
        }
        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
}

function serve(isDev, specRunner) {
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
        .on('restart', function (ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function () {
                browserSync.notify('browsersync reloading now...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(isDev, specRunner);
        })
        .on('crash', function () {
            log('*** nodemon crashed');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('^^^File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync(isDev, specRunner) {
    if (browserSync.active || args.nosync) {
        return;
    }

    log('Starting browser sync');
    if (isDev) {
        gulp.watch([config.less], ['styles'])
            .on('change', function(event) {changeEvent(event);});
    } else {
        gulp.watch([config.less, config.js, config.htmltemplates], ['optimize'])
            .on('change', function(event) {changeEvent(event);});
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: isDev ? [
            config.source + '**/*.*',
            '!src/*.less',
            config.temp + '**/*.*'
        ] : [],
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

    if (specRunner) {
        options.startPath = config.specRunnerFile;
    }

    browserSync(options);
}

function dealWithTemplateCache(g, isDev) {
    var templateCache = config.temp + config.templateCache.file;

    log('Removing template cache...');
    //g.pipe($.replace(/<!--\s*inject:templates:js\s*-->([\s\S]+?)<!--\s*endinject\s*-->/g, '<!--inject:templates:js-->\n<!--endinject-->'));

    if (!isDev || (isDev && args.templatecache === true)) {
        log('Injecting template cache...');
        g.pipe($.inject(gulp.src(templateCache, {read: false}), { starttag: '<!-- inject:templates:js -->' }));
    }
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