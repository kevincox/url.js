if ( typeof require == "function" )
{
	var chai = require("chai");
	var url    = require("../url");
}
var expect = chai.expect;
chai.Assertion.includeStack = true;

describe('.buildget()', function()
{
	it("should get back to itself", function() {
		var td = {user:["hi","joe"],"r&[":{te:"5", "t[vd]":["foo"]}};
		var r = url.get(url.buildget(td),{array:true});
		expect(r.user).to.eql(td.user);
		expect(r["r&["].te).to.equal(r["r&["].te);
		expect(r["r&["]["t[vd]"]).to.eql(r["r&["]["t[vd]"]);
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
		})).to.deep.equal(
			"!!%5B2%5D%5B5%5D=**&data[0]=push&data[1][client]=182&" +
			"data[1][type]=mesage&data[1][data][id]=1827&" +
			"data[1][data][subject]=Who%20are%20you%3F&data[2]=update&" +
			"data[3][client]=39284&data[3][type]=request&" +
			"data[3][data][critical]&" +
			"data[3][data][hash]=24-0/4/42342:%7B%3F$@%7B@%3F$"
		);
	});

	it("should handle ugly values", function() {
		expect(url.buildget({
			"?&==& ![][][][]": [
				"%$%^&*{[",
				" !/:",
			],
			"[22": {
				"[24[}|": true,
			},
			"{}[]2|=#@: ": "2r2[}EF~@",
		})).to.eql(
			"%3F%26%3D%3D%26%20!%5B%5D%5B%5D%5B%5D%5B%5D[0]=%25$%25%5E%26*%7B" +
			"%5B&%3F%26%3D%3D%26%20!%5B%5D%5B%5D%5B%5D%5B%5D[1]=%20!/:&%5B22" +
			"[%5B24%5B%7D%7C]&%7B%7D%5B%5D2%7C%3D#@:%20=2r2%5B%7DEF~@"
		);
	});
});
