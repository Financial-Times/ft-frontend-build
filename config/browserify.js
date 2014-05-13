module.exports = function (grunt) {
    var ftConfig = require('../grunt-config')(grunt).ft;
    var mainFiles = {};
    mainFiles[ftConfig.builtAssetsPath + 'js/main.js'] = '<%= ft.srcPath %>js/' + (ftConfig.isModular ? 'main/' : '')  + 'main.js';

    var headFiles = {};
    headFiles[ftConfig.builtAssetsPath + 'js/head.js'] = '<%= ft.srcPath %>js/head/main.js';

    return {
        main: {
            files: mainFiles,
            options: {
                transform: ['debowerify', 'textrequireify', ['uglifyify', {global: true}]],
                bundleOptions: {
                    debug: false
                }
            }
        },
        dev: {
            files: mainFiles,
            options: {
                transform: ['debowerify', 'textrequireify'],
                bundleOptions: {
                    debug: true
                }
            }
        },
        head: {
            files: headFiles,
            options: {
                transform: ['debowerify', 'textrequireify', ['uglifyify', {global: true}]],
                bundleOptions: {
                    debug: false
                }
            }
        },
        headDev: {
            files: headFiles,
            options: {
                transform: ['debowerify', 'textrequireify'],
                bundleOptions: {
                    debug: true
                }
            }
        }
    };
};