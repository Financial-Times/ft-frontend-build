'use strict';

var ftConfig = require('../get-config')().ft;

var files = {};
var moduleName;
var modules = require('../get-modules')('scss');

modules.forEach(function(fileName) {
    moduleName = fileName.split('/')[0].replace(/\.js$/, '');
    files['<%= ft.builtAssetsPath %>css/' + moduleName + '.css'] = ['<%= ft.builtAssetsPath %>css/' + moduleName + '.css'];
});

module.exports = {
    prod: {
        files: files
    }
};
