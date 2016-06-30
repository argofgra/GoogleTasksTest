module.exports = function() {
    "use strict";

    var temp = './.tmp/';

    var config = {
        temp: temp,
        alljs: [
            './*.js'
        ],
        index: './index.html',
        less: 'styles.less',
        css: temp + 'styles.css',
        js: './scripts/**/*.js',
        wiredepOptions: {
            bowerJson: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '../..'
        }
    };

    return config;
};