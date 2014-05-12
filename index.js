module.exports = function (grunt) {
    "use strict";

    var path = require('path');
    var _ = require('lodash');

    var config = require(path.join(process.cwd(), 'grunt-config.js'));

    function queueTasks(queue, tasks, name) {

        // allows product dev to override blocks of the build
        tasks = config[name] !== undefined ? config[name] : tasks;

        // allows product dev to disable a block of tasks
        if (!tasks) {
            return;
        }

        // allows product devs to skip individual steps of the build
        tasks.forEach(function (task) {
            if (!config.skip.indexOf(task) && !config.skip.indexOf(task.split(':')[0])) {
                queue.push(task);
            }
        });

        return queue;
    }

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'node_modules/responsive-ft-grunt/config'),
        loadGruntTasks: {
            config: require('./package.json')
        },
        config: {
            ft: _.defaults(config, {
                pkg: require(path.join(process.cwd(),'package.json')),
                bwr: require(path.join(process.cwd(),'bower.json')),
                assetsVersion: grunt.option('assetVersion') || '0.0.1',
                bowerPath: './bower_components/',
                stageAssets: [],
                stagingPath: './tmp/',
                bowerPolyfills: [],
                srcPolyfills: [],
                cssModules: [],
                jsModules: [],
                skip: [],
                parallelTestAndBuild: false,
                defaultModule: config.isModular ? 'app/' : ''
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
        
        var tasks = [];

        if (mode === 'dev') {
            env = 'dev';
            mode = undefined;
        }

        if (!mode || mode === 'tpl') {

            queueTasks(tasks, [
                // constructs origami templates
                'copy:mustache-src-to-target',
                'build-templates',
                'minify-inline-head-script',
                'hogan-compile',
                'copy:mustache-target-to-public'
            ], 'tpl');
        }

        if (!mode || mode === 'js') {
            if (env === 'dev') {
                queueTasks(tasks, [
                    'jshint:browser',
                    'browserify:dev',
                    'browserify:headDev',
                    'concat:head'
                ], 'js:dev');
            } else {
                queueTasks(tasks, [
                    'browserify:main',
                    'browserify:head',
                    'concat:head'
                ], 'js:prod');
            }
        }

        if (!mode || mode === 'css') {
            
            queueTasks(tasks, ['sass-env-vars:create']);
            
            if (env === 'dev') {
                queueTasks(tasks, [
                    'sass:dev',
                    'sass:core-comments'
                    // 'sass-env-vars:clean', //removed because it makes intelli-j delete the css
                ], 'css:dev');
            } else {
                queueTasks(tasks, [
                    'sass:dist',
                    'sass:core-comments',
                    'csso:prod'
                    // 'sass-env-vars:clean', //removed because it makes intelli-j delete the css
                ], 'css:prod');
            }
        }

        if (!mode || mode === 'js') {
            if (env === 'dev') {
                grunt.file.copy('<%= ft.srcPath %>static/js/vendor/modernizr-dev.js', '<%= ft.srcPath %>tmp/modernizr-custom.js');
            } else {
                queueTasks(tasks, [
                    // analyze styles and scripts to generate custom modernizr build
                    'origami-modernizr'
                ]);
            }
            queueTasks(tasks, [
                // concatenate modernizr with the head scripts and minify
                'concat:modernizr'
            ]);

            if (env !== 'dev') {
                queueTasks(tasks, [
                    'uglify:head',
                    'copy:polyfills',
                    // discard the modernizr custom build
                    'clean:js'
                ]);
            }

        }

        if (!mode || mode === 'assets') {
            // copy static assets
            queueTasks(tasks, ['copy:bower'], 'assets');
        }

        grunt.task.run(tasks);
    });


    // Default
    // grunt.registerTask('default', ['parallel:ci']);
    grunt.registerTask('default', function () {
        grunt.task.run(queueTasks([], ['test', 'build']));
    });
};
