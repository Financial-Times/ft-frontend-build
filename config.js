module.exports = {
    // path to the directory where bower components are installed
    bowerPath: './src/main/resources/modules/',
    // path to the directory where js, sass and mustache src is 
    srcPath: './src/main/resources/',
    testPath: 'src/test/js/',
    // path to the directory where assets are loaded from in the built project
    builtPath: './target/classes/',
    // path to the directory where assets are loaded from in the built project
    builtAssetsPath: '<%= ft.builtPath %>views/<%= ft.assetVersion %>/',
    // version number to build assets with
    assetVersion: grunt.option('assetVersion') || '0.0.1',
    // path where some assets may need temporarily moving to during build (e.g. templates in dropwizard)
    stagingPath: './target/',
    stageAssets: ['tpl'],
    bowerPolyfills: [
        'es5-shim/es5-shim.min.js',
        'event-listener/eventListener.polyfill.min.js',
        'classlist/classList.min.js',
        'custom-event/custom-event-polyfill.js'
    ],
    srcPolyfills: ['es6-promise.js'],
    parallelTestAndBuild: false,
    cssModules: [
        'core-comments'
    ]
};

