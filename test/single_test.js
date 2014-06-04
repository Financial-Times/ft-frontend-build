var path = require('path');
var j2f = require('jsonToFs');
var _ = require('lodash');
var deepDefault = _.partialRight(_.merge, function deep(a, b) {
  return _.merge(a, b, deep);
});

var defaultFiles = {
    bower_components: {
        'o-thing': {},
        'other-thing': {}
    },
    'ft-frontend-config.js': '{}',
    'GruntFile.js': 'module.exports = require(\'ft-frontend-build\');',
    '.jshintrc': '{"globals":{}}',
    'package.json': '{}',
     'bower.json': '{"name": "Dummy application", "dependencies": {"o-thing": "0.1.0", "other-thing": "0.2.0"}}'    
};

module.exports = function (description, config) {

    it(description, function (done) {
        j2f.jsonToFs('test/dummy-project', deepDefault(config.structure, defaultFiles), ['node_modules']);
        
        process.chdir(path.join(process.cwd(), 'test/dummy-project'));

        var grunt = require('./dummy-project/node_modules/grunt');
        require('./dummy-project/GruntFile')(grunt);

        grunt.tasks(config.tasks, {verbose: process.argv.indexOf('--verbose') > -1}, function () {
            var result = j2f.fsToJson('static');
            config.specs(result, done);
        });
    });

};
