# responsive-ft-grunt

Configurable, (fairly) infrastructure agnostic build for a responsive front end using origami components

## Dependencies

The below will probably need to be run as superuser

* Node & npm - [download](http://nodejs.org/) or [upgrade](http://davidwalsh.name/upgrade-nodejs). Not sure which version is the minimal requirement - try it and see.
* grunt-cli - `npm install -g grunt-cli`
* karma-cli and phantomjs (if your project has javascript unit tests) - `npm install -g karma-cli phantomjs`

## Installation

If your project does not already have a `package.json` run `npm init` in the project root.

Then run `npm install -D responsive-ft-grunt=git+http://git.svc.ft.com/scm/fwp/responsive-ft-grunt.git`

## App structure

responsive-ft-grunt, where possible, favours convention over configuration so it's important your front-end src code adheres to one of the following directory structures.


### Non-modular

Where your app will only ever build a single css file and a single js file. *You should set `isModular: false` in your config*

    root
      \_ js
        |   // must use commonjs to require any other js files
        \_ main.js
      \_ sass
        |  // must use sass @import to include any other sass files
        \_ main.scss 
      \_ tpl
        |  // If you need to output mustache variables into a your js e.g. domain specific config
        |  // putting it in this file will mean responsive-ft-grunt minifies it for you
        \_ inlineHeadScript.mustache 

### Modular

For more complex apps with multiple js and style bundles (for e.g. lazy-loaded features or core vs primary browser experiences)  *You should set `isModular: true` in your config*.

*Even if your app only requires a single bundle at present it's worth cosidering adopting this structure as it will mean there is zero refactoring work to do if your app increases in complexity.*

Only the `app` directory and its contents is required. The remaining directories are suggestions for making your code more reusable; in particular, if you write as much of your code as possible in the `components` directory it will be relatively easy to convert into reusable origami modules in future.

    root
      \_ app
      |   \_ js
      |     \_main
      |       main.js
      |     \_moduleB
      |       main.js
      |   \_ sass
      |     \_main
      |       main.scss
      |     \_moduleB
      |       main.scss
      |   \_ tpl
      |     \_main
      |       main.mustache
      |     \_moduleB
      |       main.mustache
      |     inlineHeadScript.mustache 
      |
      |  // sass, js and templates for definining the appearance and behaviour of self-contained features of your app
      |  // A good idea to keep the [origami spec](http://origami.ft.com) in mind while writing these
      \_ components
      |   \_ component1
      |       \_ scss
      |       \_ js
      |       \_ tpl
      |        main.js
      |        main.scss
      |        main.mustache
      |
      |  // A home for third party resources (mostly js, but could also be css/sass) which, for whichever reason, cannot be @imported/required directly after a bower install. 
      |  // e.g. the es6-promises polyfill requires npm and a transpiler to make it consumable by browserify, so a built version could be stored here
      \_ vendor


Where possible it's a good idea to keep your src code away from any directories your server framework expects your static assets to be as this may result in it executing some 'magic' which conflicts with what responsive-ft-grunt is trying to do e.g. dropwizard will copy your src templates directly into your public root, overwriting any changes you may have made to them.

## Configuration





                pkg: require(path.join(process.cwd(),'package.json')),
                bwr: require(path.join(process.cwd(),'bower.json')),
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
                blocks: ['clean', 'tpl', 'js', 'css', 'polyfill', 'assets'],
                skipBlocks: [],
                parallelTestAndBuild: false,
                defaultModule: config.isModular ? 'app/' : ''


    isModular: false,

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

## Running

asset version
task paramas
shell script
build vs test

## Tests

BY default jasmine, but can be pverwritten in its entirety


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