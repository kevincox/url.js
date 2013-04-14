// Copyright 2013 Kevin Cox

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
*  3. This notice may not be removed or altered from any source distribution.  *                                                           *
*                                                                              *
*******************************************************************************/

"use strict";

///// Rename a couple of functions because closure doesn't want to do it for us.

/**
 * @private
 */
var self = {};

var array = /\[([^\[]*)\]$/;

/** Parse a query string.
 *
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
 * Later values will override earlier values.
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
 * 	url.get("array[1]=test&array[foo]=bar",{array:true}).array[1]  === "test"
 * 	url.get("array[1]=test&array[foo]=bar",{array:true}).array.foo === "bar"
 * 	url.get("array=notanarray&array[0]=1",{array:true}).array      === "notanarray"
 *
 * If array parsing is enabled keys in the form of `name[]` will automatically
 * be given the next available index.  Note that this can be overwritten with
 * later values in the query string.  For this reason is is best not to mix the
 * two formats, although it is safe (and often useful) to add an automatic index
 * argument to the end of a query string.
 *
 * 	url.get("a[]=0&a[]=1&a[0]=2", {array:true})  -> {a:["2","1"]};
 * 	url.get("a[0]=0&a[1]=1&a[]=2", {array:true}) -> {a:["0","1","2"]};
 *
 * @param{string} q The query string (the part after the '?').
 * @param{{full:boolean,array:boolean}=} opt Options.
 *
 *  - full:
 *    If set `q` will be treated as a full url and `q` will be built.
 *    by calling #parse to retrieve the query portion.
 *  - array:
 *    If set keys in the form of `key[i]` will be treated as arrays/maps.
 *
 * @return{!Object.<string, string|Array>} The parsed result.
 */
var get = self["get"] = function(q, opt)
{
	q = q || "";
	if ( typeof opt          == "undefined" ) opt = {};
	if ( typeof opt["full"]  == "undefined" ) opt["full"] = false;
	if ( typeof opt["array"] == "undefined" ) opt["array"] = false;

	if ( opt["full"] === true )
	{
		q = parse(q, {"get":false})["query"] || "";
	}

	var o = {};

	var c = q.split("&");
	for ( var i in c )
	{
		if (!c[i].length) continue;

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
					//console.log("url.get: Array property "+curk+" already exists as string!");
					return true;
				}

				curo = curo[curk];

				if ( i === "" ) i = curo.length;

				curk = i;
			})) continue;
			curo[curk] = v;
			continue;
		}

		k = decodeURIComponent(k);

		//typeof o[k] == "undefined" || console.log("Property "+k+" already exists!");
		o[k] = v;
	}

	return o;
};

///// Make sure our control characters get encoded.
var allchars = /./g;
var keyencode = {'?':"%3F", '&':"%26", '[':"%5B", ']':"%5D", '=': "%3D"};
var valencode = {'?':"%3F", '&':"%26"};
function translatekey(d){return keyencode[d[0]] || d[0]}
function translateval(d){return valencode[d[0]] || d[0]}
/** Encode a string so that it could safely be used as a key.
 *
 * @private
 * @param{string} k The string to encode.
 * @returns{string} The URL-encoded key.
 */
function encodeKey(k)
{
	return encodeURI(k).replace(allchars, translatekey);
}
/** Encode a string so that it could safely be used as a value.
 *
 * @private
 * @param{string} k The string to encode.
 * @returns{string} The URL-encoded value.
 */
function encodeValue(k)
{
	return encodeURI(k).replace(allchars, translateval);
}

/** Build a get query from an object.
 *
 * This constructs a query string from the kv pairs in `data`.  Calling #get
 * on the string returned should return an object identical to the one passed
 * in except all non-boolean scalar types become strings and all object types
 * become arrays (non-integer keys are still present, see #get's
 * documentation for more details).
 *
 * This always uses array syntax for describing arrays.  If you want to
 * serialize them differently (like having the value be a JSON array and have
 * a plain key) you will need to do that before passing it in.
 *
 * All keys and values are supported (binary data anyone?) as they are properly
 * URL-encoded and #get properly decodes.
 *
 * @param{Object} data The kv pairs.
 * @param{string} prefix The properly encoded array key to put the properties.  Mainly
 *   intended for internal use.
 * @return{string} A URL-safe string.
 */
var buildget = self["buildget"] = function(data, prefix)
{
	var itms = [];
	for ( var k in data )
	{
		var ek = encodeKey(k);
		if ( typeof prefix != "undefined" )
			ek = prefix+"["+ek+"]";

		var v = data[k];

		switch (typeof v)
		{
			case 'boolean':
				itms.push(ek);
				break;
			case 'number':
				v = v.toString();
			case 'string':
				itms.push(ek+"="+encodeValue(v));
				break;
			case 'object':
				itms.push(self["buildget"](v, ek));
				break;
		}
	}
	return itms.join("&");
}

