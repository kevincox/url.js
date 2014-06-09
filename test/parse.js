// Copyright 2013-2014 Kevin Cox

/*******************************************************************************
*                                                                              *
*  This software is provided 'as-is', without any express or implied           *
*  warranty. In no event will the authors be held liable for any damages       *
*  arising from the use of this software.                                      *
*                                                                              *
*  Permission is granted to anyone to use this software for any purpose,       *
*  including commercial applications, and to alter it and redistribute it      *
*  freely, subject to the following restrictions:                              *
*                                                                              *
*  1. The origin of this software must not be misrepresented; you must not     *
*     claim that you wrote the original software. If you use this software in  *
*     a product, an acknowledgment in the product documentation would be       *
*     appreciated but is not required.                                         *
*                                                                              *
*  2. Altered source versions must be plainly marked as such, and must not be  *
*     misrepresented as being the original software.                           *
*                                                                              *
*  3. This notice may not be removed or altered from any source distribution.  *
*                                                                              *
*******************************************************************************/

if ( typeof require == "function" )
{
	var chai = require("chai");
	var url  = require("../url");
}
var expect = chai.expect;
chai.config.includeStack = true;

describe('.parse()', function()
{
	var tests = [];
	var td;
	
	it("should parse ftp://my.host.com:1337/a/file?ftp=query%3F#anchor", function() {
		expect(url.parse("ftp://my.host.com:1337/a/file?ftp=query%3F#anchor"))
			.to.eql({
				"url": "ftp://my.host.com:1337/a/file?ftp=query%3F#anchor",
				"scheme": "ftp",
				"user": undefined,
				"pass": undefined,
				"host": "my.host.com",
				"port": 1337,
				"path": "/a/file",
				"query": "ftp=query%3F",
				"get": {
					"ftp": "query?"
				},
				"hash": "anchor"
			});
	});
	it("should parse mailto:kevincox.ca@gmail.com", function() {
		expect(url.parse("mailto:kevincox.ca@gmail.com"))
			.to.eql({
				"url":    "mailto:kevincox.ca@gmail.com",
				"scheme": "mailto",
				"user":   "kevincox.ca",
				"pass":   undefined,
				"host":   "gmail.com",
				"port":   undefined,
				"path":   undefined,
				"query":  undefined,
				"get":    undefined,
				"hash":   undefined,
			});
	});
	it("should parse emails", function() {
		var td = "mailto:someone@example.com";
		expect(url.parse(td)).to.eql({
			url:    td,
			scheme: "mailto",
			user:   "someone",
			pass:   undefined,
			host:   "example.com",
			port:   undefined,
			path:   undefined,
			query:  undefined,
			get:    undefined,
			hash:   undefined,
		});
	});
	it("should parse hashes", function() {
		var td = "http://localhost#why=do&this";
		expect(url.parse(td)).to.eql({
			url:    td,
			scheme: "http",
			user:   undefined,
			pass:   undefined,
			host:   "localhost",
			port:   undefined,
			path:   undefined,
			query:  undefined,
			get:    undefined,
			hash:   "why=do&this",
		});
	});
	it("should parse sub domains", function() {
		var td = "https://user:pass@many.sub.domains.com/";
		expect(url.parse(td)).to.eql({
			url:    td,
			scheme: "https",
			user:   "user",
			pass:   "pass",
			host:   "many.sub.domains.com",
			port:   undefined,
			path:   "/",
			query:  undefined,
			get:    undefined,
			hash:   undefined,
		});
	});
	it("should parse url-looking-things", function() {
		var td = "//user:@/hi#";
		expect(url.parse(td)).to.eql({
			url:    td,
			scheme: undefined,
			user:   "user",
			pass:   "",
			host:   undefined,
			port:   undefined,
			path:   "/hi",
			query:  undefined,
			get:    undefined,
			hash:   "",
		});
	});
	it("should parse everything", function() {
		var td = "::pass@:1337/hi?v=1&v2=%20#anchor";
		expect(url.parse(td)).to.eql({
			url:    td,
			scheme: "",
			user:   "",
			pass:   "pass",
			host:   undefined,
			port:   1337,
			path:   "/hi",
			query:  "v=1&v2=%20",
			get:    {v:"1", "v2":" "},
			hash:   "anchor",
		});
	});
	it("should parse query strings", function() {
		var td = "?a=1&b=2";
		expect(url.parse(td)).to.eql({
			url:    td,
			scheme: undefined,
			user:   undefined,
			pass:   undefined,
			host:   undefined,
			port:   undefined,
			path:   undefined,
			query:  "a=1&b=2",
			get:    {a:"1", b:"2"},
			hash:   undefined,
		});
	});
	
	it("port should be a number", function() {
		expect(url.parse("http://example.com:1234"))
			.to.have.property("port", 1234);
	});
});
