module.exports = function() {
    "use strict";

    var temp = './.tmp/';
    var build = './build/';
    var source = './src/';
    var scripts = source + 'scripts/';
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
        js: scripts + '**/*.*',
        source: source,
        htmltemplates: source + 'templates/**/*.html',
        packages: [
            './package.json',
            './bower.json'
        ],
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'TasksList',
                standAlone: false,
                root: 'templates/'
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
        specs: scripts + '**/*.spec.js',
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

        options.preprocessors[scripts + '**/!(*.spec)+(.js)'] = ['coverage'];

        return options;
    }
};