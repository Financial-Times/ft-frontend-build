module.exports = {
    // head: {
    //     src: [
    //         '<%=path.js_src %>/vendor/es6-promise.js',
    //         '<%=path.js_src %>/head/feature-detects/*.js',
    //         '<%=path.js_src %>/head/detect.js',
    //         '<%=path.js_src %>/head/useragent.js',
    //         '<%=path.js_src %>/head/ctm.js',
    //         '<%= ft.builtAssetsPath %>js/head.js' // Build by browserify first
    //     ],
    //     dest: '<%= ft.builtAssetsPath %>js/head.js'
    // },
    modernizr: {
        src: ['<%= ft.srcPath %>tmp/modernizr-custom.js', '<%= ft.builtAssetsPath %>js/head.js'],
        dest: '<%= ft.builtAssetsPath %>js/head.js'
    }
};