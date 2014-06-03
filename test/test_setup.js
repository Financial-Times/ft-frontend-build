var path = require('path');
var _ = require('lodash');
var npm = require('npm');
var semver = require('semver');
var fs = require('fs');

var deleteFolderRecursive = function(path) {
    if(fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + '/' + file;

            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
};


var packageJson = require('../package.json');

var dependencies = _.merge(packageJson.dependencies, packageJson.peerDependencies);

dependencies = Object.keys(dependencies).map(function (pack) {
        
    return pack + ((semver.valid(dependencies[pack]) || /^(\~|\^)/.test(dependencies[pack])) ? ('@' + dependencies[pack]) : ('=' + dependencies[pack]));

});

var tests = _.filter(fs.readdirSync('test/tests/full'), function(fileName) {
    return fileName.indexOf('.js') === fileName.length - 3;
});

var testDir;
npm.load({}, function () {
    tests.forEach(function(testFileName) {
        testDir = 'test/dummy-projects/' + testFileName.replace('.js', '');
        deleteFolderRecursive(path.join(process.cwd(), testDir));
        npm.commands.install(testDir, dependencies, function () {});
    });
});  
