#! /usr/bin/env node

var assert = require("assert");

function test(url)
{
	var opt = {}, r;
	var td;
	///// Returns strings, not numbers.
	assert.strictEqual(url.get("test=5").test, "5")
	assert.strictEqual(url.get("test=05").test, "05")

	///// Simple stuff.
	assert.deepEqual(url.get("test=5"), {test:"5"});
	assert.deepEqual(url.get("a=5&b=c=5"), {a:"5",b:"c=5"});

	///// Rightmost value has priority.
	assert.deepEqual(url.get("test=5&test=6&foo=bar&test=7"), {test:"7",foo:"bar"});

	///// Automatically grab the query string.
	opt = {full:true};
	assert.deepEqual(url.get("example.com/?a=5&b&c=5", opt), {a:5,b:true,c:5});

	///// Arrays/Maps
	opt = {array:true};
	assert.deepEqual(url.get("a[0]=5&a[1]=6", opt), {a:[5,6]});
	assert.deepEqual(url.get("a[0]=5&a[hello]=6", opt), {a:{0:5,"hello":6}});
	assert.deepEqual(url.get("a[0][0]=1", opt), {a:[[1]]});
	assert.deepEqual(url.get("a[0][0]=1&a[0][1]=3&a[1][0]=4", opt), {a:[["1","3"],["4"]]});

	///// Gaps
	assert.strictEqual(url.get("array[1]=test", opt).array[1], "test");

	///// Plain values override arrays.
	assert.deepEqual(url.get("a=7&a[0][0]=1", opt), {a:"7"});
	assert.deepEqual(url.get("a[0][0]=1&a=7", opt), {a:"7"});

	///// URL Encoding
	assert.deepEqual(url.get("%5B%5D%3D%3F%26=%5B%5D%3D%3F%26"), {"[]=?&":"[]=?&"});
	assert.deepEqual(url.get("%5B%5D%3D%3F%26[%5B%5D%3D%3F%26]=%5B%5D%3D%3F%26", opt), {"[]=?&":{"[]=?&":"[]=?&"}});

	td = "mailto:someone@example.com";
	assert.deepEqual(url.parse(td), {
		url: td,
		scheme: "mailto",
		user: "someone",
		host: "example.com",
	});
	td = "http://localhost#why=do&this";
	assert.deepEqual(url.parse(td), {
		url: td,
		scheme: "http",
		host: "localhost",
		hash: "why=do&this",
	});
	td = "https://user:pass@many.sub.domain.com/";
	assert.deepEqual(url.parse(td), {
		url: td,
		scheme: "https",
		user: "user",
		pass: "pass",
		host: "many.sub.domain.com",
		path: "/",
	});
	td = "//user:@/hi#";
	assert.deepEqual(url.parse(td), {
		url: td,
		user: "user",
		pass: "",
		path: "/hi",
		hash: "",
	});
	td = "::pass@:1337/hi?v=1&v2=%20#anchor";
	assert.deepEqual(url.parse(td), {
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
	assert.strictEqual(url.parse("http://example.com:1234").port, 1234)
	td = "?a=1&b=2";
	assert.deepEqual(url.parse(td), {
		url: td,
		query: "a=1&b=2",
		get: {a:"1", b:"2"},
	});

	///// GET building.
	td = {user:["hi","joe"],"r&[":{te:5, "t[vd]":["foo"]}}
	assert.deepEqual(url.get(url.buildget(td),{array:true}), td);

	///// URL building.
}

function run (path, desc)
{
	try {
		var url = require(path);
		console.log("##### Testing "+desc+".");
		test(url);
	} catch (e)
	{
		if ( e.code != 'MODULE_NOT_FOUND' )
			throw e;
	}
}

run("./url", "source version");
run("./url.min", "built version");

console.log("Tests complete!");
