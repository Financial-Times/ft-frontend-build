var test = require('./single_test');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var wrench = require('wrench');

var tests = require('./test_setup').tests;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000000;

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


