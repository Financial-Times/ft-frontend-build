module.exports = {
    tasks: ['build'],
    structure: {
        src:{
            assets: {
                'img.jpeg': 'asd'
            },
            js: {
                sub: {
                    'main.js': 'var main;',
                    'head.js': 'var head;',
                    'other.js': 'var other;'
                },
                'main.js': 'require("./sub/main");',
                'head.js': 'require("./sub/head");',
                'other.js': 'require("./sub/other");',
                'inlineScript.mustache': 'var FT = window.FT || {};'
            },
            scss: {
                sub: {
                    'main.scss': '.main {content: "main";}',
                    'head.scss': '.head {content: "head";}',
                    'other.scss': '.other {content: "other";}'
                },
                'main.scss': '@import "sub/main"',
                'head.scss': '@import "sub/head"',
                'other.scss': '@import "sub/other"'
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
        expect(result.js['main.js'].indexOf('("./sub/main")') > -1).toBeTruthy();
        expect(result.js['other.js'].indexOf('("./sub/other")') > -1).toBeTruthy();
        expect(result.js['head.js'].indexOf('("./sub/head")') > -1).toBeTruthy();
        expect(result.js['head.js'].indexOf('window.Modernizr') > -1).toBeTruthy();
        done();
    }
};