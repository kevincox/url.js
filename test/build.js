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
});
