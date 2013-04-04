if ( typeof require == "function" )
{
	var expect = require("expect.js");
	var url    = require("../url");
}

describe('.parse()', function()
{
	var tests = [];
	var td;
	
	td = "mailto:someone@example.com";
	tests.push({desc: "email",
		url: td,
		result: {
			url: td,
			scheme: "mailto",
			user: "someone",
			host: "example.com",
		},
	});
	td = "http://localhost#why=do&this";
	tests.push({desc: "hash",
		url: td,
		result: {
			url: td,
			scheme: "http",
			host: "localhost",
			hash: "why=do&this",
		},
	});
	td = "https://user:pass@many.sub.domains.com/";
	tests.push({desc: "sub domains",
		url: td,
		result: {
			url: td,
			scheme: "https",
			user: "user",
			pass: "pass",
			host: "many.sub.domains.com",
			path: "/",
		},
	});
	
	td = "//user:@/hi#";
	tests.push({desc: "barely a url",
		url: td,
		result: {
			url: td,
			user: "user",
			pass: "",
			path: "/hi",
			hash: "",
		},
	});
	td = "::pass@:1337/hi?v=1&v2=%20#anchor";
	tests.push({desc: "everything",
		url: td,
		result: {
			url: td,
			scheme: "",
			user: "",
			pass: "pass",
			port: 1337,
			path: "/hi",
			query: "v=1&v2=%20",
			get: {v:"1", "v2":" "},
			hash: "anchor",
		},
	});
	td = "?a=1&b=2";
	tests.push({desc: "barely a url",
		url: td,
		result: {
			url: td,
			query: "a=1&b=2",
			get: {a:"1", b:"2"},
		},
	});
	
	tests.forEach(function(d)
	{
		it("should parse "+d.desc, function(){
			expect(url.parse(d.url, d.opt)).to.eql(d.result);
		});
	});
	
	it("port should be a number", function() {
		expect(url.parse("http://example.com:1234").port).to.be(1234);
	});
});
