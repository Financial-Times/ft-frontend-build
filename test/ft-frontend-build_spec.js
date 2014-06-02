var wrench = require('wrench');
var test = require('./single_test');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000000;

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

    test('should work with default settings', require('./tests/full/simple-prod'));
});




