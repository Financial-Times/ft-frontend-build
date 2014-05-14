'use strict';

var ftConfig = require('../grunt-config')().ft;

var files = {
    '<%= ft.builtAssetsPath %>css/main.css': ['<%= ft.builtAssetsPath %>css/main.css']
};

ftConfig.cssModules.forEach(function (module) {
    files['<%= ft.builtAssetsPath %>css/' + module + '.css'] = ['<%= ft.builtAssetsPath %>css/' + module + '.css'];
});

module.exports = {
    prod: {
        files: files
    }
};
