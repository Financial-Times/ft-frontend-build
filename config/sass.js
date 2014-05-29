'use strict';

var ftConfig = require('../get-config')().ft;

var files = {};
var moduleName;
var modules = require('../get-modules')('scss');

modules.forEach(function(fileName) {
    var splitFileName = fileName.split('/');
    moduleName = (ftConfig.isModular ? splitFileName[0] : splitFileName.pop().replace(/\.scss$/, ''));
    files['<%= ft.builtAssetsPath %>css/' + moduleName + '.css'] = '<%= ft.srcPath %>/' + fileName;
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