var hogan = require("hogan.js");


module.exports = function(grunt) {
    "use strict";

    var mappings;

    function inlineAllPartials (tpl) {
        tpl = grunt.file.read(tpl).replace(/\{\{\$([\w\-]+)\}\}\{\{\/\1\}\}/ig, function ($0, $1) {
            return '{{' + mappings[$1] + '}}';
        }).replace(/\{\{> (\/views\/[\w\-\/]+)\}\}/ig, function ($0, $1) {
            return inlineAllPartials('./target' + $1 + '.mustache');
        });
        return tpl;
    }

    grunt.task.registerTask("hogan-compile", "Compiling templates for use with hogan", function() {

        grunt.config.requires('hogan-compile.files');
        var templates = grunt.config('hogan-compile.files');
        mappings = grunt.config('hogan-compile.mappings');
        templates = templates.map(function (tplConf) {
            return {
                dest: tplConf.dest,
                tpl: inlineAllPartials(tplConf.src)
            };
        }).map(function (tplConf) {
            grunt.file.write('./src/main/resources/static/js/views/' + tplConf.dest + '.js',
                'var Hogan = require(\'hogan\'); module.exports = new Hogan.Template({code:' + hogan.compile(tplConf.tpl, {asString: true}) + '});');
        });

        console.log(templates[0]);

    });

};
