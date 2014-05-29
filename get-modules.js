'use strict';

var ftConfig = require('./get-config')().ft;
var grunt = require('grunt');

module.exports = function(ext) {
	if(ftConfig.isModular) {
		return grunt.file.expand({cwd: ftConfig.srcPath}, '*/main.' + ext);
	} else {
		return grunt.file.expand({cwd: ftConfig.srcPath}, ext + '/*.' + ext);
	}
}
