# responsive-ft-grunt

Configurable and (fairly) infrastructure-agnostic build for a responsive front-end using origami components.

## Dependencies

The below will probably need to be run as superuser

* Node & npm - [download](http://nodejs.org/) or [upgrade](http://davidwalsh.name/upgrade-nodejs). Not sure which version is the minimal requirement - try it and see.
* grunt-cli - `npm install -g grunt-cli`
* karma-cli and phantomjs (if your project has javascript unit tests) - `npm install -g karma-cli phantomjs`

## Installation

If your project does not already have a `package.json` run `npm init` in the project root.

Then run `npm install -D responsive-ft-grunt=git+http://git.svc.ft.com/scm/fwp/responsive-ft-grunt.git`

Finally your GruntFile.js should have the following content

    module.exports = require('responsive-ft-grunt');

... ok, so while that is fantastically minimal, it's also scarily magical, so you can take back control of your GruntFile by having

    module.exports = function (grunt) {

      // your stuff here ...

      require('responsive-ft-grunt')(grunt, load-config);

      // ... and here

      // ... and, for good measure, a bit more here
    }

responsive-ft-grunt uses the excellent [load-grunt-config](https://www.npmjs.org/package/load-grunt-config) plugin which should load any npm grunt-tasks for you. `load-config` can optionally be used to pass in additional config to it.

## App structure

responsive-ft-grunt, where possible, favours convention over configuration so it's important your front-end src code adheres to one of the following directory structures (if for some reason your app cannot meet these requirements please contact [Rhys Evans](mailto:rhys.evans@ft.com)).

### Non-modular

Where your app will only ever build a single css file and a single js file. *You should set `isModular: false` in your config*.

Note that it's recommended to store yuor templates with your other source code. This unusual approach is partly for code organisation reasons, but also allows you to use a build step that makes it easier to consume origami components' templates.

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

Only the `app` directory and its contents are required. The remaining directories are suggestions for making your code more reusable; in particular, if you write as much of your code as possible in the `components` directory it will be relatively easy to convert into reusable origami modules in future.

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

These should all be set in `responsive-ft.config.js`, which exports a javascript object defining each property (at the top-level) it needs to override. Default values are in italics.

### Paths

All the paths below should begin with `./` and end in `/`

* `bowerPath` *'./bower_components/'*: Path to where your bower components are installed (as set in your `.bowerrc` file). Even though it may seem counterintuitive it's best to keep this outside where your source code resides as it'll make your build quicker
* `srcPath`: Location of your front-end source files
* `stagingPath`: In certain circumstances you may need to stage some of your built source files before copying them to your public root. They will be placed in this directory
* `builtTemplatesPath`: Directory to place your app's built templates in 
* `builtAssetsPath`: Directory to place all your app's built static assets (including css and js) in

### Build steps

* `blocks` *['clean', 'tpl', 'js', 'css', 'polyfill', 'assets']*: Blocks of build tasks to carry out. The names refer to blocks of tasks that carry out the following
    
    * `clean`: removes the files created by the last build
    * `tpl`: builds templates which correctly include origami modules and their dependencies' templates and minifies your inline head script
    * `js`: browserifies all your js modules and copies them to your built app
    * `css`: runs sass on all your css modules and copies them to your built app
    * `polyfill`: generates a modernizr build and copies any polyfills across to your built app
    * `assets`: copies other static assets across to your built app
    
    In addition to these strings you can also put functions in the array of the form `function (sub, env, tasks, grunt) {}` where
    * `sub`: the sub-section of the build which has been called (see section on `Running` below)
    * `env`: the environment the build is being run in (`dev` or `prod`)
    * `tasks`: the queue of grunt tasks constructed so far
    * `grunt`: the current instance of grunt

    These functions may limit themselves to simple operations e.g. setting a dynamic property on the grunt config. If, however, the intention is for it to run some grunt tasks they **must not** use `grunt.task.run`; instead they should push/concat these tasks onto the `tasks` array provided.

* `skipBlocks` *[]*: List of named build blocks to skip  
* `skipTasks` *[]*: List of specific grunt-tasks to skip. e.g. `copy:tpl` will skip copying templates, whereas `copy` will skip `copy:tpl`, `copy:js` etc...
* `parallelTestAndBuild` *false*: **Unimplemented**
* `stageAssets` *[]*: types of assets that need to be staged rather than copied directly to the built app. The naming convention follows taht of `blocks`


### Modules
* `isModular` *false*: Whether or not the app follows the directory structure for a more complex modular app 
* `cssModules` *[]*: names of css modules (in addition to main) that need building into separate stylesheets
* `jsModules` *[]*: names of js modules (in addition to main) that need browserifying into separate bundles

### Individual task config
* `copyExcludeList` *[]*: List of files and directories to exclude when copying static assets to the built app; by default most things in your bower directory will be copied. Adding a `\` to the end of an entry here will exclude that directory and its entire contents
* `copyIncludeList` *[]*: List of files and directories to include when copying static assets to the built app
* `bowerPolyfills` *[]*: Paths to polyfills installed via bower. Note that e.g. `event-listeners/EventListener.polyfill.min.js` will be copied to `js/polyfills/event-listeners.js` in the built app
* `srcPolyfills` *[]*: Paths to polyfills not installed via bower. Note that e.g. `src/path/vendor/es6-promises.js` will be copied to `js/polyfills/es6-promises.js` in the built app


## Running

asset version
task paramas
shell script
build vs test

## Tests

By default jasmine, but can be  overwritten in its entirety


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