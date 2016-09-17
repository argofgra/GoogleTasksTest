module.exports = function() {
    "use strict";

    var temp = './.tmp/';
    var build = './build/';
    var source = './src/';
    var app = source + 'app/';
    var server = './server/';
    var report = './report/';
    var specRunnerFile = 'specs.html';
    var wiredep = require('wiredep');
    var bowerFiles= wiredep({devDependencies: true})['js'];

    var config = {
        temp: temp,
        alljs: [
            source + '**/*.js'
        ],
        build: build,
        index: source + 'index.html',
        fonts: './bower_components/font-awesome/fonts/**/*.*',
        images: source + 'images/**/*.*',
        less: source + 'styles.less',
        css: temp + 'styles.css',
        js: [app + '**/*.module.js', app + '**/*.js'],
        source: source,
        htmltemplates: app + '**/*.html',
        utilities: [app + 'utilities/**/*.module.js', app + 'utilities/**/*.js'],
        packages: [
            './package.json',
            './bower.json'
        ],
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'TasksList',
                standAlone: false,
                root: 'app/'
            }
        },
        wiredepOptions: {
            bowerJson: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '..'
        },
        nodeserver: server + 'server.js',
        server: server,
        browserReloadDelay: 1000,
        defaultPort: 7203,
        optimized: {
            main: 'main.js',
            lib: 'lib.js'
        },
        specHelpers: [source + 'test-helpers/*.js'],
        serverIntegrationSpecs: [source + 'server-tests/**/*.spec.js'],
        specs: app + '**/*.spec.js',
        specRunner: source + specRunnerFile,
        specRunnerFile: specRunnerFile,
        testlibraries: [
            'node_modules/mocha/mocha.js',
            'node_modules/chai/chai.js',
            'node_modules/mocha-clean/index.js',
            'node_modules/sinon-chai/lib/sinon-chai.js'
        ]
    };

    config.karma = getKarmaOptions();

    return config;

    ////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                config.specHelpers,
                source + '**/*.module.js', //should have module files named differently so this will work
                source + '**/*.js',
                temp + config.templateCache.file,
                config.serverIntegrationSpecs
            ),
            exclude: [],
            coverage: {
                dir: report + 'reportcoverage',
                reporters: [
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'}
                ]
            },
            preprocessors: {}
        };

        options.preprocessors[app + '**/!(*.spec)+(.js)'] = ['coverage'];

        return options;
    }
};