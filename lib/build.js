module.exports = function (grunt, loadConfig) {
    "use strict";

    var path = require('path');
    var _ = require('lodash');
    var deepDefault = _.partialRight(_.merge, function deep(a, b) {
      return _.merge(a, b, deep);
    });

    // Bundles of build tasks representing more macro-level build steps, so that devs can opt-in/out of them wholesale
    var buildBlocks = require('./task-bundles');


    // Read and initialise with config
    var config = require('./get-config')(grunt);
    var tasks = [];

    require('load-grunt-config')(grunt, deepDefault((loadConfig || {}), {
        configPath: path.join(process.cwd(), 'node_modules/ft-frontend-build/lib/task-config'),
        loadGruntTasks: {
            config: require('../package.json')
        },
        config: config
    }));

    grunt.config.set('watch', _.defaults(config.ft.watch, grunt.config.get('watch')));

    grunt.loadTasks(path.join(process.cwd(), 'node_modules/ft-frontend-build/lib/tasks'));

    // add templating task if needed
    switch (config.ft.templating.type) {
        case 'hogan-express' :
            buildBlocks.tpl = function (mode, env, tasks) {
                if (!mode || mode === 'tpl') {
                    grunt.ftQueueTasks(tasks, ['hogan-express']);
                }
            };
            break;
    }

    // Configurable build task
    grunt.registerTask('build', 'Building the front end', function (mode, env) {

        console.log("Building front-end with version number " + grunt.config.get('assetVersion'));
        
        // handle optional cli parameters
        if (mode === 'dev') {
            env = 'dev';
            mode = undefined;
        }

        var blocks = [];

        // skip any blocks as indicated by config
        config.ft.blocks.forEach(function (block) {
            if (config.ft.skipBlocks.indexOf(block) === -1) {
                blocks.push(block);
            }
        });

        blocks.forEach(function (block) {
            // If the named build block exists, queue it
            if (typeof block === 'string' && buildBlocks[block]) {
                buildBlocks[block](mode, env, tasks);
            // Otherwise assume the string refers to a specifi grunt task, and queue it
            } else if (typeof block === 'string') {
                tasks.push(block);
            // Otherwise run the function (which should add tasks to the queue)
            } else if (typeof block === 'function') {
                block(mode, env, tasks, grunt);
            }
        });

        // Run all the tasks added to the queue
        grunt.task.run(tasks);
    });


    // Default
    // grunt.registerTask('default', ['parallel:ci']);
    grunt.registerTask('default', function () {
        grunt.task.run(grunt.ftQueueTasks([], ['build']));
    });
};
