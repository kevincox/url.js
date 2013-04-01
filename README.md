# url.js

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
	"scheme": "file",
	"path": "/home/kevin/url.js/example.html"
}

// Parse ftp://my.host.com/a/file?ftp=query%3F#anchor
url.parse("ftp://my.host.com/a/file?ftp=query%3F#anchor");
{
	"scheme": "ftp",
	"host": "my.host.com",
    "port": 1337,
	"path": "/a/file",
	"query": "ftp=query%3F",
	"get": {
		"ftp": "query?" // Encoded values are properly handled.
	},
    "hash": "anchor"
}

// Parse email mailto:kevincox.ca@gmail.com
url.parse("mailto:kevincox.ca@gmail.com");
{
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
url.get("foo=bar&flag&a[0]=zero&a[2]=two&na[1][0]=nested&na[1][foo]=stillnested",{array:true});
{
	foo: 'bar',
	flag: true,
	a: [ 'zero', , 'two' ],
	na: [ , [ 'nested', foo: 'stillnested' ] ]
}
```
