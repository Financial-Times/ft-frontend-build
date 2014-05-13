'use strict';

var path = require('path');
var _ = require('lodash');
var deepDefault = _.partialRight(_.merge, _.defaults);

var configContents = require(path.join(process.cwd(), 'responsive-ft-config.js'));

var completeConfig;

module.exports = function (grunt) {

    
    if (completeConfig) {
        return completeConfig;
    }

    configContents.srcPath = configContents.srcPath + (configContents.isModular ? 'app/' : '');
    configContents.builtAssetsPath = configContents.builtAssetsPath.replace('{{version}}', grunt.option('assetVersion') || '0.0.1');
    completeConfig = deepDefault({ft: configContents}, {
        pkg: require(path.join(process.cwd(),'package.json')),
        bwr: require(path.join(process.cwd(),'bower.json')),
        ft: {
            assetVersion: grunt.option('assetVersion') || '0.0.1',
            bowerPath: './bower_components/',
            stageAssets: [],
            stagingPath: './tmp/',
            bowerPolyfills: [],
            srcPolyfills: [],
            cssModules: [],
            jsModules: [],
            skipTasks: [],
            copyExcludeList: [],
            copyIncludeList: [],
            blocks: ['clean', 'tpl', 'js', 'css', 'polyfill', 'assets'],
            skipBlocks: [],
            parallelTestAndBuild: false
        }
    });

    return completeConfig;
};