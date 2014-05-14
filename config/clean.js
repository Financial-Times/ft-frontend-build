module.exports = {
    tmp: ['<%= ft.srcPath %>tmp'],
    js: ['<%= ft.builtAssetsPath %>js'],
    css: ['<%= ft.builtAssetsPath %>css'],
    assets: ['<%= ft.builtAssetsPath %>', '!<%= ft.builtAssetsPath %>css', '!<%= ft.builtAssetsPath %>js']
    //coverage: ['./_instrumented-js', './src/test/_instrumented-js', '<%= ft.srcPath %>static/_instrumented-js']
};