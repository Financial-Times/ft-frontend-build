'use strict';

module.exports = {
    'mustache-src-to-target': {
        expand: true,
        cwd: './src/main/resources/',
        src: 'views/**/*.mustache',
        dest: './target/'
    },
    'mustache-target-to-public': {
        expand: true,
        cwd: './target/',
        src: 'views/**/*.mustache',
        dest: './target/classes/'
    },
    bower: {
        expand: true,
        cwd: '<%=path.bower %>/',
        src: ['**/*', '!o-*/**/*.js', '!o-*/**/*.scss'],
        dest: '<%= path.target %><%= path.static_assets_base %>'
    },
    test: {
        expand: true,
        cwd: './src/test/js/',
        src: ['**/*'],
        dest: './src/test/_instrumented-js/'
    },
    polyfills: {
        files: [
            {
                expand: true,
                cwd: '<%=path.bower %>/',
                src: ['es5-shim/es5-shim.min.js', 'event-listener/eventListener.polyfill.min.js', 'classlist/classList.min.js', 'custom-event/custom-event-polyfill.js'],
                rename: function (dest, file) {
                    file = file.split('/');
                    return dest + file[0] + '.js';
                },
                dest: '<%= path.target %><%= path.static_assets_base %>/js/polyfills/'
            },{
                expand: true,
                cwd: './src/main/resources/static/js/vendor',
                src: ['es6-promise.js'],
                dest: '<%= path.target %><%= path.static_assets_base %>/js/polyfills/'
            }
        ]
    }
};
