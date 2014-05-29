'use strict';

var ftConfig = require('../get-config')().ft;

module.exports = {
    bower: {
        expand: true,
        cwd: '<%= ft.bowerPath %>',
        src: [
            'o-*/**/*', // copy everything from each origami module except ...
            '!*', // the directory itself (avoids copying an empty directory in the case where everything in teh module isn't required)
            '!o-*/main.*', // none of the nain entry points as these are handled by browserify, sass, or templating
            '!o-*/**/*.js', // ditto js
            '!o-*/**/*.scss', // ditto sass
            '!o-*/src', // ditto anything in a src folder
            '!o-*/src/**/*',
            '!*/bower.json', // metadata and install info not required publicly
            '!*/origami.json',
            '!*/package.json',
            '!*/README.md',
            '!*/readme.md',
            '!*/demos',
            '!*/demos/**/*',
            '!*/docs',
            '!*/docs/**/*'
        ]
        // Add exclude list from config
        .concat(
            (function () {
                var extras = [];
                return ftConfig.copyExcludeList.map(function (glob) {

                    // creates '!*/dir' and '!*/dir/**/*' entries for each directory whch isn't required
                    if (glob.charAt(glob.length - 1) === '/') {
                        extras.push('!' + glob.slice(0, glob.length - 1));
                        return '!' + glob + '**/*';
                    }
                    // otherwise just negate the pattern passed in
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