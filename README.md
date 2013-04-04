# url.js


[![Build Status](https://travis-ci.org/kevincox/url.js.png?branch=master)](https://travis-ci.org/kevincox/url.js)

A high level URL parser in javascript.

## Loading

URL.js works as an AMD module (ex: requirejs), a node module or will make itself
global under the name `url`.

## Documentation
There is very clear documentation in the source.  Feel free to
[email me](kevincox.ca@gmail.com) if you have any questions.

## Building
The script will work as is, but exports a few variables.  The build script
optimizes and wraps it in a closure.  Ensure that you wrap it in a closure if
you are going to concatenate it with other scripts as it uses strict mode.

You can use any compressor/optimizer with this script.  It works with closure
ADVANCED_OPTIMIZATIONS.

## Examples

Check out example.html for a number, but here are the basics.  The objects
after the function calls are the return values.

```js
// Parse Document URL
url.parse(document.location.href);
{
    "url": "file:///home/kevin/url.js/example.html",
    "scheme": "file",
    "path": "/home/kevin/url.js/example.html"
}

// Parse ftp://my.host.com/a/file?ftp=query%3F#anchor
url.parse("ftp://my.host.com/a/file?ftp=query%3F#anchor");
{
    "url": "ftp://my.host.com:1337/a/file?ftp=query%3F#anchor",
    "scheme": "ftp",
    "host": "my.host.com",
    "port": 1337,
    "path": "/a/file",
    "query": "ftp=query%3F",
    "get": {
        "ftp": "query?"
    },
    "hash": "anchor"
}

// Parse email mailto:kevincox.ca@gmail.com
url.parse("mailto:kevincox.ca@gmail.com");
{
    "url": "mailto:kevincox.ca@gmail.com",
    "scheme": "mailto",
    "user": "kevincox.ca",
    "host": "gmail.com"
}

// Parse query string:
url.get("foo=bar&flag&a[0]=zero&a[2]=two&na[1][0]=nested&na[1][foo]=stillnested");
{
	"foo": "bar",
	"flag": true,
	"a[0]": "zero",
	"a[2]": "two",
	"na[1][0]": "nested",
	"na[1][foo]": "stillnested"
}
// Same string with array enabled.
url.get(
	"foo=bar&flag&a[0]=zero&a[2]=two&na[1][0]=nested&na[1][foo]=stillnested",
	{array:true}
);
{
	foo: 'bar',
	flag: true,
	a: [ 'zero', , 'two' ],
	na: [
		, // Node prints an undefined for the missing index.
		[ 'nested', foo: 'stillnested' ]
	]
}


// A clean example without missing values.
url.get("val[0]=zero&val[1]=one&val[2]&val[3]=&val[4]=four&val[5][0]=n1&" +
        "val[5][1]=n2&val[5][2]=n3", {array:true});
{
	val: [
		'zero',
		'one',
		true,
		'',
		'four',
		[ 'n1', 'n2', 'n3' ]
	]
}

// Building URLs
url.build({scheme:"ssh",user:"kevin",host:"example.org"});
'ssh://kevin@example.org'

// Complex query strings are a snap.
url.build({
	scheme:"https",
	host:"api.example.org",
	get: {
		format:"json",
		v:"4",
		request:[1,2,3,6,7],
		auth:":D"
	}
});
'https://api.example.org?format=json&v=4&request[0]=1&request[1]=2&' +
'request[2]=3&request[3]=6&request[4]=7&auth=:D'

// Nested arrays and ugly values!
var param = url.buildget({
	"!![2][5]": "**",
	"data": [
		"push",
		{
			client:182,
			type:"mesage",
			data: {id:1827,subject:"Who are you?"},
		},
		"update",
		{
			client: 39284,
			type: "request",
			data: {
				critical:true,
				hash: "24-0/4/42342:{?$@{@?$",
			}
		}
	],
});
'!!%5B2%5D%5B5%5D=**&data[0]=push&data[1][client]=182&data[1][type]=mesage&' +
'data[1][data][id]=1827&data[1][data][subject]=Who%20are%20you%3F&data[2]=u' +
'pdate&data[3][client]=39284&data[3][type]=request&data[3][data][critical]&' +
'data[3][data][hash]=24-0/4/42342:%7B%3F$@%7B@%3F$'
// I sincerely hope that you never have a request that looks like that.

// And you can parse it back out.
url.get(param);
{
	'!![2][5]': '**',
	'data[0]': 'push',
	'data[1][client]': '182',
	'data[1][type]': 'mesage',
	'data[1][data][id]': '1827',
	'data[1][data][subject]': 'Who are you?',
	'data[2]': 'update',
	'data[3][client]': '39284',
	'data[3][type]': 'request',
	'data[3][data][critical]': true,
	'data[3][data][hash]': '24-0/4/42342:{?$@{@?$'
}
// And if you use `{array:true}` you should get the same thing back.
url.get(param,{array:true});
{
	'!![2][5]': '**',
	data: [
		'push',
		[
			client: '182',
			type: 'mesage',
			data: [ id: '1827', subject: 'Who are you?' ]
		],
		'update',
		[
			client: '39284',
			type: 'request',
			data: [ critical: true, hash: '24-0/4/42342:{?$@{@?$' ]
		],
	]
}
// This the is output of node's `console.log()` notice that the maps in `data` are
// technically arrays.  Also notice that even though "!![2][5]" is in an array
// format it was encoded and decoded properly so it was kept as a string key.
```

If you want more examples, look at our tests in the `test/` directory.  Or you
can view the live test of our master branch at
http://kevincox.github.com/url.js/test.html.
