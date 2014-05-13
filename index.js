module.exports = function (grunt, loadConfig) {
    "use strict";
    loadConfig = loadConfig || {};
    var path = require('path');
    var _ = require('lodash');
    var deepDefault = _.partialRight(_.merge, _.defaults);

    var config = require('./grunt-config')(grunt);

    function queueTasks(queue, tasks) {

        // allows product devs to skip individual steps of the build
        tasks.forEach(function (task) {
            // console.log(task.split(':')[0]);
            if (!(config.ft.skipTasks.indexOf(task) > -1 || config.ft.skipTasks.indexOf(task.split(':')[0]) > -1)) {
                queue.push(task);
            }
        });

        return queue;
    }
    require('load-grunt-config')(grunt, deepDefault(loadConfig, {
        configPath: path.join(process.cwd(), 'node_modules/responsive-ft-grunt/config'),
        loadGruntTasks: {
            config: require('./package.json')
        },
        config: config
    }));

    var tasks = [];

    grunt.loadTasks(path.join(process.cwd(), 'node_modules/responsive-ft-grunt/tasks'));

    // Tasks available to run
    grunt.registerTask('test', [
        'jshint',
        'karma:phantom'
    ]);

    grunt.registerTask('browserTest', [
        'karma:browser'
    ]);

    var buildBlocks = {
        clean: function (mode, env, tasks) {
            if (!mode || mode === 'tpl') {
                queueTasks(tasks, ['clean:tpl']);
            } 
            if (!mode || mode === 'js' || mode === 'polyfill') {
                queueTasks(tasks, ['clean:js']);
            } 
            if (!mode || mode === 'css') {
                queueTasks(tasks, ['clean:css']);
            } 
            if (!mode || mode === 'assets') {
                queueTasks(tasks, ['clean:assets']);
            }
        },
        tpl: function (mode, env, tasks) {
            if (!mode || mode === 'tpl') {
                queueTasks(tasks, [
                    // constructs origami templates
                    'copy:mustache-src-to-target',
                    'build-templates',
                    'minify-inline-head-script',
                    'hogan-compile',
                    'copy:mustache-target-to-public'
                ]);
            }
        },
        js: function (mode, env, tasks) {
            if (!mode || mode === 'js') {
                if (env === 'dev') {
                    queueTasks(tasks, [
                        'jshint:browser',
                        'browserify:dev',
                        'browserify:headDev',
                        'concat:head'
                    ]);
                } else {
                    queueTasks(tasks, [
                        'browserify:main',
                        'browserify:head',
                        'concat:head'
                    ]);
                }
            }
        },
        css: function (mode, env, tasks) {
            if (!mode || mode === 'css') {
                
                queueTasks(tasks, ['sass-env-vars:create']);
                
                if (env === 'dev') {
                    queueTasks(tasks, [
                        'sass:dev',
                        // 'sass:core-comments'
                        // 'sass-env-vars:clean', //removed because it makes intelli-j delete the css
                    ]);
                } else {
                    queueTasks(tasks, [
                        'sass:dist',
                        // 'sass:core-comments',
                        'csso:prod'
                        // 'sass-env-vars:clean', //removed because it makes intelli-j delete the css
                    ]);
                }
            }
        },
        polyfill: function (mode, env, tasks) {
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
                        'clean:tmp'
                    ]);
                }
            }
        },
        assets: function (mode, env, tasks) {
            if (!mode || mode === 'assets') {
                // copy static assets
                queueTasks(tasks, ['copy:bower']);
            }
        }
    };
    
   
    grunt.registerTask('build', 'Building the front end', function (mode, env) {

        console.log("Building front-end with version number " + grunt.config.get('assetVersion'));
        
        if (mode === 'dev') {
            env = 'dev';
            mode = undefined;
        }

        var blocks = [];
        config.ft.blocks.forEach(function (block) {
            if (config.ft.skipBlocks.indexOf(block)=== -1) {
                blocks.push(block);
            }
        });

        blocks.forEach(function (block) {
            if (typeof block === 'string') {
                buildBlocks[block](mode, env, tasks);
            } else if (typeof block === 'function') {
                block(mode, env, tasks, grunt);
            }
        });

        grunt.task.run(tasks);
    });


    // Default
    // grunt.registerTask('default', ['parallel:ci']);
    grunt.registerTask('default', function () {
        grunt.task.run(queueTasks([], ['test', 'build']));
    });
};
