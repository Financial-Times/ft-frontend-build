'use strict';

module.exports = function (grunt) {

  var files = grunt.config.get('ft.bowerPolyfills').map(function(path) {
    return grunt.config.get('ft.bowerPath') + path;
  }).concat(grunt.config.get('ft.srcPolyfills').map(function(path) {
    return grunt.config.get('ft.srcPath') + 'vendor/' + path;
  }),[
      '<%= ft.srcPath %>js/vendor/modernizr-dev.js',
      '<%= ft.testPath %>helpers/**/*.js',
      '<%= ft.srcPath %>**/*.js',
      '<%= ft.testPath %>specs/**/*.js',
      {
        pattern: '<%= ft.testPath %>assets/**/*',
        watched: true,
        included: false,
        served: true
      }
    ]),
    preprocessors = {
      '<%= ft.testPath %>specs/**/*.js': ['browserify'],
      '<%= ft.srcPath %>**/*.js': ['browserify']
    },

    coverageFiles = files.map(function (path) {
      if (typeof path === 'string') {
        return path.replace('/js/', '/_instrumented-js/');
      } else {
        path = JSON.parse(JSON.stringify(path));
        path.pattern = path.pattern.replace('/js/', '/_instrumented-js/');
        return path;
      }
    }),

    coveragePreprocessors = (function () {
      var obj = {};
      Object.keys(preprocessors).forEach(function (path) {
        obj[path.replace('/js/', '/_instrumented-js/')] = preprocessors[path];
      });
      return obj;
    })();


  module.exports = {
    options: {
      frameworks: ['browserify', 'jasmine'],
      files: files,
      preprocessors: preprocessors,
      reporters: ['progress', 'dots'],
      browserify: {
        transform: ['textrequireify', 'debowerify'],
        debug: false
      },
      singleRun: true,
      autoWatch: false,
      browsers: ['PhantomJS'],
      browserNoActivityTimeout: 300000
    },
    phantom: {},
    browser: {
       options: {
        browserify: {
          transform: ['textrequireify', 'debowerify'],
          debug: true
        },
        singleRun: false,
        autoWatch: true,
        browsers: ['Chrome']//,
       // reporters: ['progress', 'dots', 'html']
      }
    },
    coverage: {
      options: {
        files: coverageFiles,
        preprocessors: coveragePreprocessors,
        coverageReporter: {
          type: 'html',
          dir: 'coverage/'
        }
      }
    }
  };
};
