"use strict";

var self = {};

var array = /\[([^\[\]]+)\]$/

/// Parse a query string.
/**
 * This function parses a query string (sometimes called the search string).
 * It takes a query string and returns a map of the results.
 *
 * Keys are considered to be everything up to the first '=' and values are
 * everything afterwords.  Since URL-decoding is done after parsing, keys and
 * values can have any values, however, '=' have to be encoded in keys while '?'
 * and '&' have to be encoded anywhere (as they delimit the kv-pairs).
 *
 * Keys and values will always be strings, except if there is a key with no
 * '=' in which case it will be considered a flag and will be set to true.
 * Later values will override earlier values and a warning will be printed to
 * the console.
 *
 * Array keys are also supported.  By default keys in the form of `name[i]` will
 * be returned like that as strings.  However, if you set the `array` flag in
 * the options object they will be parsed into arrays.  Note that although the
 * object returned is an `Array` object all keys will be written to it.  This
 * means that if you have a key such as `k[forEach]` it will overwrite the
 * `forEach` function on that array.  Also note that string properties always
 * take precedence over array properties, irrespective of where they are in the
 * query string.
 *
 * ```js
 * url.get("array[1]=test&array[foo]=bar",{array:true}).array[1]  === "test"
 * url.get("array[1]=test&array[foo]=bar",{array:true}).array.foo === "bar"
 * url.get("array=notanarray&array[0]=1",{array:true}).array      === "notanarray"
 * ```
 *
 * @param{string} q The query string (the part after the '?').
 * @param{{full:boolean,array:boolean}=} opt Options.
 * 	- full:
 * 		If set `q` will be treated as a full url and `q` will be built.
 * 		from everything after the first '?'.  Consider using `parse` (that is
 * 		what we call under the hood anyway).
 * 	- array:
 * 		If set keys in the form of `key[i]` will be treated as arrays/maps.
 * @return{!Object.<string, string|Array>} The parsed result.
 */
self["get"] = function (q, opt) {
	q = q || "";
	if ( typeof opt          == "undefined" ) opt = {};
	if ( typeof opt["full"]  == "undefined" ) opt["full"] = false;
	if ( typeof opt["array"] == "undefined" ) opt["array"] = false;

	if ( opt["full"] === true )
	{
		q = self["parse"](q, {"get":false})["query"];
	}

	var o = {};

	var c = q.split("&");
	for ( var i in c )
	{
		var d = c[i].indexOf("=");
		var k = c[i], v = true;
		if ( d >= 0 )
		{
			k = c[i].substr(0, d);
			v = c[i].substr(d+1);

			v = decodeURIComponent(v);
		}

		if (opt["array"])
		{
			var inds = [];
			var ind;
			var curo = o;
			var curk = k;
			while (ind = curk.match(array)) // Array!
			{
				curk = curk.substr(0, ind.index);
				inds.unshift(decodeURIComponent(ind[1]));
			}
			curk = decodeURIComponent(curk);
			if (inds.some(function(i)
			{
				if ( typeof curo[curk] == "undefined" ) curo[curk] = [];
				if (!Array.isArray(curo[curk]))
				{
					console.log("url.get: Array property "+curk+" already exists as string!");
					return true;
				}

				curo = curo[curk];
				curk = i;
			})) continue;
			curo[curk] = v;
			continue;
		}

		k = decodeURIComponent(k);

		typeof o[k] == "undefined" || console.log("Property "+k+"already exists!");
		o[k] = v;
	}

	return o;
};

var scheme = [
	/^([a-z]*:)?(\/\/)?/,
	/([a-z]*):/,
];
var user  = /^([^:@]*)[:@]/;
var pass  = /^([^@]*)@/;
var host  = /^[A-Za-z-._]+/;
var path  = /^\/[^?]*/;
var query = /^\?(.*)/;

/// Parse a URL
/**
 * This breaks up a URL into components.  It attempts to be very liberal and
 * returns the best result in most cases.  This means that you can often pass
 * in part of a URL and get correct categories back.  Notably, this works for
 * emails and Jabber IDs, as well as adding a '?' to the beginning of a string
 * will parse the whole thing as a query string.  If an item is not found the
 * property will be undefined.  In some cases an empty string will be returned
 * if the surrounding syntax but the actual value is empty (example:
 * "://example.com" will give a empty string for scheme.)  Notably the host name
 * will always be set to something.
 *
 * Returned properties.
 *  - scheme: The url scheme. (ex: "mailto" or "https")
 *  - user: The username.
 *  - pass: The password.
 *  - host: The hostname. (ex: "localhost", "123.456.7.8" or "example.com")
 *  - path: The path. (ex: "/" or "/about.html")
 *  - query: "The query string. (ex: "foo=bar&v=17&format=json")
 *  - get: The query string parsed with get.  If `opt.get` is `false` this will
 * 	be undefined even if `query` is set.
 *
 * @param{string} url The URL to parse.
 * @param{{get:Object|boolean}=} opt Options:
 * 	- get: An options argument to be passed to `get()` or false to not call
 * 		`get()`.  DO NOT set `full`.
 * @return{{
 * 	scheme: string,
 * 	user: string,
 * 	pass: string,
 * 	host: string,
 * 	path: string,
 * 	query: string,
 * 	get: Object
 * }}
 */
self["parse"] = function(url, opt)
{
	var r = {}
	if ( typeof opt == "undefined" ) opt = {};

	do {
		var s0 = url.toLowerCase().match(scheme[0])
		if ( s0 === null ) break;
		if ( typeof s0[1] !== "undefined" )
		{
			var s1 = s0[1].match(scheme[1])
			r["scheme"] = decodeURIComponent(s1[1]);
		}
		url = url.slice(s0[0].length);
	} while (false);

	do {
		var u = url.match(user)
		if ( u === null ) break;
		r["user"] = decodeURIComponent(u[1]);

		url = url.slice(u[0].length);

		var p = url.match(pass)
		if ( p === null ) break;
		r["pass"] = decodeURIComponent(p[1]);

		url = url.slice(p[0].length);
	} while (false);

	do {
		var h = url.match(host)
		if ( h === null ) break;
		r["host"] = h[0];

		url = url.slice(h[0].length);
	} while (false);

	do {
		var p = url.match(path)
		if ( p === null ) break;
		r["path"] = decodeURIComponent(p[0]);

		url = url.slice(p[0].length);
	} while (false);

	do {
		var q = url.match(query)
		if ( q === null ) break;
		r["query"] = q[1];
		if ( opt["get"] !== false )
			r["get"] = self["get"](r["query"], opt["get"]);

		url = url.slice(q[0].length);
	} while (false);

	return r;
}

if ( typeof define != "undefined" && define["amd"] ) define([], self);
else if ( typeof module != "undefined" ) module["exports"] = self;
else window["url"] = self;
