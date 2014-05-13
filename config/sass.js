module.exports = function (grunt) {

    var ftConfig = require('../grunt-config')(grunt).ft;
    var files = {
        '<%= ft.builtAssetsPath %>css/main.css': '<%= ft.srcPath %>scss/' + (ftConfig.isModular ? 'main/' : '')  + 'main.scss'
    };

    ftConfig.cssModules.forEach(function (module) {
        files['<%= ft.builtAssetsPath %>css/' + module + '.css'] = ['<%= ft.srcPath %>scss/' + module + '/main.scss'];
    });

    return {
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