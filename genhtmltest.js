#! /usr/bin/env node

var fs = require("fs");
var path = require("path");

var tests = fs.readdirSync("test/");

var html = fs.readFileSync("test/test.html", "utf-8");

var mydir = path.dirname(module.filename)

var mocha = path.dirname(require.resolve("mocha"));
html = html.replace(/\{\{\{mocha\}\}\}/g, path.relative(mydir, mocha));

var mocha = require.resolve("expect.js");
html = html.replace(/\{\{\{expect\}\}\}/g, path.relative(mydir, mocha));

var tf = "";
tests.forEach(function(t)
{
	if ( t.slice(-3) != ".js" ) return;
	
	tf += '<script src="test/'+t+'"></script>\n';
});
html = html.replace(/\{\{\{tests\}\}\}/g, tf);

fs.writeFileSync("test.html", html.replace(/\{\{\{url\}\}\}/g, "url.js"));
fs.writeFileSync("test.min.html", html.replace(/\{\{\{url\}\}\}/g, "url.min.js"));
