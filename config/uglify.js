module.exports = {
    head: {
        files: {'<%= ft.builtAssetsPath %>js/head.js': ['<%= ft.concat.head.dest %>']}
    }
};