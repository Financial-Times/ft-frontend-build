'use strict';

var ftConfig = require('../grunt-config')().ft;
var files = {
    '<%= ft.builtAssetsPath %>css/main.css': '<%= ft.srcPath %>' + (ftConfig.isModular ? 'main/' : 'scss/')  + 'main.scss'
};

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