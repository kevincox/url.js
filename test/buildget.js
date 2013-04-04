if ( typeof require == "function" )
{
	var expect = require("expect.js");
	var url    = require("../url");
}

describe('.buildget()', function()
{
	it("port should be a number", function()
	{
		var td = {user:["hi","joe"],"r&[":{te:5, "t[vd]":["foo"]}};
		expect(url.get(url.buildget(td),{array:true})).to.eql(td);
	});
});
