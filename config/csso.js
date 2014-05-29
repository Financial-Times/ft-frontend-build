'use strict';

var ftConfig = require('../get-config')().ft;

var files = {};
var moduleName;
var modules = require('../get-modules')('scss');

modules.forEach(function(fileName) {
    moduleName = fileName.split('/')[0].replace(/\.scss$/, '');
    files['<%= ft.builtAssetsPath %>css/' + moduleName + '.css'] = ['<%= ft.builtAssetsPath %>css/' + moduleName + '.css'];
});

module.exports = {
    prod: {
        files: files
    }
};
