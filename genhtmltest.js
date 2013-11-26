#! /usr/bin/env node

var fs = require("fs");
var path = require("path");

var tests = fs.readdirSync("test/");

var html = fs.readFileSync("test/test.html", "utf-8");
var htmlweb = html;

var mydir = path.dirname(module.filename)

var mocha = path.dirname(require.resolve("mocha"));
html    = html.replace(/\{\{\{mocha\}\}\}/g, path.relative(mydir, mocha)+"/");
htmlweb = htmlweb.replace(/\{\{\{mocha\}\}\}/g, "");

var chai = path.dirname(require.resolve("chai"));
html    = html.replace(/\{\{\{chai\}\}\}/g, path.relative(mydir, chai)+"/");
htmlweb = htmlweb.replace(/\{\{\{chai\}\}\}/g, "http://chaijs.com/");

var tf = "";
var tfweb = "";
tests.forEach(function(t)
{
	if ( t.slice(-3) != ".js" ) return;

	tf    += '<script src="test/'+t+'"></script>\n';
	tfweb += '<script src="https://rawgithub.com/kevincox/url.js/master/test/'+t+'"></script>\n';
});
html    = html.replace(/\{\{\{tests\}\}\}/g, tf);
htmlweb = htmlweb.replace(/\{\{\{tests\}\}\}/g, tfweb);

fs.writeFileSync("test.html", html.replace(/\{\{\{url\}\}\}/g, "url.js"));
fs.writeFileSync("test.min.html", html.replace(/\{\{\{url\}\}\}/g, "url.min.js"));
fs.writeFileSync("test.web.html", htmlweb.replace(/\{\{\{url\}\}\}/g, "https://rawgithub.com/kevincox/url.js/master/url.js"));
