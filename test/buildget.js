if ( typeof require == "function" )
{
	var expect = require("expect.js");
	var url    = require("../url");
}

describe('.buildget()', function()
{
	it("port should be a number", function() {
		var td = {user:["hi","joe"],"r&[":{te:5, "t[vd]":["foo"]}};
		expect(url.get(url.buildget(td),{array:true})).to.eql(td);
	});

	it("should build ugly URLs with ease", function() {
		expect(url.buildget({
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
		})).to.be('!!%5B2%5D%5B5%5D=**&data[0]=push&data[1][client]=182&' +
		          'data[1][type]=mesage&data[1][data][id]=1827&' +
		          'data[1][data][subject]=Who%20are%20you%3F&data[2]=update&' +
		          'data[3][client]=39284&data[3][type]=request&' +
		          'data[3][data][critical]&' +
		          'data[3][data][hash]=24-0/4/42342:%7B%3F$@%7B@%3F$');
	});
});
