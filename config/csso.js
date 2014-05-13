'use strict';

module.exports = function (grunt) {
    var files = {};
    var ftConfig = require('../grunt-config')(grunt).ft;

    files[ftConfig.builtAssetsPath  + 'css/main.css'] = ['<%= ft.builtAssetsPath %>css/main.css'];
    ftConfig.cssModules.forEach(function (module) {
        files[ftConfig.builtAssetsPath  + 'css/' + module + '.css'] = ['<%= ft.builtAssetsPath %>css/' + module + '.css'];
    });

    return {
        prod: {
            files: files
        }
    };
};