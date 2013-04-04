if ( typeof require == "function" )
{
	var expect = require("expect.js");
	var url    = require("../url");
}

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
		})).to.be("https://api.example.org?format=json&v=4&request[0]=1&request[1]=2&request[2]=3&request[3]=6&request[4]=7&auth=:D");
	});
});