var scheme = [
	/^([a-z]*:)?(\/\/)?/,
	/([a-z]*):/,
];
var user  = /^([^:@]*)(:[^@]*)?@/;
var pass  = /^:([^@]*)@/;
var host  = /^[0-9A-Za-z-._]+/;
var port  = /^:([0-9]*)/;
var path  = /^\/[^?#]*/;
var query = /^\?([^#]*)/;
var hash  = /^#(.*)$/;

/** Parse a URL
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
 *
 *  - **scheme:** The url scheme. (ex: "mailto" or "https")
 *  - **user:** The username.
 *  - **pass:** The password.
 *  - **host:** The hostname. (ex: "localhost", "123.456.7.8" or "example.com")
 *  - **port:** The port, as a number. (ex: 1337)
 *  - **path:** The path. (ex: "/" or "/about.html")
 *  - **query:** "The query string. (ex: "foo=bar&v=17&format=json")
 *  - **get:** The query string parsed with get.  If `opt.get` is `false` this will
 *    be undefined
 *  - **hash:** The value after the hash. (ex: "myanchor")
 * 	be undefined even if `query` is set.
 *
 * @param{string} url The URL to parse.
 * @param{{get:Object}=} opt Options:
 *
 *  - get: An options argument to be passed to #get or false to not call #get.
 *    **DO NOT** set `full`.
 *
 * @return{!Object} An object with the parsed values.
 */
var parse = self["parse"] = function(url, opt)
{
	var r = {}
	if ( typeof opt == "undefined" ) opt = {};

	r["url"] = url;

	do {
		var s0 = url.toLowerCase().match(scheme[0])
		if ( s0 === null ) break;
		if ( typeof s0[1] !== "undefined" )
		{
			var s1 = s0[1].match(scheme[1])
			r["scheme"] = s1[1];
		}
		url = url.slice(s0[0].length);
	} while (false);

	do {
		var u = url.match(user)
		if ( u === null ) break;
		r["user"] = decodeURIComponent(u[1]);

		url = url.slice(u[1].length);

		do {
			var p = url.match(pass)
			if ( p === null ) break;
			r["pass"] = decodeURIComponent(p[1]);

			url = url.slice(p[1].length+1); // +1 is for the ':'
		} while (false);

		url = url.slice(1); // Drop the '@'.
	} while (false);

	do {
		var h = url.match(host)
		if ( h === null ) break;
		r["host"] = h[0];

		url = url.slice(h[0].length);
	} while (false);

	do {
		var p = url.match(port)
		if ( p === null || p[1]==="" ) break;
		r["port"] = parseInt(p[1]);

		url = url.slice(p[0].length);
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
			r["get"] = get(r["query"], opt["get"]);

		url = url.slice(q[0].length);
	} while (false);

	do {
		var h = url.match(hash)
		if ( h === null ) break;
		r["hash"] = decodeURIComponent(h[1]);

		//url = url.slice(h[0].length);
	} while (false);

	return r;
}

var noslash = ["mailto","bitcoin"];

/** Build a URL from components.
 * This pieces together a url from the properties of the passed in object.  In
 * general passing the result of `parse()` should return the URL.  There may
 * differences in the get string as the keys and values might be more encoded
 * then they were originally were.  However, calling `get()` on the two values
 * should yield the same result.
 *
 * Here is how the parameters are used.
 *
 *  - url: Used only if no other values are provided.  If that is the case `url`
 *     will be returned verbatim.
 *  - scheme: Used if defined.
 *  - user: Used if defined.
 *  - pass: Used if defined.
 *  - host: Used if defined.
 *  - path: Used if defined.
 *  - query: Used only if `get` is not provided.
 *  - get: Used if defined.  Passed to #buildget and the result is used as the
 *    query string.
 *  - hash: Used if defined.
 *
 * @param{Object} data The pieces of the URL.
 * @return{string} The URL.
 */
var build = self["build"] = function(data)
{
	var r = "";

	if ( typeof data["scheme"] != "undefined" )
	{
		r += data["scheme"];
		r += (noslash.indexOf(data["scheme"])>=0)?":":"://";
	}
	if ( typeof data["user"] != "undefined" )
	{
		r += data["user"];
		if ( typeof data["pass"] == "undefined" )
		{
			r += "@";
		}
	}
	if ( typeof data["pass"] != "undefined" )
	{
		r += ":" + data["pass"] + "@";
	}
	if ( typeof data["host"] != "undefined" )
	{
		r += data["host"];
	}
	if ( typeof data["port"] != "undefined" )
	{
		r += ":" + data["port"];
	}
	if ( typeof data["path"] != "undefined" )
	{
		r += data["path"];
	}

	if ( typeof data["get"] != "undefined" )
	{
		r += "?" + buildget(data["get"]);
	}
	else if ( typeof data["query"] != "undefined" )
	{
		r += "?" + data["query"];
	}

	if ( typeof data["hash"] != "undefined" )
	{
		r += "#" + data["hash"];
	}

	return r || data["url"] || "";
};

if ( typeof define != "undefined" && define["amd"] ) define(self);
else if ( typeof module != "undefined" ) module['exports'] = self;
else window["url"] = self;
