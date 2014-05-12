module.exports = function (grunt) {
    "use strict";

    var path = require('path');
    var _ = require('lodash');

    var config = require(path.join(process.cwd(), 'grunt-config.js'));

    // version number to build assets with
    config.assetsVersion = grunt.option('assetVersion') || '0.0.1';


    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'node_modules/responsive-ft-grunt/config'),
        loadGruntTasks: { 
            config: require('./package.json')
        },
        config: {
            ft: _.defaults(config, {
                pkg: require(path.join(process.cwd(),'package.json')),
                bwr: require(path.join(process.cwd(),'bower.json'))
            })
        }
    });


    grunt.loadTasks(path.join(process.cwd(), 'node_modules/responsive-ft-grunt/tasks'));

    // Tasks available to run
    grunt.registerTask('test', [
        'jshint',
        'karma:phantom'
    ]);

    grunt.registerTask('browserTest', [
        'karma:browser'
    ]);

    grunt.registerTask('build', 'Building the front end', function (mode, env) {

        console.log("Building front-end with version number " + grunt.config.get('static_assets_version'));
        
        if (mode === 'dev') {
            env = 'dev';
            mode = undefined;
        }

        if (!mode || mode === 'tpl') {
            grunt.task.run([
                // constructs origami templates
                'copy:mustache-src-to-target',
                'build-templates',
                'minify-inline-head-script',
                'hogan-compile',
                'copy:mustache-target-to-public'
            ]);
        }

        if (!mode || mode === 'js') {
            if (env === 'dev') {
                grunt.task.run([
                    'jshint:browser',
                    'browserify:dev'
                ]);
            } else {
                grunt.task.run([
                    'browserify:main'
                ]);
            }

            grunt.task.run([
                'browserify:head',
                'concat:head'
            ]);
        }


        if (!mode || mode === 'css') {
            
            grunt.task.run(['sass-env-vars:create']);
            
            if (env === 'dev') {
                grunt.task.run([
                    'sass:dev',
                    'sass:core-comments'
                    // 'sass-env-vars:clean', //removed because it makes intelli-j delete the css
                ]);
            } else {
                grunt.task.run([
                    'sass:dist',
                    'sass:core-comments',
                    'csso:prod'
                    // 'sass-env-vars:clean', //removed because it makes intelli-j delete the css
                ]);
            }
        }

        if (!mode || mode === 'js') {
            if (env === 'dev') {
                grunt.file.copy('<%= ft.srcPath %>static/js/vendor/modernizr-dev.js', '<%= ft.srcPath %>tmp/modernizr-custom.js');
            } else {
                grunt.task.run([
                    // analyze styles and scripts to generate custom modernizr build
                    'origami-modernizr'
                ]);
            }
            grunt.task.run([
                // concatenate modernizr with the head scripts and minify
                'concat:modernizr'
            ]);

            if (env !== 'dev') {
                grunt.task.run([
                    'uglify:head',
                    'copy:polyfills',
                    // discard the modernizr custom build
                    'clean:js'
                ]);
            }

        }

        if (!mode || mode === 'assets') {
            // copy static assets
            grunt.task.run(['copy:bower']);
        }
    });


    // Default
    // grunt.registerTask('default', ['parallel:ci']);
    grunt.registerTask('default', ['test', 'build']);
};
