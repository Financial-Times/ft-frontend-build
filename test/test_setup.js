var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var whereIsNpm = require('./where-is-npm');
var wrench = require('wrench');

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

console.log('Relocating node_modules');
try {
    whereIsNpm.relocate('_base');
} catch (e) {
    whereIsNpm.set('_base');
}

var tests = _.filter(fs.readdirSync('test/tests/spec/'), function(fileName) {
    return fileName.indexOf('.js') === fileName.length - 3;
});


console.log('Reseting old dummy projects');
var testDir;
tests.forEach(function(testFileName) {
    
    testDir = path.join(process.cwd(),'test/dummy-projects/' + testFileName.replace('.js', ''));
    deleteFolderRecursive(testDir);
    fs.mkdirSync(testDir);
});

wrench.copyDirSyncRecursive('./', 'test/dummy-projects/' + whereIsNpm.get() + '/node_modules/ft-frontend-build', {
    forceDelete: true, // Whether to overwrite existing directory or not
    preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
    exclude: /node_modules/ // An exclude filter (either a regexp or a function)
});

