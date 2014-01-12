require(["url.min"], function (url)
{
	"use strict";
	
	function p(s){document.getElementById("out").innerHTML += s+"\n"}
	function pp(d){p(JSON.stringify(d, undefined, 4), undefined, 4)}
	
	p("Parse Document URL:");
	pp(url.parse(document.location.href));
	p("Parse ftp://my.host.com:1337/a/file?ftp=query%3F#anchor");
	pp(url.parse("ftp://my.host.com:1337/a/file?ftp=query%3F#anchor"));
	
	p("Parse email mailto:kevincox.ca@gmail.com");
	pp(url.parse("mailto:kevincox.ca@gmail.com"));
	
	p("Parse query string ?foo=bar&flag&a[0]=zero&a[2]=two&na[1][0]=nested&na[1][foo]=stillnested");
	pp(url.get("foo=bar&flag&a[0]=zero&a[2]=two&na[1][0]=nested&na[1][foo]=stillnested"));
	p("Same string with array parsing enabled.");
	var arrayparse = url.get("foo=bar&flag&a[0]=zero&a[2]=two&na[1][0]=nested&na[1][foo]=stillnested",{array:true});
	pp(arrayparse);
	p("It doesn't print it out but we didn't loose na[1][foo].");
	p("Let me print it out for you.");
	p("result.na[1]['foo'] == "+arrayparse["na"][1]['foo']);
	
	p("\nYou may notice that some of the properties have been renamed, however");
	p("that isn't an issue because closure renames your accesses to them too");
	p("let me prove it.  I will use this url: http://my:passwd@host.co/pa/th?pa=rm&flag#elid");
	var val = url.parse("http://my:passwd@host.co:2/pa/th?pa=rm&flag#elid");
	pp(val)
	p("url:    "+val.url);
	p("scheme: "+val.scheme);
	p("user:   "+val.user);
	p("pass:   "+val.pass);
	p("host:   "+val.host);
	p("port:   "+val.port);
	p("path:   "+val.path);
	p("query:  "+val.query);
	p("get:    "+JSON.stringify(val.get));
	p("hash:   "+val.hash);
	p("Isn't closure cool :D");
});
