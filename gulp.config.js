module.exports = function() {
    "use strict";

    var temp = './.tmp/';
    var build = './build/';
    var source = './src/';
    var server = './server/';

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
        js: source + 'scripts/**/*.*',
        source: source,
        htmltemplates: source + 'templates/**/*.html',
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
        }
    };

    return config;
};