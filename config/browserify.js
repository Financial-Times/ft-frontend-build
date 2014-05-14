var ftConfig = require('../get-config')().ft;

var files = {
    '<%= ft.builtAssetsPath %>js/main.js': '<%= ft.srcPath %>' + (ftConfig.isModular ? 'main/' : 'js/')  + 'main.js',
    '<%= ft.builtAssetsPath %>js/head.js': '<%= ft.srcPath %>' + (ftConfig.isModular ? '' : 'js/') + 'head/main.js'
};

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