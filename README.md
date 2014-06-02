# ft-frontend-build

Configurable and (fairly) infrastructure-agnostic build for a responsive front-end using origami components.

## Dependencies

The below will probably need to be run as superuser

* Node & npm - [download](http://nodejs.org/) or [upgrade](http://davidwalsh.name/upgrade-nodejs). Not sure which version is the minimal requirement - try it and see.
* grunt-cli - `npm install -g grunt-cli`
* karma-cli and phantomjs (if your project has javascript unit tests) - `npm install -g karma-cli phantomjs`

## Installation

If your project does not already have a `package.json` run `npm init` in the project root.

Then run `npm install -D ft-frontend-build=git+https://github.com/Financial-Times/ft-frontend-build.git`

Finally your GruntFile.js should have the following content

    module.exports = require('ft-frontend-build');

... ok, so while that is fantastically minimal, it's also scarily magical, so you can take back control of your GruntFile by having

    module.exports = function (grunt) {

      // your stuff here ...

      require('ft-frontend-build')(grunt, load-config);

      // ... and here

      // ... and, for good measure, a bit more here
    }

ft-frontend-build uses the excellent [load-get-config](https://www.npmjs.org/package/load-get-config) plugin which should load any npm grunt-tasks for you. `load-config` can optionally be used to pass in additional config to it.

## App structure

ft-frontend-build, where possible, favours convention over configuration so it's important your front-end src code adheres to one of the following directory structures (if for some reason your app cannot meet these requirements please contact [Rhys Evans](mailto:rhys.evans@ft.com)).

### Non-modular

Where your app will only ever build a single css file and a single js file. *You should set `isModular: false` in your config*.

Note that it's recommended to store yuor templates with your other source code. This unusual approach is partly for code organisation reasons, but will allow you to use a planned build step that will make it easier to consume origami components' templates.

    root
      \_ assets // images etc.
      \_ js
        
        // If you need to output mustache variables into a your js e.g. domain specific config
        // putting it in this file will mean ft-frontend-build minifies it for you
        inlineScript.mustache 
        // every top-level js file will be output into a compiled file, and must use commonjs to require any other js files
        main.js
        head.js
        other-bundle.js
      \_ sass
        |  // must use sass @import to include any other sass files
        \_ main.scss 
           other-bundle.scss
      \_ tpl
        \_ a-template.mustache

### Modular

For more complex apps with multiple js and style bundles (for e.g. lazy-loaded features or core vs primary browser experiences)  *You should set `isModular: true` in your config*.

*Even if your app only requires a single bundle at present it's worth cosidering adopting this structure as it will mean there is zero refactoring work to do if your app increases in complexity.*

Only the `app` directory and its contents are required. The remaining directories are suggestions for making your code more reusable; in particular, if you write as much of your code as possible in the `components` directory it will be relatively easy to convert into reusable origami modules in future.

Any directory named `assets` and its contents will be copied (including its full path relative to your src directory) into yuor built static assets directory 

    root
      \_ app
      |   \_ main
      |     \_assets
      |     \_js
      |     \_scss
      |     \_tpl
      |       a-template.mustache
      |     main.js
      |     main.scss
      |   \_ head
      |     main.js
      |     inlineScript.mustache 
      |   \_ moduleB
      |     \_js
      |     \_scss
      |     \_tpl
      |       a-template.mustache
      |     main.js
      |     main.scss
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


Where possible it's a good idea to keep your front-end src code away from any directories your server framework expects your static assets to be as this may result in it executing some 'magic' which conflicts with what ft-frontend-build is trying to do e.g. dropwizard will copy `./src/main/resources` directly into your public root.

## Configuration

These should all be set in `ft-frontend-config.js`, which exports a javascript object defining each property (at the top-level) it needs to override. Default values are in italics.

### Paths

All the paths below should begin with `./` and end in `/`

* `bowerPath` *'./bower_components/'*: Path to where your bower components are installed (as set in your `.bowerrc` file). Even though it may seem counterintuitive it's best to keep this outside where your source code resides as it'll make your build quicker
* `srcPath` *'./src/'*: Location of your front-end source files
* `stagingPath` *'./tmp/'*: Location for temporary build files
* `inlineHeadScriptDestinations` *[]*: Location(s) to copy your inline head script to
* `builtAssetsPath` *'./static/'*: Directory to place all your app's built static assets (including css and js) in. To include an assets version in the path use `{{version}}` and this will be replaced at build time with teh asset parameter pased in (see Running -> parameters below)

### Build steps

* `blocks` *['clean', 'tpl', 'js', 'css', 'modernize', 'assets']*: Blocks of build tasks to carry out. The names refer to blocks of tasks that carry out the following
    
    * `clean`: removes the files created by the last build
    * `tpl`: builds templates which correctly include origami modules and their dependencies' templates
    * `js`: browserifies all your js modules and copies them to your built app. Also minifies your inline head script template and copies any polyfills across to your built app
    * `css`: runs sass on all your css modules and copies them to your built app
    * `modernize`: generates a custom modernizr build
    * `assets`: copies other static assets across to your built app

    Any other strings added to the blocks array must be the names of grunt tasks you want to run as part of *every* build
    
    In addition to these strings you can also put functions in the array of the form `function (sub, env, tasks, grunt) {}` where
    * `sub`: the sub-section of the build which has been called (see section on `Running` below)
    * `env`: the environment the build is being run in (`dev` or `prod`)
    * `tasks`: the queue of grunt tasks constructed so far
    * `grunt`: the current instance of grunt

    These functions may limit themselves to simple operations e.g. setting a dynamic property on the grunt config. If, however, the intention is for it to run some grunt tasks they **must not** use `grunt.task.run`; instead they should push/concat these tasks onto the `tasks` array provided.

* `skipBlocks` *[]*: List of named build blocks to skip  
* `skipTasks` *[]*: List of specific grunt-tasks to skip. e.g. `copy:polyfills` will skip copying css, whereas `copy` will skip `copy:polyfills`, `copy:js` etc...


### Modules
* `isModular` *false*: Whether or not the app follows the directory structure for a more complex modular app 

### Individual task config
* `copyExcludeList` *[]*: List of files and subdirectories to exclude when copying static assets from bower_components to the built app; by default most assets from origami modules will be copied. Adding a `\` to the end of an entry here will exclude that directory and its entire contents. Accepts standard globbing patterns. *Note that this has no effect on any asset contained in an `assets` directory.*
* `copyIncludeList` *[]*: List of files and directories to include when copying static assets to the built app. Accepts standard globbing patterns. Remember that any directory with the name `assets` will already be copied to your built assets directory by default. paths beginning with a './' will be relative to the project root. Paths beginning with oter characters will be looked for in the bower directory.
* `bowerPolyfills` *[]*: Paths to polyfills installed via bower. Note that e.g. `event-listeners/EventListener.polyfill.min.js` will be copied to `js/polyfills/event-listeners.js` in the built app
* `srcPolyfills` *[]*: Paths to polyfills not installed via bower. Note that e.g. `src/path/vendor/es6-promises.js` will be copied to `js/polyfills/es6-promises.js` in the built app
* `watch` *{}*: Configuration to be passed in to grunt-contrib-watch. By default ft-frontend-build's `watch` task watches for changes in all scss and js files in your bower or src directories 
* `templating`: Configuration object for constructing your app's templates when they require origami modules' templates. The `type` property (currently only accepting the value 'hogan-express') specifies the templating system you are using, and the remaining properties specify options for parsing the templates

#### Hogan-express templating options

*Note that after the build has completed a json file `ft-frontend-template-map.json` will be created in the root of your project and this should be required when registerin gpartials with express.*

*`srcDirectory` *'./templates/'*: The directory where your templates are located
*`overrides` *{}*: Object containing variables in origami templates whose values shoudl be rewritten e.g.
          
          'o-ft-header': { // will run over all variables in o-ft-header's template
              _namespace: 'header', // will replace 'o-ft-header.' with 'header.' as the namespace for all variables in the template. Passing in '' will remove teh namespace entirely, including the .
              'topbar-items': 'o-ft-legacy-signin' // will replace {{o-ft-header.topbar-items}} with {{> o-ft-legacy-signin}} i.e. allows you to replace a placeholder variable with another module's template
              encodedLocation: 'encodedLocation' // replaces {{o-ft-header.encodedLocation}} with {{encodedLocation}}
              advert: '> promo1' // replaces {{o-ft-header.advert}} with {{> promo1}}
          }
        



## Running using the CLI

### Tasks

4 tasks are available

* `default` (called using `grunt`) - runs both `test` and `build`
* `test` (called using `grunt test`) - lints js files and runs any unit tests using karma
* `build` (called using `grunt build`) - builds the app
* `watch` (called using `grunt watch`) - watches for source code changes (including changes to bower modules) and runs a sub-build in dev mode 

In addition `build` accepts two optional parameters, 

*`subbuild`: Specifies a subsection of the build to run. The naming convention follows that of `blocks`
*`env`: Specifies whether to carry out a production (`prod`) or dev (`dev`) build - defaults to `prod`

e.g `build:js:dev`, `build:dev`, 

### Parameters

The asset version to build can be set using `--assetVersion=1.2.3` in the cli. This version number (and a '/') will be appended to the built app's static assets path, defaulting to 0.0.1

## Tests

By default these should be written in jasmine and will be run using karma, but can be overwritten in their entirety



# Development

## Tests

`make test`. To setup the test environment with copies of all required node modules run `make testSetup`.

Be warned, as the tests require multiple build processes to be simulated they are pretty slow. 


/*
TODO

test paths
modernizr + modernizrless versions of tests

*/