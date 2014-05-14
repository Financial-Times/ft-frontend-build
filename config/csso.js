'use strict';

module.exports = function (grunt) {

    var ftConfig = require('../grunt-config')(grunt).ft;

    var files = {
        '<%= ft.builtAssetsPath %>css/main.css': ['<%= ft.builtAssetsPath %>css/main.css']
    };
    
    ftConfig.cssModules.forEach(function (module) {
        files['<%= ft.builtAssetsPath %>css/' + module + '.css'] = ['<%= ft.builtAssetsPath %>css/' + module + '.css'];
    });

    return {
        prod: {
            files: files
        }
    };
};