'use strict';

var fs = require('fs');
var path = require('path');

function set (dir) {
    fs.writeFileSync(path.join(process.cwd(), 'test/npm-location.json'), JSON.stringify({location: dir}));
}

function get () {
    try {
        return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'test/npm-location.json'))).location;
    } catch (e) {
        throw 'node_modules not installed for test directories';
    }
}

function relocate (newDir) {
    var oldDir = get();
    fs.renameSync(
        path.join(process.cwd(), 'test/dummy-projects/' + oldDir + '/node_modules'),
        path.join(process.cwd(), 'test/dummy-projects/' + newDir + '/node_modules')
    );

    set(newDir);
}

module.exports = {
    set: set,
    get: get,
    relocate: relocate
};