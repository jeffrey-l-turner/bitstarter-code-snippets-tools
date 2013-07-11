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
var HTMLFILE_DEFAULT = "index.html";
/* var URLPATH_DEFAULT = "http://127.0.0.1//index.html"; // Defaults to localhost index.html */
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLExists = function(uri) {
    /*   PUT some code here to check if URL is valid
	if(!fs.existsSync(instr)) {
          console.log("%s does not exist. Exiting.", instr);
          process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
        
	rest.get(url).on('complete', function(result) { 
        if (result instanceof Error) {
                console.error('Error: ' + result.message);
                process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
                } else {
                return url;
       }
    }
*/
    url = true;
    return uri;
};

var callback = function(rslt) {
    if (rslt instanceof Error) {
        console.error('Error: ' + rslt.message);
        process.exit(1);                          // http://nodejs.org/api/process.html#process_process_exit_code
    } else {
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    }
};

var cheerioHTML = function(html) {
/* add if statement to return load dependent on if HTML or a file */
    if (url === true) {
	rest.get(html).on('complete', callback(dom));
        }
    else return cheerio.load(fs.readFile(html, callback(dom)));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHTML = function(html, checksfile) {
    console.log("html = " + html);
    $ = cheerioHTML(html);
//  console.log("$ = " + $);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

/* var buildfn = function(csvfile, headers) {
    var response2console = function(result, response) {
        if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
        } else {
            console.error("Wrote %s", csvfile);
            fs.writeFileSync(csvfile, result);
            csv2console(csvfile, headers);
        }
    };
    return response2console;
};

var marketResearch = function(symbols, columns, csvfile, headers) {
    symbols = symbols || SYMBOLS_DEFAULT;
    columns = columns || COLUMNS_DEFAULT;
    csvfile = csvfile || CSVFILE_DEFAULT;
    headers = headers || HEADERS_DEFAULT;
    var apiurl = financeurl(symbols, columns);
    var response2console = buildfn(csvfile, headers);
    rest.get(apiurl).on('complete', response2console);
};

rest.get('http://google.com').on('complete', function(result) { 
  if (result instanceof Error) {
    console.error('Error: ' + result.message);
  } else {
    return result;
  }


*/

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var url = false;
var dom;

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'URL to html file for grading', clone(assertURLExists))
        .parse(process.argv);
    if (program.url) // { console.log("program.url = " + program.url); 
                       //          console.log("program.checks = " + program.checks); 
              { var checkJson = checkHTML(program.url, program.checks); } 
    else { url = false; var checkJson = checkHTML(program.file, program.checks);}
//    var outJson = JSON.stringify(checkJson, null, 4);
//    console.log(outJson);
} else {
    exports.checkHtml = checkHTML;
}
