var _ = require('lodash');
var test = require('./single_test');
var wrench = require('wrench');
var path = require('path');

module.exports = function (testName, config) {
    describe(testName.replace(/-/g, ' '), function () {
     
        afterEach(function () {
            wrench.rmdirSyncRecursive(path.join(process.cwd(), 'test/dummy-projects/' + testName + '/static'), true);
        });

        Object.keys(config.specs).forEach(function (name) {
            test(testName, _.defaults(config.specs[name], config));
        });
    });
};



