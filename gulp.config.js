module.exports = function() {
    "use strict";

    var temp = './.tmp/';

    var config = {
        temp: temp,
        alljs: [
            './*.js'
        ],
        build: './build/',
        index: './src/index.html',
        fonts: './bower_components/font-awesome/fonts/**/*.*',
        images: './src/images/**/*.*',
        less: './src/styles.less',
        css: temp + 'styles.css',
        js: './src/scripts/**/*.*',
        wiredepOptions: {
            bowerJson: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '../..'
        },
        nodeserver: './server/server.js',
        server: './server/',
        browserReloadDelay: 1000,
        defaultPort: 7203
    };

    return config;
};