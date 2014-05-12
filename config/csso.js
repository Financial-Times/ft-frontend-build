module.exports = function (grunt) {
    var files = {
        '<%= ft.builtAssetsPath %>css/main.css': ['<%= ft.builtAssetsPath %>css/main.css']
    };

    grunt.config.get('ft.cssModules').forEach(function (module) {
        files['<%= ft.builtAssetsPath %>css/' + module + '.css'] = ['<%= ft.builtAssetsPath %>css/' + module + '.css'];
    });

    return {
        prod: {
            files: files
        }
    };
};