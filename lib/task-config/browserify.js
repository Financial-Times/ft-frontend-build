var ftConfig = require('../get-config')().ft;
var files = {};

var modules, moduleName;
modules = require('../get-modules')('js');

modules.forEach(function(fileName) {
    var splitFileName = fileName.split('/');
    moduleName = (ftConfig.isModular ? splitFileName[0] : splitFileName.pop().replace(/\.js$/, ''));
    files['<%= ft.builtAssetsPath %>js/' + moduleName + '.js'] = '<%= ft.srcPath %>/' + fileName;
});

module.exports = {
    prod: {
        files: files,
        options: {
            transform: ['debowerify', 'textrequireify'],
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