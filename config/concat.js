module.exports = {
    head: {
        src: [
            '<%=path.js_src %>/vendor/es6-promise.js',
            '<%=path.js_src %>/head/feature-detects/*.js',
            '<%=path.js_src %>/head/detect.js',
            '<%=path.js_src %>/head/useragent.js',
            '<%=path.js_src %>/head/ctm.js',
            '<%= path.target %><%= static_assets_path.js %>head.js' // Build by browserify first
        ],
        dest: '<%= path.target %><%= static_assets_path.js %>head.js'
    },
    modernizr: {
        src: ['./src/main/resources/tmp/modernizr-custom.js', '<%= path.target %><%= static_assets_path.js %>/head.js'],
        dest: '<%= path.target %><%= static_assets_path.js %>head.js'
    }
};