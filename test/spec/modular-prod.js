module.exports = {
    tasks: ['build'],
    structure: {
        'ft-frontend-config.js': 'module.exports = { "isModular": true, "srcPath": "./"}',
        app:{
            assets: {
                'img.jpeg': 'asd'
            },
            main: {
                js: {
                    'include.js': 'var main;',
                },
                scss: {
                    'include.scss':  '.main {content: "main";}'
                },
                'main.js': 'require("./js/include");',
                'main.scss': '@import "scss/include"',
            },
            head: {
                js: {
                    'include.js': 'var head;',
                },
                scss: {
                    'include.scss':  '.head {content: "head";}'
                },
                'main.js': 'require("./js/include");',
                'main.scss': '@import "scss/include"',
                'inlineScript.mustache': 'var FT = window.FT || {};'
            },
            other: {
                js: {
                    'include.js': 'var other;',
                    'dont-include.js': 'var dont_include;',
                },
                scss: {
                    'include.scss':  '.other {content: "other";}'
                },
                'main.js': 'require("./js/include");',
                'not-main.js': 'require("./js/dont-include");',
                'main.scss': '@import "scss/include"',
            }
        },
    },
    specs: function (result, done) {
        expect(result.assets).toEqual({ 'img.jpeg': 'asd' });
        expect(result.css).toEqual({
            'head.css': '.head{content:"head"}',
            'main.css': '.main{content:"main"}',
            'other.css': '.other{content:"other"}'
        });

        expect(result.js['main.js'].indexOf('("./js/include")') > -1).toBeTruthy();
        expect(result.js['head.js'].indexOf('("./js/include")') > -1).toBeTruthy();
        expect(result.js['other.js'].indexOf('("./js/include")') > -1).toBeTruthy();
        expect(result.js['other.js'].indexOf('("./js/dont-include")') > -1).toBeFalsy();
        expect(result.js['main.js'].indexOf('\n') > -1).toBeFalsy();
        expect(result.js['head.js'].indexOf('window.Modernizr') > -1).toBeTruthy();
        done();
    }
};