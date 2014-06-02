var path = require('path');
var j2f = require('jsonToFs');
var childProcess = require('child_process');
var fs = require('fs');
var wrench = require('wrench');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000000;

var absolutePath = function (relativePath) {
    return path.join(process.cwd(), relativePath);
};

var deleteFolderRecursive = function(path) {
    if(fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + '/' + file;

            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
};

// if (!exist node_modules) {
//     either install or fs.renameSync('./test/node_modules', './test/dummy-project/node_modules');
// }

// copy src into node_modules/ft-frontend-build
wrench.copyDirSyncRecursive('./', 'test/dummy-project/node_modules/ft-frontend-build', {
    forceDelete: true, // Whether to overwrite existing directory or not
    preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
    exclude: /node_modules/ // An exclude filter (either a regexp or a function)
});


describe('ft-frontend-build', function () {
    var cwd;

    beforeEach(function () {
        cwd = process.cwd();
    });

    afterEach(function () {
        process.chdir(cwd);
    });

    it('should work with default settings', function (done) {
        j2f.jsonToFs('test/dummy-project', {
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
            bower_components: {
                'o-thing': {},
                'other-thing': {}
            },
            'ft-frontend-config.js': '{}',
            'GruntFile.js': 'module.exports = require(\'ft-frontend-build\');',
            '.jshintrc': '{"globals":{}}',
            'package.json': '{}',
             'bower.json': '{"name": "Dummy application", "dependencies": {"o-thing": "0.1.0", "other-thing": "0.2.0"}}'
            }, ['node_modules']);

        
        process.chdir(path.join(process.cwd(), 'test/dummy-project'));
        var grunt = require('./dummy-project/node_modules/grunt');
        require('./dummy-project/GruntFile')(grunt);
        grunt.tasks(['build'], {verbose: process.argv.indexOf('--verbose') > -1}, function () {
            var result = j2f.fsToJson('static');
            console.log(result.js);
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
        });




    });
});