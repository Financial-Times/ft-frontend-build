'use strict';

module.exports = function(grunt) {

    grunt.registerTask('minify-inline-head-script', 'Removes whitespace from line-endings of javascript files', function () {
        var pathToInlineHeadScript = './target/views/common/inlineHeadScript.mustache';
        grunt.file.write(pathToInlineHeadScript, grunt.file.read(pathToInlineHeadScript).replace(/\s*\n\s*/g, ''));
        grunt.log.writeln('Removed whitespace from inline head script');
    });

};