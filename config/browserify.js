var ftConfig = require(require('path').join(process.cwd(), 'grunt-config.js'));
var mainFiles = {};
mainFiles[ftConfig.builtAssetsPath + 'js/main.js'] = '<%= ft.srcPath %><%= ft.defaultModule %>js/main.js';

var headFiles = {};
headFiles[ftConfig.builtAssetsPath + 'js/head.js'] = '<%= ft.srcPath %>head/js/main.js';

module.exports = {
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
            transform: ['debowerify', 'textrequireify'],
            bundleOptions: {
                debug: false
            }
        }
    },
    headDev: {
        files: headFiles,
        options: {
            transform: ['debowerify', 'textrequireify', ['uglifyify', {global: true}]],
            bundleOptions: {
                debug: true
            }
        }
    }
};