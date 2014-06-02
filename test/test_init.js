var path = require('path');
var j2f = require('jsonToFs');
var wrench = require('wrench');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000000;

// copy src into node_modules/ft-frontend-build
wrench.copyDirSyncRecursive('./', 'test/dummy-project/node_modules/ft-frontend-build', {
    forceDelete: true, // Whether to overwrite existing directory or not
    preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
    exclude: /node_modules/ // An exclude filter (either a regexp or a function)
});