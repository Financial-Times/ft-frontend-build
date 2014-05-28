'use strict';

var ftConfig = require('../get-config')().ft;

var files = {};
var moduleName;
var modules = require('../get-modules')('scss');

modules.forEach(function(fileName) {
    moduleName = fileName.split('/')[0].replace(/\.js$/, '');
    files['<%= ft.builtAssetsPath %>css/' + moduleName + '.css'] = '<%= ft.srcPath %>/' + fileName;
});


ftConfig.cssModules.forEach(function (module) {
    files['<%= ft.builtAssetsPath %>css/' + module + '.css'] = ['<%= ft.srcPath %>' + module + '/main.scss'];
});

module.exports = {
    prod: {
        options: {
            loadPath: ['.', '<%= ft.bowerPath %>'],
            style: 'compressed'
        },
        files: files
    },
    dev: {
        options: {
            loadPath: ['.', '<%= ft.bowerPath %>'],
            style: 'expanded'
        },
        files: files
    }
};

// ,
//     'core-comments': {
//         options: {
//             loadPath: ['.', '<%= ft.bowerPath %>'],
//             style: 'compressed'
//         },
//         files: {
//             '<%= ft.builtAssetsPath %>css/core-comments.css': '<%= ft.srcPath %>static/scss/article/core-comments.scss'
//         }
//     }
// };