var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var whereIsNpm = require('./where-is-npm');
var wrench = require('wrench');

console.log('Relocating node_modules');

try {
    whereIsNpm.relocate('_base');
} catch (e) {
    whereIsNpm.set('_base');
}

var tests = wrench.readdirSyncRecursive('test/spec').filter(function(fileName) {
    var dotJsIndex = fileName.indexOf('.js');
    return dotJsIndex === fileName.length - 3 && dotJsIndex > -1;
});

console.log('Resetting old dummy projects');

tests.forEach(function(testFileName) {
    var testDir = path.join(process.cwd(),'test/dummy-projects/' + testFileName.replace('.js', ''));
    wrench.rmdirSyncRecursive(testDir, true);
    wrench.mkdirSyncRecursive(testDir);
});

wrench.copyDirSyncRecursive('./', 'test/dummy-projects/' + whereIsNpm.get() + '/node_modules/ft-frontend-build', {
    forceDelete: true, // Whether to overwrite existing directory or not
    preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
    exclude: /node_modules/ // An exclude filter (either a regexp or a function)
});

exports.tests = tests;

