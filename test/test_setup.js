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

deleteFolderRecursive(path.join(process.cwd(), 'test/dummy-project'));

var packageJson = require('../package.json');

var dependencies = _.merge(packageJson.dependencies, packageJson.peerDependencies);

dependencies = Object.keys(dependencies).map(function (pack) {
        
    return pack + ((semver.valid(dependencies[pack]) || /^(\~|\^)/.test(dependencies[pack])) ? ('@' + dependencies[pack]) : ('=' + dependencies[pack]))

});

npm.load({}, function () {
    npm.commands.install('./test/dummy-project', dependencies, function () {});
});  
