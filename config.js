module.exports = {
    // path to the directory where bower components are installed
    bowerPath: './src/main/resources/modules/',
    // path to the directory where js, sass and mustache src is 
    srcPath: './src/main/resources/',
    testPath: 'src/test/js/',
    // path to the directory where assets are loaded from in the built project
    builtPath: './target/classes/',
    // path to the directory where assets are loaded from in the built project
    builtAssetsPath: '<%= ft.builtPath %>views/<%= ft.assetsVersion %>/',
    // version number to build assets with
    assetsVersion: grunt.option('assetVersion') || '0.0.1',
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


/*
TODO

head js browserify & concat
build origami templates
lazy loading
test paths
ability for browserify and sass builds to be passed in names of modules
staging templates
modernizr + modernizrless versions of tests
hogan-compile

ASSUMPTIONS TO DOCUMENT

 - bower directory is outside of the src directory (not essential, but means tasks globbing by file type 
   will have to run over far fewer files)  // not important?
 - src directory has following structure
 - all main.js files are commonjs modules requiring their parts using require()

modules
 \_ js, scss and ms files
vendor
 \_ polyfills and such like which aren't includable using debowerify, mostly js
utils   /// no opinion on this
 \_ scss
 \_ js
app
 \_js
    // try and treat head as a non-special case to allow for creation of multiple bundles and lazy loading in future
   \_ lazyloadedthing
      main.js
   \_ head
      main.js
   \_ main
     \_ routers etc
     \_ controllers
    main.js
 \_sass
    \_ lazyloadedthing
      main.scss
    main.scss
 \_tpl
   \inlineHeadScript.mustache


WHICH GETS BUILT TO









*/