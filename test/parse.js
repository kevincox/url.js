if ( typeof require == "function" )
{
	var expect = require("expect.js");
	var url    = require("../url");
}

describe('.parse()', function()
{
	var tests = [];
	var td;

	it("should parse emails", function() {
		var td = "mailto:someone@example.com";
		expect(url.parse(td)).to.eql({
			url: td,
			scheme: "mailto",
			user: "someone",
			host: "example.com",
		});
	});
	it("should parse hashes", function() {
		var td = "http://localhost#why=do&this";
		expect(url.parse(td)).to.eql({
			url: td,
			scheme: "http",
			host: "localhost",
			hash: "why=do&this",
		});
	});
	it("should parse sub domains", function() {
		var td = "https://user:pass@many.sub.domains.com/";
		expect(url.parse(td)).to.eql({
			url: td,
			scheme: "https",
			user: "user",
			pass: "pass",
			host: "many.sub.domains.com",
			path: "/",
		});
	});
	it("should parse url-looking-things", function() {
		var td = "//user:@/hi#";
		expect(url.parse(td)).to.eql({
			url: td,
			user: "user",
			pass: "",
			path: "/hi",
			hash: "",
		});
	});
	it("should parse everything", function() {
		var td = "::pass@:1337/hi?v=1&v2=%20#anchor";
		expect(url.parse(td)).to.eql({
			url: td,
			scheme: "",
			user: "",
			pass: "pass",
			port: 1337,
			path: "/hi",
			query: "v=1&v2=%20",
			get: {v:"1", "v2":" "},
			hash: "anchor",
		});
	});
	it("should parse query strings", function() {
		var td = "?a=1&b=2";
		expect(url.parse(td)).to.eql({
			url: td,
			query: "a=1&b=2",
			get: {a:"1", b:"2"},
		});
	});

	it("port should be a number", function() {
		expect(url.parse("http://example.com:1234").port).to.be(1234);
	});
});
