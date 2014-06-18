var ftConfig = require('../get-config')().ft;

module.exports = {
    options: {
        interrupt: true,
        debounceDelay: 250
    },
    sass: {
        files: ['<%= ft.srcPath %>**/*.scss', '<%= ft.bowerPath %>**/*.scss', '!<%= ft.srcPath %>**/tmp/*.scss'],
        tasks: ['build:css:dev']
    },
    js: {
        files: ['<%= ft.srcPath %>**/*.js', '<%= ft.bowerPath %>**/*.js', '!<%= ft.srcPath %>**/tmp/*.js'],
        tasks: ['build:js:dev']
    }
};

Object.keys(ftConfig.watch).forEach(function (subtask) {
    module.exports.subtask = ftConfig.watch[subtask];
});