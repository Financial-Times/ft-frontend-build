"use strict";

var path = require('path');

function addFileExtension (path) {
    return (/\.(html|mustache|svg)$/).test(path) ? path : (path + '.mustache');
}

function analyzeMustacheContent (content, module) {
    
    var parsedMustache,
        origamiTemplatesDirectory = grunt.config('build-templates.pathToCompiled') || 'origami-templates',
        origamiPartialRX = new RegExp('> *(?:(?:\\.?\\/)?' + origamiTemplatesDirectory.replace('/', '\\/') + '\\/)?(o\\-[a-z\\d\\-]+)((?:\\/[\\w\\d\\-_]+)*\\/[\\w\\d\\-]+)(\\.mustache|\\.html|\\.svg)?', 'gi'),
        // matches stings of the form o-modulename/path/to/template!items=path/to/partial,moreitems=path/to/other/partial
        normalPartialRX = /> *((?:\.?\/)?[a-z\d\-\/_]+)(\.mustache|\.html|\.svg)?/gi,
        origamiVariableRX = /(#|\^|\/)?(o\-[a-z\-]+)\.(.*)/gi,
        superRX = /< *((?:\.?\/)?[a-z\d\-\/_]+)/gi,
        normalTemplatePrefix = grunt.config('build-templates.cwd') || '';

    if (parsedMustache = origamiPartialRX.exec(content)) {
        return {
            type: 'origamiPartial',
            module: parsedMustache[1],
            template: parsedMustache[2],
            fileExtension: parsedMustache[3] || '.mustache'
        };
    } else if (parsedMustache = normalPartialRX.exec(content)) {
        if (module) {
            return {
                type: 'origamiPartial',
                module: module,
                template: parsedMustache[1],
                fileExtension: parsedMustache[2] || '.mustache'
            };
        } else {
            return {
                type: 'normalPartial',
                template: normalTemplatePrefix + parsedMustache[1],
                fileExtension: parsedMustache[2] || '.mustache'
            };
        }
    } else if (parsedMustache = origamiVariableRX.exec(content)) {
        return {
            type: 'origamiVariable',
            mode: parsedMustache[1],
            module: parsedMustache[2],
            property: parsedMustache[3]
        };
    } else if (parsedMustache = superRX.exec(content)) {
        return {
            type: 'superTemplate',
            path: parsedMustache[1]
        };
    }
    return {};

}

function inlineOrigamiPartials (template, module, settings) {
    settings = settings || {};

    var origamiTemplatesDirectory = grunt.config('build-templates.pathToCompiled') || 'origami-templates',
        bowerDirectory = grunt.config('build-templates.pathToBower') || 'bower_components',
        cwd = (grunt.config('build-templates.cwd') || ''),// + '/',
        newTemplate = grunt.file.read(template).replace(/\{\{(\{)?(?!\!) *([^(?:\}\})]*) *\}?\}\}/g, function ($0, escaped, content) {
            var action = analyzeMustacheContent(content, module),
                result = $0;
            if (action.type === 'superTemplate') {
                inlineOrigamiPartials('./src/main/resources' + action.path + '.mustache');
            } else if (action.type === 'origamiPartial') {

                var newPartial = grunt.config('build-templates.overrides.' + action.module + '.' + action.template.replace(/^\.?\/?/, ''));

                if (newPartial) {

                    if (newPartial.indexOf('o-') === 0) {
                        result = inlineOrigamiPartials(path.join(process.cwd(), bowerDirectory + '/' + addFileExtension(newPartial)), newPartial.split('/').shift());
                    } else {
                        result = inlineOrigamiPartials(path.join(process.cwd(), addFileExtension(newPartial)), newPartial.split('/').shift());
                    }

                } else {
                    result = inlineOrigamiPartials(path.join(process.cwd(),bowerDirectory + '/' + action.module + '/' + action.template + action.fileExtension), action.module, {});
                
                    if (!module) {
                        result = $0;
                    }
                }

            } else if (action.type === 'origamiVariable') {
                var newVariable = grunt.config('build-templates.overrides.' + action.module + '.' + action.property);
                if (newVariable) {
                    if (/^>/.test(newVariable)) {
                        newVariable = newVariable.replace(/^> */, '');
                        if (/^o\-/.test(newVariable)) {
                            result = inlineOrigamiPartials(path.join(process.cwd(), bowerDirectory + '/' + addFileExtension(newVariable)), newVariable.split('/').shift());
                        } else {
                            result = inlineOrigamiPartials(path.join(process.cwd(), addFileExtension(newVariable)), newVariable.split('/').shift());
                        }
                    }
                    else {
                        result = '{{' + (escaped ? '{' : '') + (action.mode || '') + newVariable + (escaped ? '}' : '') + '}}';
                    }
                } else {
                    var newNamespace = grunt.config('build-templates.overrides.' + action.module + '._namespace');
                    if (newNamespace) {
                        result = '{{' + (escaped ? '{' : '') + (action.mode || '') + newNamespace + '.' + action.property + (escaped ? '}' : '') + '}}';
                    }
                }
            } else {
                if (action.type === 'normalPartial') {
                    // it's not an origami partial so we just treat it as a relative path
                    inlineOrigamiPartials(path.join(process.cwd(), action.template + action.fileExtension ));
                }
                
            }
            return result;

        });

    if (module) {
        
        grunt.file.write(cwd + origamiTemplatesDirectory + '/' + module + template.split(module).pop(), newTemplate);
    }
    return newTemplate;

}

var grunt,
    task = function (aGrunt) {

    grunt = aGrunt;

    grunt.registerTask('build-templates', function () {
        grunt.config.requires('build-templates.files');

        var templates = grunt.file.expand(grunt.config('build-templates.files'));
        

        templates.forEach(function (tpl) {
            inlineOrigamiPartials(tpl);
        });
    });

};

task.exec = inlineOrigamiPartials;

module.exports = task;

