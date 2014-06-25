"use strict";

module.exports = {
    browser: {
        src: ['<%= ft.srcPath %>**/*.js', '!<%= ft.srcPath %>**/vendor/**/*.js'],
        options: (function () {
            var conf = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), '.jshintrc')));
            conf.browser = true;
            conf.node = true; // because browserify uses require, module etc.
            conf.globals.FT = true;
            conf.globals.Modernizr = true;
            conf.globals.Promise = true;
            return conf;
        })()
    }
};