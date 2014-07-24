var test = require('./single_test');
var multiTest = require('./multi_test');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var wrench = require('wrench');

var tests = require('./test_setup').tests;

var whereIsNpm = require('./where-is-npm');


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
        var config = require('./spec/' + testFileName);
        if (!Object.keys(config).length) return;

        if (typeof config.specs === 'object') {
            multiTest(testFileName, config);
        } else {
            test(testFileName, config);
        }
    });
});

//Adding this because jasmine doesnt fail properly when there is an exception
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});


