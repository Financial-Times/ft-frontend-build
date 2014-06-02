require('./test_setup');

var test = require('./single_test');

var path = require('path');
var j2f = require('jsonToFs');

describe('ft-frontend-build', function () {
    var cwd;

    beforeEach(function () {
        cwd = process.cwd();
    });

    afterEach(function () {
        process.chdir(cwd);
    });

    test('should work with default settings', require('./tests/full/simple-prod'));
});




