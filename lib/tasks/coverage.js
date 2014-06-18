module.exports = function(grunt) {
    "use strict";

    grunt.registerTask('relocate-instrumented', function () {
        grunt.file.recurse('./_instrumented-js/src/main/resources/static/js', function (abspath, rootdir, subdir, filename) {
            console.log('./src/main/resources/static/_instrumented-js/' + subdir + '/' + filename);
            grunt.file.copy(abspath, './src/main/resources/static/_instrumented-js/' + subdir + '/' + filename);
        });
    });

    grunt.registerTask('rewrite-paths-to-instrumented', function () {
        grunt.file.recurse('./src/test/_instrumented-js', function (abspath, rootdir, subdir, filename) {
            if (/\.js$/.test(filename)) {
                var contents = grunt.file.read(abspath)
                                .replace(/\/base\/src\/test\/js/g, '/base/src/test/_instrumented-js')
                                .replace(/\/main\/resources\/static\/js/g, '/main/resources/static/_instrumented-js');
                grunt.file.write(abspath, contents);
            }
        });
    });

    grunt.registerTask('coverage', 'Runs javascript tests with code coverage', function () {

        grunt.task.run([
            'clean:coverage',
            'copy:test',
            'instrument',
            'relocate-instrumented',
            'rewrite-paths-to-instrumented',
            'karma:coverage',
            'clean:coverage'
        ]);

    });

};