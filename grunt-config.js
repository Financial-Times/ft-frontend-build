'use strict';

var path = require('path');
var _ = require('lodash');
var deepDefault = _.partialRight(_.merge, function deep(a, b) {
  return _.merge(a, b, deep);
});

var configContents = require(path.join(process.cwd(), 'responsive-ft-config.js'));

var completeConfig;

module.exports = function (grunt) {
    
    if (completeConfig) {
        return completeConfig;
    }

    configContents.assetVersion = grunt.option('assetVersion') || '0.0.1';


    configContents.builtAssetsPath = configContents.builtAssetsPath.replace('{{version}}', grunt.option('assetVersion') || '0.0.1');
    completeConfig = deepDefault({ft: configContents}, {
        pkg: require(path.join(process.cwd(),'package.json')),
        bwr: require(path.join(process.cwd(),'bower.json')),
        ft: require('./defaults')
    });

    completeConfig.ft.srcPath = completeConfig.ft.srcPath + (completeConfig.ft.isModular ? 'app/' : '');

    return completeConfig;
};