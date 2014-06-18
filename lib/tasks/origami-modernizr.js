'use strict';

module.exports = function(grunt) {

    var fs = require('fs');

    function getBowerComponents() {
        var bowerFolder = grunt.config.get('ft.bowerPath'),
            bowerFolderContents = fs.readdirSync(bowerFolder),
            bowerComponentFolders = [];
        bowerFolderContents.forEach(function(item){
            if (fs.statSync(bowerFolder + item).isDirectory()) {
                bowerComponentFolders.push(bowerFolder + item);
            }
        });
        return bowerComponentFolders;
    }

    function getOrigamiJson(path) {
        var origamiJson = false;
        if (fs.existsSync(path)) {
            try {
                origamiJson = JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }));
            } catch (e) {
                console.log('invalid origami.json at' + path);
            }
        }
        return origamiJson;
    }

    function getOrigamiJsons() {
        var bowerModulePaths = getBowerComponents(),
            origamiJsons = [];
        bowerModulePaths.push('.'); // also include module's own bower.json
        bowerModulePaths.forEach(function(path) {
            var origamiJson = getOrigamiJson(path + '/origami.json');
            if (origamiJson) {
                origamiJsons.push(origamiJson);
            }
        });
        return origamiJsons;
    }

    function addIfNew(a, v) {
        if (a.indexOf(v) === -1) {
            a.push(v);
        }
        return a;
    }

    function getOrigamiModuleFeatures() {
        var origamiJsons = getOrigamiJsons(),
            all = [],
            required = [],
            optional = [];
        origamiJsons.forEach(function(origamiJson) {
            if (origamiJson.browserFeatures) {
                if (origamiJson.browserFeatures.required) {
                    origamiJson.browserFeatures.required.forEach(function(feature){
                        all = addIfNew(all, feature);
                        required = addIfNew(required, feature);
                    });
                }
                if (origamiJson.browserFeatures.optional) {
                    origamiJson.browserFeatures.optional.forEach(function(feature){
                        all = addIfNew(all, feature);
                        optional = addIfNew(optional, feature);
                    });
                }
            }
        });
        return {
            all: all,
            required: required,
            optional: optional
        };
    }

    grunt.task.registerTask("origami-modernizr", "", function() {

        grunt.config.requires('ft.bowerPath');
        // grunt.loadTasks("./node_modules/grunt-origami-demoer/node_modules/grunt-modernizr/tasks");

        var browserFeatures = getOrigamiModuleFeatures();

        grunt.log.writeln("Reading module and dependencies' origami.json files...");
        grunt.log.writeln("* Required browserFeatures: " + JSON.stringify(browserFeatures.required));
        grunt.log.writeln("* Optional browserFeatures: " + JSON.stringify(browserFeatures.optional));

        grunt.config.set('modernizr.prod.tests', (grunt.config.get('modernizr.prod.tests') || []).concat(browserFeatures.all));
        grunt.task.run('modernizr:prod');

    });

};