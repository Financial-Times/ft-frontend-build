var ftConfig = require('../get-config')().ft;
var files = {};

var modules, moduleName;
modules = require('../get-modules')('js');

modules.forEach(function(fileName) {
    var splitFileName = fileName.split('/');
    moduleName = (ftConfig.isModular ? splitFileName[0] : splitFileName.pop().replace(/\.js$/, ''));
    files['<%= ft.builtAssetsPath %>js/' + moduleName + '.js'] = '<%= ft.builtAssetsPath %>js/' + moduleName + '.js';
});

module.exports = {
    prod: {
        files: files
    },
    head: {
        files: {'<%= ft.builtAssetsPath %>js/head.js': ['<%= ft.builtAssetsPath %>js/head.js']}
    }
};