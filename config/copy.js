'use strict';

module.exports = {
    'mustache-src-to-staging': {
        expand: true,
        cwd: '<%= ft.srcPath %>',
        src: '**/*.mustache',
        dest: '<%= ft.stagingPath %>'
    },
    'mustache-staging-to-built': {
        expand: true,
        cwd: '<%= ft.stagingPath %>',
        src: '**/*.mustache',
        dest: '<%= ft.builtPath %>'
    },
    'mustache-src-to-built': {
        expand: true,
        cwd: '<%= ft.srcPath %>',
        src: '**/*.mustache',
        dest: '<%= ft.builtPath %>'
    },
    bower: {
        expand: true,
        cwd: '<%= ft.bowerPath %>',
        src: ['**/*', '!o-*/**/*.js', '!o-*/**/*.scss'],
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
                src: grunt.config.get('ft.bowerPolyfills'),
                rename: function (dest, file) {
                    file = file.split('/');
                    return dest + file[0] + '.js';
                },
                dest: '<%= ft.builtAssetsPath %>js/polyfills/'
            },{
                expand: true,
                cwd: '<%= ft.srcPath %>/vendor',
                src: grunt.config.get('ft.srcPolyfills'),
                dest: '<%= ft.builtAssetsPath %>js/polyfills/'
            }
        ]
    }
};
