module.exports = {
    sass: {
        files: ['<%= ft.srcPath %>**/*.scss', '<%= ft.bowerPath %>**/*.scss', '!<%= ft.srcPath %>**/tmp/*.scss'],
        tasks: ['build:css:dev']
    },
    js: {
        files: ['<%= ft.srcPath %>**/*.js', '<%= ft.bowerPath %>**/*.js', '!<%= ft.srcPath %>**/tmp/*.js'],
        tasks: ['build:js:dev']
    }
};