module.exports = function(grunt) {
    "use strict";

    grunt.registerTask('remove-whitespace', 'Removes whitespace from line-endings of javascript files', function () {
        grunt.config.requires('remove-whitespace.files');

        grunt.file.expand(grunt.config('remove-whitespace.files')).forEach(function (file) {
            grunt.file.write(file, grunt.file.read(file).replace(/\s*\n\s*/g, ''));
            grunt.log.writeln('Removed whitespace from ' + file);
        });
    });

};