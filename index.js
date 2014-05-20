module.exports = function (grunt, loadConfig) {
    "use strict";

    var path = require('path');
    var _ = require('lodash');
    var deepDefault = _.partialRight(_.merge, function deep(a, b) {
      return _.merge(a, b, deep);
    });
    function queueTasks(queue, tasks) {

        // allows product devs to skip individual steps of the build
        tasks.forEach(function (task) {
            if (!(config.ft.skipTasks.indexOf(task) > -1 || config.ft.skipTasks.indexOf(task.split(':')[0]) > -1)) {
                queue.push(task);
            }
        });

        return queue;
    }


    var buildBlocks = {
        tpl: function () {},
        clean: function (mode, env, tasks) {
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

        js: function (mode, env, tasks) {
            if (!mode || mode === 'js') {
                if (env === 'dev') {
                    queueTasks(tasks, [
                        'jshint:browser',
                        'browserify:dev',
                        'inline-head-script:dev'
                    ]);
                } else {
                    queueTasks(tasks, [
                        'browserify:prod',
                        'inline-head-script:prod'
                    ]);
                }
            }
        },
        css: function (mode, env, tasks) {
            if (!mode || mode === 'css') {
                
                if (env === 'dev') {
                    queueTasks(tasks, [
                        'sass:dev'
                    ]);
                } else {
                    queueTasks(tasks, [
                        'sass:prod',
                        'csso:prod'
                    ]);
                }
            }
        },
        polyfill: function (mode, env, tasks) {
            if (!mode || mode === 'js' || mode === 'polyfill') {
                if (env === 'dev') {
                    grunt.file.copy(path.join(process.cwd(), 'node_modules/ft-frontend-build/assets/modernizr-dev.js'), config.ft.stagingPath + 'modernizr-custom.js');
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
                        'copy:polyfills'
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

    var config = require('./get-config')(grunt);
    var tasks = [];

    require('load-grunt-config')(grunt, deepDefault((loadConfig || {}), {
        configPath: path.join(process.cwd(), 'node_modules/ft-frontend-build/config'),
        loadGruntTasks: {
            config: require('./package.json')
        },
        config: config
    }));

    grunt.config.set('watch', _.defaults(config.ft.watch, grunt.config.get('watch')));

    grunt.loadTasks(path.join(process.cwd(), 'node_modules/ft-frontend-build/tasks'));

    switch (config.ft.templating.type) {
        case 'hogan-express' : 
            buildBlocks.tpl = function (mode, env, tasks) {
                if (!mode || mode === 'tpl') {
                    queueTasks(tasks, ['hogan-express']);
                }
            };
            break;
    }


    grunt.registerTask('test', [
        'jshint',
        'karma:phantom'
    ]);

    grunt.registerTask('browserTest', [
        'karma:browser'
    ]);
   
    grunt.registerTask('build', 'Building the front end', function (mode, env) {

        console.log("Building front-end with version number " + grunt.config.get('assetVersion'));
        
        if (mode === 'dev') {
            env = 'dev';
            mode = undefined;
        }

        var blocks = [];

        config.ft.blocks.forEach(function (block) {
            if (config.ft.skipBlocks.indexOf(block) === -1) {
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
