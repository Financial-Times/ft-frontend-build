"use strict";

var path = require('path');

var partialsMap = {};
var registeredModules = {};

function addFileExtension (path) {
    return (/\.(html|mustache|svg)$/).test(path) ? path : (path + '.mustache');
}

function analyzeMustacheContent (content, module) {
    
    var parsedMustache;
    var origamiModuleRX = /^>? *(o\-[a-z\d\-]+) *$/;

    var normalPartialRX = /^> *([a-z\d\-\/_]+)(\.mustache|\.html|\.svg)? *$/gi;
    var origamiVariableRX = /^(#|\^|\/)?(o\-[a-z\-]+)\.(.*) *$/gi;

    // for origami modules that require partials from within their own directory. Not implemented as no modules implement this pattern as yet
    // var origamiPartialRX = /^> *(?:(?:\.?\/)?\/)?(o\-[a-z\d\-]+)((?:\/[\w\d\-_]+)*\/[\w\d\-]+)(\.mustache|\.html|\.svg)? *$/gi;

    if (parsedMustache = origamiModuleRX.exec(content)) {
        return {
            type: 'origamiModule',
            module: parsedMustache[1],
            template: parsedMustache[2],
            fileExtension: parsedMustache[3] || '.mustache'
        };
    } else if (parsedMustache = normalPartialRX.exec(content)) {
        return {
            type: 'normalPartial',
            template: parsedMustache[1],
            fileExtension: parsedMustache[2] || '.mustache'
        };
    } else if (parsedMustache = origamiVariableRX.exec(content)) {
        return {
            type: 'origamiVariable',
            mode: parsedMustache[1],
            module: parsedMustache[2],
            property: parsedMustache[3]
        };
    }
    return {};

}

module.exports = function (grunt) {
    
    var templatesDirectory = grunt.config('ft.templating.srcDirectory');
    var bowerDirectory = grunt.config('ft.bowerPath');

    function scanMustacheTemplate (path, callback) {
        return grunt.file.read(path).replace(/\{\{(\{)?(?!\!) *([^(?:\}\})]*) *\}?\}\}/g, function (original, isEscaped, content) {
            var mustacheData = analyzeMustacheContent(content);
            return callback(mustacheData, original, isEscaped);
        });
    }


    function registerOrigamiModule (module) {

        // only needs to run once per module
        if (registeredModules[module]) return;
        registeredModules[module] = true;

        // register this module's template as a partial
        partialsMap[module] = 'partials/' + module;

        // scan the template looking fot mustaches with special origami values
        var template = scanMustacheTemplate(path.join(process.cwd(), bowerDirectory, module, 'main.mustache'), function (mustacheData, original, isEscaped) {
            
            // by default return an unaltered string
            var result = original;

            if (mustacheData.type === 'origamiVariable') {

                // see if a variable in the module's namespace should be replaced with a value set by the product config
                var newVariable = grunt.config('ft.templating.overrides.' + mustacheData.module + '.' + mustacheData.property);

                if (newVariable) {
                    
                    // if it's a reference to another origami module register atht origami module and overwrite the variable with a reference to the newly registerd module as a partial
                    if (/^o\-/.test(newVariable)) {
                        registerOrigamiModule(newVariable);
                        result = '{{> ' + newVariable + '}}';
                     // } else {
                        // dunno what to do here - no modules use this pattern yet
                        // result = registerPartials(path.join(process.cwd(), addFileExtension(newVariable)), newVariable.split('/').shift());
                    } else if (/^>/.test(newVariable)) {
                        var partialName = newVariable.replace(/^> */, '');
                        partialsMap[partialName] = 'partials/' + partialName;
                        result = '{{> ' + partialName + '}}';
                    // } else {
                        // dunno what to do here - no modules use this pattern yet
                        // result = registerPartials(path.join(process.cwd(), addFileExtension(newVariable)), newVariable.split('/').shift());
                    } else {
                        // otherwise overwrite the placeholder variable
                        result = '{{' + (isEscaped ? '{' : '') + (mustacheData.mode || '') + newVariable + (isEscaped ? '}' : '') + '}}';
                    }
                } else {
                    // check if the namespace of the module should be overwritten
                    var newNamespace = grunt.config('ft.templating.overrides.' + mustacheData.module + '._namespace');
                    if (newNamespace) {
                        result = '{{' + (isEscaped ? '{' : '') + (mustacheData.mode || '') + newNamespace + '.' + mustacheData.property + (isEscaped ? '}' : '') + '}}';
                    } else if (newNamespace === '') {
                        result = '{{' + (isEscaped ? '{' : '') + (mustacheData.mode || '') + mustacheData.property + (isEscaped ? '}' : '') + '}}';
                    }
                }
               
            }
            return result;

        });

        grunt.file.write(path.join(process.cwd(), templatesDirectory, 'partials', module + '.mustache'), template);

    }


    function registerPartials (template) {

        scanMustacheTemplate(template, function (mustacheData, original, isEscaped) {
            if (mustacheData.type === 'origamiModule') {
                registerOrigamiModule(mustacheData.module);
            } else if (mustacheData.type === 'normalPartial') {
                partialsMap[mustacheData.template] = 'partials/' + mustacheData.template;
            }
            return original;
        });
    }

    grunt.registerTask('hogan-express', function () {
        grunt.file.expand(path.join(process.cwd(), grunt.config('ft.templating.srcDirectory'), '**/*.mustache')).forEach(function (tpl) {
            registerPartials(tpl);
        });

        grunt.file.write('ft-frontend-template-map.json', JSON.stringify(partialsMap));
    });

};