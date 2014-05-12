module.exports = {
    dist: {
        options: {
            loadPath: ['.', '<%= ft.bowerPath %>'],
            style: 'compressed'
        },
        files: {
            '<%= ft.builtAssetsPath %>css/main.css': '<%= ft.srcPath %>app/sass/main.scss'
        }
    },
    dev: {
        options: {
            loadPath: ['.', '<%= ft.bowerPath %>'],
            style: 'expanded'
        },
        files: {
            '<%= ft.builtAssetsPath %>css/main.css': '<%= ft.srcPath %>app/sass/main.scss'
        }
    }
};

// ,
//     'core-comments': {
//         options: {
//             loadPath: ['.', '<%= ft.bowerPath %>'],
//             style: 'compressed'
//         },
//         files: {
//             '<%= ft.builtAssetsPath %>css/core-comments.css': '<%= ft.srcPath %>static/sass/article/core-comments.scss'
//         }
//     }
// };