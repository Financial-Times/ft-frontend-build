'use strict';

var grunt = require('grunt');
var config = require('./get-config')(grunt);

    // Adds tasks to the build queue if config settings don't indicate the task shoudl be skipped
grunt.ftQueueTasks = function (queue, tasks) {

    tasks.forEach(function (task) {
        if (!(config.ft.skipTasks.indexOf(task) > -1 || config.ft.skipTasks.indexOf(task.split(':')[0]) > -1)) {
            queue.push(task);
        }
    });

    return queue;
};

module.exports = {

    // placeholder for template building. Can be overridden by product dev, or set to one of a set of defaults using the templating.type option 
    tpl: function () {},
    
    // cleans static asset directories
    clean: function (mode, env, tasks) {
        if (!mode || mode === 'js') {
            grunt.ftQueueTasks(tasks, ['clean:js']);
        }
        if (!mode || mode === 'css') {
            grunt.ftQueueTasks(tasks, ['clean:css']);
        }
        if (!mode || mode === 'assets') {
            grunt.ftQueueTasks(tasks, ['clean:assets']);
        }
    },

    // browserifies javascripts and copies polyfills to public directory
    js: function (mode, env, tasks) {
        if (!mode || mode === 'js') {
            if (env === 'dev') {
                grunt.ftQueueTasks(tasks, [
                    'jshint:browser',
                    'browserify:dev',
                    'inline-head-script:dev'
                ]);
            } else {
                grunt.ftQueueTasks(tasks, [
                    'browserify:prod',
                    'inline-head-script:prod'
                ]);
            }

            grunt.ftQueueTasks(tasks, ['copy:polyfills']);
        }
    },

    // builds and optimises sass
    css: function (mode, env, tasks) {
        if (!mode || mode === 'css') {
            
            if (env === 'dev') {
                grunt.ftQueueTasks(tasks, [
                    'sass:dev'
                ]);
            } else {
                grunt.ftQueueTasks(tasks, [
                    'sass:prod',
                    'csso:prod'
                ]);
            }
        }
    },

    // creates custom modernizr build and adds to headscript
    modernize: function (mode, env, tasks) {
        if (!mode || mode === 'js' || mode === 'modernize') {
            if (env === 'dev') {
                grunt.file.copy(path.join(process.cwd(), 'node_modules/ft-frontend-build/assets/modernizr-dev.js'), config.ft.stagingPath + 'modernizr-custom.js');
            } else {
                grunt.ftQueueTasks(tasks, [
                    // analyze styles and scripts to generate custom modernizr build
                    'origami-modernizr'
                ]);
            }
            grunt.ftQueueTasks(tasks, [
                // concatenate modernizr with the head scripts and minify
                'concat:modernizr'
            ]);

            if (env !== 'dev') {
                grunt.ftQueueTasks(tasks, [
                    'uglify:head'
                ]);
            }
        }
    },

    // copies other static assets to public
    assets: function (mode, env, tasks) {
        if (!mode || mode === 'assets') {
            // copy static assets
            grunt.ftQueueTasks(tasks, ['copy:bower', 'copy:assets']);
        }
    }
};