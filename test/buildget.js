// Copyright 2013-2014 Kevin Cox

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
*  3. This notice may not be removed or altered from any source distribution.  *
*                                                                              *
*******************************************************************************/

if ( typeof require == "function" )
{
	var chai = require("chai");
	var url    = require("../url");
}
var expect = chai.expect;
chai.config.includeStack = true;

describe('.buildget()', function()
{
	it("should encode booleans as flags", function() {
		expect(url.buildget({t: true, f: false})).to.eql("t");
	});
	
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
			"data[3][data][hash]=24-0%2F4%2F42342%3A%7B%3F%24%40%7B%40%3F%24"
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
			"%3F%26%3D%3D%26%20!%5B%5D%5B%5D%5B%5D%5B%5D[0]=%25%24%25%5E%26*%7B" +
			"%5B&%3F%26%3D%3D%26%20!%5B%5D%5B%5D%5B%5D%5B%5D[1]=%20!%2F%3A&%5B2" +
			"2[%5B24%5B%7D%7C]&%7B%7D%5B%5D2%7C%3D%23%40%3A%20=2r2%5B%7DEF~%40"
		);
	});
});
