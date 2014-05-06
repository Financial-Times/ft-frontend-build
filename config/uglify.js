module.exports = {
    head: {
        files: {'<%= path.target %><%= static_assets_path.js %>head.js': ['<%= concat.head.dest %>']}
    }
};