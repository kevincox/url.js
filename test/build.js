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
});
