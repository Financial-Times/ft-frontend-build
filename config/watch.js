module.exports = {
    mustache: {
        files: ['./src/main/resources/views/**/*'],
        tasks: ['build:tpl']
    },
    sass: {
        files: ['./src/main/resources/**/*.scss'],
        tasks: ['build:css:dev']
    },
    js: {
        files: ['./src/main/resources/**/*.js', '!./src/main/resources/**/tmp/*.js'],
        tasks: ['build:js:dev']
    }
};