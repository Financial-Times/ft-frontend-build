module.exports = {
    main: {
        files: {
            '<%= ft.builtAssetsPath %>js/main.js': ['<%= ft.srcPath %>app/js/main.js'],
        },
        options: {
            transform: ['debowerify', 'textrequireify', ['uglifyify', {global: true}]],
            bundleOptions: {
                debug: false
            }
        }
    },
    head: {
        files: {
            '<%= ft.builtAssetsPath %>js/head.js': ['<%=path.js_src %>app/js/head/main.js'],
        },
        options: {
            transform: ['debowerify', 'textrequireify'],
            bundleOptions: {
                debug: false
            }
        }
    },
    headDev: {
        files: {
            '<%= ft.builtAssetsPath %>js/head.js': ['<%=path.js_src %>app/js/head/main.js'],
        },
        options: {
            transform: ['debowerify', 'textrequireify', ['uglifyify', {global: true}]],
            bundleOptions: {
                debug: true
            }
        }
    },
    dev: {
        files: {
            '<%= ft.builtAssetsPath %>js/main.js': ['<%= ft.srcPath %>app/js/main.js'],
        },
        options: {
            transform: ['debowerify', 'textrequireify'],
            bundleOptions: {
                debug: true
            }
        }
    }
};