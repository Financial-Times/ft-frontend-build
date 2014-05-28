var ftConfig = require('../get-config')().ft;
var files = {};

var modules, moduleName;
modules = require('../get-modules')('js');

modules.forEach(function(fileName) {
    moduleName = fileName.split('/')[0].replace(/\.js$/, '');
    files['<%= ft.builtAssetsPath %>js/' + moduleName + '.js'] = '<%= ft.srcPath %>/' + fileName;
});

ftConfig.jsModules.forEach(function (module) {
    files['<%= ft.builtAssetsPath %>js/' + module + '.js'] = '<%= ft.srcPath %>' + module + '/main.js';
});

module.exports = {
    prod: {
        files: files,
        options: {
            transform: ['debowerify', 'textrequireify', ['uglifyify', {global: true}]],
            bundleOptions: {
                debug: false
            }
        }
    },
    dev: {
        files: files,
        options: {
            transform: ['debowerify', 'textrequireify'],
            bundleOptions: {
                debug: true
            }
        }
    }
};