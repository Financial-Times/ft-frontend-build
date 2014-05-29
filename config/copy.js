'use strict';

var ftConfig = require('../get-config')().ft;

module.exports = {
    bower: {
        expand: true,
        cwd: '<%= ft.bowerPath %>',
        src: [
            'o-*/*',
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
            '!*/demos/**/*',
            'package.json'
        ]
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
    assets: {
        expand: true,
        cwd: '<%= ft.srcPath %>',
        src: ['**/assets/**/*'].concat(ftConfig.copyIncludeList.map(function (glob) {
            if (glob.indexOf('./') !== 0) {
                glob = '<%= ft.bowerPath %>' + glob;
            }
            return glob;
        })),
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
                    // name after the bower module name
                    return dest + file.split('/').shift() + '.js';
                },
                dest: '<%= ft.builtAssetsPath %>js/polyfills/'
            },{
                expand: true,
                cwd: '<%= ft.srcPath %>',
                src: ftConfig.srcPolyfills,
                rename: function (dest, file) {
                    // name after the file name
                    return dest + file.split('/').pop();
                },
                dest: '<%= ft.builtAssetsPath %>js/polyfills/'
            }
        ]
    }
};