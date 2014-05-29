'use strict';

var ftConfig = require('../get-config')().ft;

var files = {};
var moduleName;
var modules = require('../get-modules')('scss');

modules.forEach(function(fileName) {
    var splitFileName = fileName.split('/');
    moduleName = (ftConfig.isModular ? splitFileName[0] : splitFileName.pop().replace(/\.scss$/, ''));
    files['<%= ft.builtAssetsPath %>css/' + moduleName + '.css'] = ['<%= ft.builtAssetsPath %>css/' + moduleName + '.css'];
});

module.exports = {
    prod: {
        files: files
    }
};
