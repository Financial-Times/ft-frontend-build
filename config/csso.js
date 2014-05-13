'use strict';

module.exports = function (grunt) {
    var files = {};
    var ftConfig = require(require('path').join(process.cwd(), 'responsive-ft-config.js'));

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