module.exports = {
    modernizr: {
        src: ['<%= ft.stagingPath %>modernizr-custom.js', '<%= ft.builtAssetsPath %>js/head.js'],
        dest: '<%= ft.builtAssetsPath %>js/head.js'
    }
};