module.exports = function (grunt) {


    var ftConfig = require('../grunt-config')(grunt).ft;

    var files = {
        '<%= ft.builtAssetsPath %>js/main.js': '<%= ft.srcPath %>js/' + (ftConfig.isModular ? 'main/' : '')  + 'main.js',
        '<%= ft.builtAssetsPath %>js/head.js': '<%= ft.srcPath %>js/head/main.js'
    };
    
    ftConfig.jsModules.forEach(function (module) {
        files['<%= ft.builtAssetsPath %>js/' + module + '.js'] = '<%= ft.srcPath %>js/' + module + '/main.js';
    });

    return {
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
};