# url.js

[![Build Status](https://travis-ci.org/kevincox/url.js.png?branch=master)](https://travis-ci.org/kevincox/url.js)

[![Browser Support](https://ci.testling.com/kevincox/url.js.png)](https://ci.testling.com/kevincox/url.js)

A high level URL parser in javascript.  Lightning fast and less than 1K minified
and gzipped.

## Loading

URL.js works as an AMD module (ex: requirejs), a node module or will make itself
global under the name `url`.

### Node, via npm
```bash
$ npm install url.js # The version in the npm registry, likely a bit old.
$ npm install git://github.com/kevincox/url.js.git # Get the latest and greatest.
$ node
> var url = require("url.js");
```
### Node, via the source.
```javascript
// You need the "./" or it will load the built in URL module.
var url = require("./url");
```

### AMD Loaders
```javascript
require(["url"], function(url){});
```

### Good ol' Script Tag
```html
<script src="url.js"></script>
```

## Hosted

You can use a hosted version of URL.js.  These files are all on fast CDNs and
it is recommended that you use them unless you are going to combine it into your
scripts.  The https version is recommended but http is available as well.

- [URL.js 1.0.2](https://kevincox-cdn.appspot.com/url-1.0.2.min.js)
- [URL.js 1.0.3](https://kevincox-cdn.appspot.com/url-1.0.3.min.js)

## Documentation
There is very clear documentation comments in the source.  These can be built
into HTML using [jsduck](https://github.com/senchalabs/jsduck) Feel free to
[email me](mailto:kevincox@kevincox.ca) if you have any questions.

## Building

You can use any compressor/optimizer with this script.  It works with closure
`ADVANCED_OPTIMIZATIONS`.  You can run the `min.sh` script in the main directory
to minify it into `url.min.js`.  If you are using closure in your project and
want the maximum benefit call `./min.sh noexport` and it will output a copy of
the source where the property names are not quoted.  You can then compile that
file into your source with `ADVANCED_OPTIMIZATIONS`.  See `example-closure.*`
in the source for an example.

## Testing

Test are always run before pushing to master and merges are only accepted if
they pass the tests as well.  To run the test you need `mocha` and `chai`.
Simply run `mocha` or `npm test` to run the test suite.  Nothing needs to be
generated.

To run the tests in a browser run `./genhtmltests.js` and open `test.html`,
`test.min.html` to test the test suite on the source and minified versions
respectively.  The tests only need to be regenerated if a new file is created,
they directly load the source and test scripts.

`./genhtmltests.js` also creates `test.web.html` which runs tests on the master
branch of the github repo.  It requires `mocha.js` and `mocha.css` in it's
directory to work, all the other dependencies are pulled from the web.  You can
find a hosted version of these tests at http://kevincox.github.com/url.js/test.html.
**Note, this page does NOT test the local versions of the files!**  If you are
developing you want one of the other three options.

## Examples

Here are a number of examples of usage.  They are probably all you need but
there is complete documentation in the source.

```js
// This the is output of node's `console.log()` notice that the maps in `data` are
// technically arrays.  Also notice that even though "!![2][5]" is in an array
// format it was encoded and decoded properly so it was kept as a string key.
// Parse Document URL

url.parse(document.location.href);
{
    "url": "file:///home/kevin/url.js/example.html",
    "scheme": "file",
    "path": "/home/kevin/url.js/example.html"
}

// Parse ftp://my.host.com:1337/a/file?ftp=query%3F#anchor
url.parse("ftp://my.host.com:1337/a/file?ftp=query%3F#anchor");
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
```

If you want more examples, look at our tests in the `test/` directory.  Or you
can run/view the live test of our master branch at
http://kevincox.github.com/url.js/test.html.
