#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio, and restler. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + restler
   - https://github.com/danwrong/Restler/

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var util = require('util');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var buildFcn = function(jsoncheck, html) {
    var response2 = function(result, response) {
        if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
        } else  {
            var checks = loadChecks(jsoncheck).sort();
            $ = cheerio.load(result);
            var out = {};
            for(var ii in checks) {
                var present = $(checks[ii]).length > 0;
                out[checks[ii]] = present;
            }

            var outJson = JSON.stringify(out, null, 4);
            console.error("Got %s for html", html);
            console.log(outJson);
        }
    };
    return response2;
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var assertURLExists = function(url) {
    return url;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'URL to html file for grading', clone(assertURLExists))
        .parse(process.argv);
    if (program.url) {
          var httpGetResponse = buildFcn(program.checks, program.url);
          console.error("program.checks =" + program.checks + " ; program.url = " + program.url);
          rest.get(program.url).on('complete', httpGetResponse);
          }
    else { url = false;
          var chksfile = program.checks;
          var htmlfile = program.file;
          console.error("checksfile =" + program.checks + " ; program.file = " + program.file);
          var fsReadResponse = buildFcn(chksfile, htmlfile);
          fs.readFile(htmlfile, fsReadResponse);
         }
} else {
    exports.checkHtmlFile = buildFcn;
}
