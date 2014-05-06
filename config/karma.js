'use strict';

var files = [
    'src/main/modules/event-listener/eventListener.polyfill.min.js',
    'src/main/resources/modules/es5-shim/es5-shim.js',
    'src/main/resources/static/js/vendor/es6-promise.js',
    'src/main/resources/static/js/vendor/modernizr-dev.js',
    'src/test/js/helpers/**/*.js',
    'src/main/resources/static/js/head/detect.js',
    'src/main/resources/static/js/common/settings.js',
    'src/main/resources/static/js/article/responsive-image.js',
    'src/test/js/specs/**/*.js',
    {
      pattern: 'src/test/js/assets/**/*',
      watched: true,
      included: false,
      served: true
    }
  ],
  preprocessors = {
    'src/test/js/specs/article/**/*.js': ['browserify'],
    'src/test/js/specs/common/**/*.js': ['browserify'],
    'src/main/resources/static/js/article/**/*.js': ['browserify'],
    'src/main/resources/static/js/common/**/*.js': ['browserify']
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
      transform: ['brfs', 'debowerify'],
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
        transform: ['brfs', 'debowerify'],
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
