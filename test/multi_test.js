var _ = require('lodash');
var test = require('./single_test');

module.exports = function (testName, config) {
    describe(testFileName.replace(/-/g, ' '), function () {
        beforeEach(function () {
            if (config.before) {
                config.before();
            }
        });
                
        afterEach(function () {
            //clean the static folder
            if (config.after) {
                config.after();
            }
        });
        config.specs.forEach(function (conf, name) {
            test(testFileName, _.defaults(conf, config));
        });
    });
};



