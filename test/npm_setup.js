var path = require('path');
var _ = require('lodash');
var npm = require('npm');
var semver = require('semver');
var fs = require('fs');
var whereIsNpm = require('./where-is-npm');

var packageJson = require('../package.json');

var dependencies = _.merge(packageJson.dependencies, packageJson.peerDependencies);

dependencies = Object.keys(dependencies).map(function (pack) {
    return pack + ((semver.valid(dependencies[pack]) || /^(\~|\^)/.test(dependencies[pack])) ? ('@' + dependencies[pack]) : ('=' + dependencies[pack]));
});

console.log('Relocating node_modules');
try {
    whereIsNpm.relocate('_base');
} catch (e) {
    whereIsNpm.set('_base');
}

npm.load({}, function () {
    console.log('Updating node_modules');
    npm.commands.install('test/dummy-projects/_base', dependencies, function () {});
});