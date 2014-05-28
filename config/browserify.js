var ftConfig = require('../get-config')().ft;
var files = {};

var modules, moduleName;
modules = require('../get-modules')('js');

modules.forEach(function(fileName) {
    moduleName = fileName.split('/')[0].replace(/\.js$/, '');
    files['<%= ft.builtAssetsPath %>js/' + moduleName + '.js'] = '<%= ft.srcPath %>/' + fileName;
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