module.exports = {
    dist: {
        options: {
            loadPath: ['.', './src/main/resources/modules'],
            style: 'compressed'
        },
        files: {
            '<%= path.target %><%= static_assets_path.css %>main.css': './src/main/resources/static/sass/main.scss'
        }
    },
    dev: {
        options: {
            loadPath: ['.', './src/main/resources/modules'],
            style: 'expanded'
        },
        files: {
            '<%= path.target %><%= static_assets_path.css %>main.css': './src/main/resources/static/sass/main.scss'
        }
    },
    'core-comments': {
        options: {
            loadPath: ['.', './src/main/resources/modules'],
            style: 'compressed'
        },
        files: {
            '<%= path.target %><%= static_assets_path.css %>core-comments.css': './src/main/resources/static/sass/article/core-comments.scss'
        }
    }
};