#! /usr/bin/env node

var assert = require("assert");
var url = require("./url.min");
var opt = {}, r;

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

assert.deepEqual(url.parse("mailto:someone@example.com"), {
	scheme: "mailto",
	user: "someone",
	host: "example.com",
});
assert.deepEqual(url.parse("http://localhost"), {
	scheme: "http",
	host: "localhost"
});
assert.deepEqual(url.parse("https://user:pass@many.sub.domain.com/"), {
	scheme: "https",
	user: "user",
	pass: "pass",
	host: "many.sub.domain.com",
	path: "/",
});
assert.deepEqual(url.parse("//user:@/hi"), {
	user: "user",
	pass: "",
	path: "/hi",
});
assert.deepEqual(url.parse("::pass@/hi?v=1&v2=%20"), {
	scheme: "",
	user: "",
	pass: "pass",
	path: "/hi",
	query: "v=1&v2=%20",
	get: {v:"1", "v2":" "},
});
assert.deepEqual(url.parse("?a=1&b=2"), {
	query: "a=1&b=2",
	get: {a:"1", b:"2"},
});


console.log("Tests complete!");
