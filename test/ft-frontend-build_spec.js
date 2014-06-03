var wrench = require('wrench');
var test = require('./single_test');
var fs = require('fs');
var _ = require('lodash');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000000;
var tests = _.filter(fs.readdirSync('./test/tests/full/'), function(fileName) {
    return fileName.indexOf('.js') === fileName.length - 3;
});

var testDir;
tests.forEach(function(testFileName) {
    testDir = 'test/dummy-projects/' + testFileName.replace('.js', '');
    wrench.copyDirSyncRecursive('./', testDir + '/node_modules/ft-frontend-build', {
        forceDelete: true, // Whether to overwrite existing directory or not
        preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
        exclude: /node_modules/ // An exclude filter (either a regexp or a function)
    });
});

describe('ft-frontend-build', function () {
    var cwd;

    beforeEach(function () {
        cwd = process.cwd();
    });

    afterEach(function () {
        process.chdir(cwd);
    });

    tests.forEach(function(testFileName) {
        testFileName = testFileName.replace('.js', '');
        test('should work with ' + testFileName.replace(/-/g, ' ') + ' apps', testFileName);
    });
});

//Adding this because jasmine doesnt fail properly when there is an exception
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});


