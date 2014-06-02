var path = require('path');
var j2f = require('jsonToFs');
var childProcess = require('child_process');
var fs = require('fs');
var wrench = require('wrench');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000000;

var absolutePath = function (relativePath) {
    return path.join(process.cwd(), relativePath);
};

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

// if (!exist node_modules) {
//     either install or fs.renameSync('./test/node_modules', './test/dummy-project/node_modules');
// }

// copy src into node_modules/ft-frontend-build
wrench.copyDirSyncRecursive('./', 'test/dummy-project/node_modules/ft-frontend-build', {
    forceDelete: true, // Whether to overwrite existing directory or not
    preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
    exclude: /node_modules/ // An exclude filter (either a regexp or a function)
});
