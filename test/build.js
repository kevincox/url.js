if ( typeof require == "function" )
{
	var chai = require("chai");
	var url  = require("../url");
}
var expect = chai.expect;
chai.Assertion.includeStack = true;

describe('.build()', function()
{
	it("should build URLs", function() {
		expect(url.build({
			scheme:"https",
			host:"api.example.org",
			get: {
				format:"json",
				v:"4",
				request:[1,2,3,6,7],
				auth:":D"
			}
		})).to.equal(
			"https://api.example.org?format=json&v=4&request[0]=1&" +
			"request[1]=2&request[2]=3&request[3]=6&request[4]=7&auth=:D"
		);
	});
	it("should build emails", function() {
		expect(url.build({
			user: "kevincox",
			host: "mail.example.org",
		})).to.equal("kevincox@mail.example.org");
	});
	it("should build mailto links", function() {
		expect(url.build({
			scheme: "mailto",
			user: "kevincox",
			host: "mail.example.org",
		})).to.equal("mailto:kevincox@mail.example.org");
	});
	it("should build user/pass", function() {
		expect(url.build({
			scheme: "ftp",
			user: "kevincox",
			pass: "thepasswd",
			host: "1.2.3.4",
			port: 21,
			path: "/home/kevincox/coolfile",
		})).to.equal("ftp://kevincox:thepasswd@1.2.3.4:21/home/kevincox/coolfile");
	});
	it("should always return a string", function() {
		expect(url.build({}))
			.to.be.a("string")
			.to.equal("");
	});
	it("shouldn't use unessary question mark.", function() {
		expect(url.build({
			host: "example.com",
			path: "/script.php",
			query: "",
		}))
			.to.be.a("string")
			.to.equal("example.com/script.php");
		expect(url.build({
			host: "example.com",
			path: "/script.php",
			get: {},
		}))
			.to.be.a("string")
			.to.equal("example.com/script.php");
	});
	it("should end in question mark if told.", function() {
		expect(url.build({
			host: "example.com",
			path: "/script.php",
			query: "",
		}, {useemptyget:true}))
			.to.be.a("string")
			.to.equal("example.com/script.php?");
		expect(url.build({
			host: "example.com",
			path: "/script.php",
			get: {},
		}, {useemptyget:true}))
			.to.be.a("string")
			.to.equal("example.com/script.php?");
	});
});
