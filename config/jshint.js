"use strict";

var fs = require('fs');

function cloneObj (obj) {
    return JSON.parse(JSON.stringify(obj));
}

var jshintrc = JSON.parse(fs.readFileSync('./.jshintrc')),
    jshintConfigs = {
        node: (function () {
            var conf = cloneObj(jshintrc);
            conf.browser = false;
            conf.node = true;
            return conf;
        })(),
        browser: (function () {
            var conf = cloneObj(jshintrc);
            conf['-W040'] = false; // setting var that = this in debounce
            conf['-W030'] = false; // using el.offsetWidth to trigger redraw
            conf.browser = true;
            conf.node = true;
            conf.globals.FT = true;
            conf.globals.Modernizr = true;
            conf.globals.Promise = true;
            return conf;
        })(),
        test: (function () {
            var conf = cloneObj(jshintrc);
            conf.node = true;
            conf.browser = true;
            conf.globals.FT = true;
            conf.globals.o = true;
            conf.globals.jasmine = true;
            conf.globals.describe = true;
            conf.globals.it = true;
            conf.globals.xdescribe = true;
            conf.globals.xit = true;
            conf.globals.spyOn = true;
            conf.globals.expect = true;
            conf.globals.beforeEach = true;
            conf.globals.afterEach = true;
            conf.globals.expect = true;
            return conf;
        })()
    };

module.exports = {
    node: {
        src: ['Gruntfile.js', 'grunt-tasks/**/*.js', 'grunt-config/*.js'],
        options: jshintConfigs.node
    },
    browser: {
        src: ['<%= ft.srcPath %>**/*.js', '!<%= ft.srcPath %>/vendor/**/*.js', '!<%= ft.srcPath %>**/*.hogan.js'],
        options: jshintConfigs.browser
    },
    test: {
        src: ['<%= ft.testPath %>**/*.js'],
        options: jshintConfigs.test
    }
};