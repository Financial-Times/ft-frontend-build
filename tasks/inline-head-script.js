'use strict';

module.exports = function(grunt) {

    var ftConfig = require('../grunt-config')().ft;

    grunt.registerTask('inline-head-script', 'Removes whitespace from line-endings of javascript files', function (mode) {
        var pathToInlineHeadScript = '<%= ft.srcPath %>' + (ftConfig.isModular ? '' : 'js/') + 'head/inlineScript.mustache';
        var script = grunt.file.read(pathToInlineHeadScript);
        var path = require('path')

        if (mode === 'dev') {
            script = script.replace(/\s*\n\s*/g, '');
        }

        ftConfig.inlineHeadScriptDestinations.forEach(function (dest) {
            grunt.file.write(dest, script);
            grunt.log.writeln('Copied inline head script to' + path.join(process.cwd(), dest));
        });
    });

};