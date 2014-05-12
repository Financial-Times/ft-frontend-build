module.exports = {
    js: ['<%= ft.srcPath %>tmp'],
    coverage: ['./_instrumented-js', './src/test/_instrumented-js', '<%= ft.srcPath %>static/_instrumented-js']
};