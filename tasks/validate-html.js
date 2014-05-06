/**
 * This can be run either directly as a node script:
 *
 * node validate-html.js http://www.ft.com/page.html
 *
 * or as a grunt task. Any colons in the URL must be escaped:
 *
 * grunt validate-html:http\://offline.ci.article.svc.ft.com/cms/s/2/65d9a786-5bf7-11e3-be26-002128161462.html
 *
 * Either it outputs a TAP-formatted report to the console.
 */
"use strict";

var http = require('http');

function endsWith(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
}
var runAsGruntTask = endsWith(process.argv[1], 'grunt');

function getPageHTML(url, cb) {
    var req = http.get(url, function (res) {
        var str = "";
        res.on('data', function (chunk) {
            str = str + chunk;
        });
        res.on('end', function () {
            if (typeof cb === "function") {
                console.log(str);
                cb(str);
            }
        });
    }).on('error', function (err) {
        console.log('Error getting url', err);
    });
    req.end();
}

function postHTML(html, cb) {
    var req = http.request({
        host: '10.112.49.67',
        port: '8080',
        path: '/?out=json',
        method: 'POST',
        headers: {
            'Content-Type': 'text/html; charset=UTF-8'
        }
    }, function (res) {
        var str = "";
        res.on('data', function (chunk) {
            str = str + chunk;
        });
        res.on('end', function () {
            if (typeof cb === "function") {
                cb(str);
            }
        });
    });
    req.setTimeout(2000, function() {
        req.abort();
    });
    req.on('error', function() {
        console.log('Error posting to HTML validator');
        req.end();
    });
    req.write(html);
    req.end();
}

function validatePage(url, cb) {
    getPageHTML(url, function (html) {
        postHTML(html, function(report) {
            if (typeof cb === "function") {
                try {
                    report = JSON.parse(report);
                    cb(report);
                } catch (e) {}
            }
        });
    });
}

function getTAPReport(pageUrl, repObj) {
    var messages = repObj.messages.filter(function(v) {
        return (!!v.subType);
    });
    var report = [];
    report.push('TAP version 13');
    report.push('# Validating page at ' + pageUrl);
    report.push('1..' + (messages.length ? messages.length : 1));
    if (messages.length === 0) {
        report.push('ok 0 - Page is valid.');
    } else {
        messages.forEach(function(v, i) {
            report.push("not ok " + (i+1) + " - " + v.message);
            report.push("  ---");
            report.push("  subType: " + v.subType);
            report.push("  lastLine: " + v.lastLine);
            report.push("  lastColumn: " + v.lastColumn);
            report.push("  firstColumn: " + v.firstColumn);
            report.push("  message: '" + v.message + "'");
            report.push("  ...");
        });
    }
    return report.join('\n');
}

// Running directly as node script:
if (!runAsGruntTask) {
    var pageUrl = process.argv[2];
    if (pageUrl) {
        validatePage(pageUrl, function (report) {
            console.log(getTAPReport(pageUrl, report));
        });
    } else {
        console.error('No URL given. Nothing to validate.');
    }
}

// Running directly as grunt task:
module.exports = function(grunt) {

    grunt.registerTask('validate-html', 'Validate an HTML page. Takes one argument: the URL of the page to be validated.', function (pageUrl) {
        if (pageUrl) {
            var done = this.async();
            validatePage(pageUrl, function (report) {
                grunt.log.write(getTAPReport(pageUrl, report));
                done();
            });
        } else {
            grunt.log.error('No URL given. Nothing to validate.');
        }
    });

};