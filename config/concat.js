module.exports = {
    modernizr: {
        src: ['<%= ft.srcPath %>tmp/modernizr-custom.js', '<%= ft.builtAssetsPath %>js/head.js'],
        dest: '<%= ft.builtAssetsPath %>js/head.js'
    }
};