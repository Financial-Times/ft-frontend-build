'use strict';

var ftConfig = require('../grunt-config')().ft;

module.exports = {
    bower: {
        expand: true,
        cwd: '<%= ft.bowerPath %>',
        src: [
            '**/*',
            '!*',
            '!o-*/main.*',
            '!o-*/**/*.js',
            '!o-*/**/*.scss',
            '!o-*/src',
            '!o-*/src/**/*',
            '!*/bower.json',
            '!*/origami.json',
            '!*/README.md',
            '!*/readme.md',
            '!*/demos',
            '!*/demos/**/*'
        ]
        .concat(ftConfig.copyIncludeList)
        .concat(
            (function () {
                var extras = [];
                return ftConfig.copyExcludeList.map(function (glob) {
                    if (glob.charAt(glob.length - 1) === '/') {
                        extras.push('!' + glob.slice(0, glob.length - 1));
                        return '!' + glob + '**/*';
                    }
                    return '!' + glob;
                }).concat(extras);
            })()
        ),
        dest: '<%= ft.builtAssetsPath %>'
    },
    test: {
        expand: true,
        cwd: './<%= ft.testPath %>',
        src: ['**/*'],
        dest: './src/test/_instrumented-js/'
    },
    polyfills: {
        files: [
            {
                expand: true,
                cwd: '<%= ft.bowerPath %>',
                src: ftConfig.bowerPolyfills,
                rename: function (dest, file) {
                    file = file.split('/');
                    return dest + file[0] + '.js';
                },
                dest: '<%= ft.builtAssetsPath %>js/polyfills/'
            },{
                expand: true,
                cwd: '<%= ft.srcPath %>/vendor',
                src: ftConfig.srcPolyfills,
                dest: '<%= ft.builtAssetsPath %>js/polyfills/'
            }
        ]
    }
};