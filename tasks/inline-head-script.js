'use strict';

module.exports = function(grunt) {

    var ftConfig = require('../get-config')().ft;

    grunt.registerTask('inline-head-script', 'Removes whitespace from line-endings of javascript files', function (mode) {
        var pathToInlineHeadScript = ftConfig.srcPath + (ftConfig.isModular ? 'head/' : 'js/') + 'inlineScript.mustache';
        var script = grunt.file.read(pathToInlineHeadScript);
        var path = require('path');

        if (mode === 'dev') {
            script = script.replace(/\s*\n\s*/g, '');
        }

        ftConfig.inlineHeadScriptDestinations.forEach(function (dest) {
            grunt.file.write(path.join(process.cwd(), dest + 'inlineScript.mustache'), script);
            grunt.log.writeln('Copied inline head script to' + dest);
        });
    });

};