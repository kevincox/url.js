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
	var url  = require("../url");
}
var expect = chai.expect;
chai.config.includeStack = true;

describe('.get()', function()
{
	it("should have string values", function() {
		expect(url.get("test=5")).to.have.property("test",  "5")
		expect(url.get("test=05")).to.have.property("test", "05");
		expect(url.get("test=true")).to.have.property("test", "true");
	});
	
	it("should parse query strings", function() {
		expect(url.get("test=5")).to.eql({test:"5"});
		expect(url.get("a=5&b=c=5")).to.eql({a:"5",b:"c=5"});
	});
	
	it("should parse query strings", function() {
		expect(url.get("foo=bar&flag&a[0]=zero&a[2]=two&na[1][0]=nested&na[1][foo]=stillnested"))
			.to.eql({
				"foo": "bar",
				"flag": true,
				"a[0]": "zero",
				"a[2]": "two",
				"na[1][0]": "nested",
				"na[1][foo]": "stillnested"
			});
	});
	it("should parse query strings with array", function() {
		var r = url.get("foo=bar&flag&a[0]=zero&a[2]=two&na[1][0]=nested&na[1][foo]=stillnested", {array:true});
		expect(r.foo).to.equal('bar');
		expect(r.flag).to.equal(true);
		expect(r.a[0]).to.equal('zero');
		expect(r.a['0']).to.equal('zero');
		expect(r.a[2]).to.equal('two');
		expect(r.na[1][0]).to.equal('nested');
		expect(r.na[1].foo).to.equal('stillnested');
	});
	it("should parse clean query strings with array", function() {
		expect(url.get("val[0]=zero&val[1]=one&val[2]&val[3]=&val[4]=four&val[5][0]=n1&val[5][1]=n2&val[5][2]=n3", {array:true}))
			.to.eql({
				val: [
					'zero',
					'one',
					true,
					'',
					'four',
					[ 'n1', 'n2', 'n3' ]
				]
			});
	});
	
	it("should keep the rightmost value", function() {
		expect(url.get("test=5&test=6&foo=bar&test=7")).to.eql({test:"7",foo:"bar"});
	});
	
	it("should grab the query string", function() {
		expect(url.get("example.com/?a=5&b&c=5",{full:true})).to.eql({a:"5",b:true,c:"5"});
	});
	
	it("should parse into arrays", function() {
		var opt = {array:true}, r;
		expect(url.get("a[0]=5&a[1]=6", opt)).to.eql({a:["5","6"]});
		expect(url.get("a[0][0]=1", opt)).to.eql({a:[["1"]]});
		expect(url.get("a[0][0]=1&a[0][1]=3&a[1][0]=4", opt)).to.eql({a:[["1","3"],["4"]]});
		r = url.get("a[0]=5&a[hello]=6", opt);
		expect(r.a[0]).to.equal("5");
		expect(r.a["hello"]).to.equal("6");
	});
	
	it("should handle gaps in  arrays", function() {
		expect(url.get("array[1]=test", {array:true}).array[1]).to.equal("test");
	});
	
	it("should give presedance to scalars", function() {
		expect(url.get("a=7&a[0][0]=1", {array:true})).to.eql({a:"7"});
		expect(url.get("a[0][0]=1&a=7", {array:true})).to.eql({a:"7"});
	});
	
	it("should handle URL encoding", function() {
		expect(url.get("%5B%5D%3D%3F%26=%5B%5D%3D%3F%26")).to.eql({"[]=?&":"[]=?&"});
		var r = url.get("%5B%5D%3D%3F%26[%5B%5D%3D%3F%26]=%5B%5D%3D%3F%26",{array:true})
		expect(r["[]=?&"]["[]=?&"]).to.equal("[]=?&");
	});
	
	it("should automatically assign indices", function() {
		expect(url.get("a[]=0&a[]=1&a[]=2", {array:true})).to.eql({a:["0","1","2"]});
	});
	
	it("should overwrite automatic indices", function() {
		expect(url.get("a[]=0&a[]=1&a[0]=2", {array:true})).to.eql({a:["2","1"]});
	});
	
	it("automatic indices can be safely appended", function() {
		expect(url.get("a[0]=0&a[1]=1&a[]=2", {array:true})).to.eql({a:["0","1","2"]});
	});
	
	it("should parse crazy URLs", function() {
		var query = '!!%5B2%5D%5B5%5D=**&data[0]=push&data[1][client]=182&' +
		            'data[1][type]=message&data[1][data][id]=1827&' +
		            'data[1][data][subject]=Who%20are%20you%3F&' +
		            'data[2]=update&data[3][client]=39284&' +
		            'data[3][type]=request&data[3][data][critical]&' +
		            'data[3][data][hash]=24-0/4/42342:%7B%3F$@%7B@%3F$';
		
		expect(url.get(query)).to.eql({
			'!![2][5]': '**',
			'data[0]': 'push',
			'data[1][client]': '182',
			'data[1][type]': 'message',
			'data[1][data][id]': '1827',
			'data[1][data][subject]': 'Who are you?',
			'data[2]': 'update',
			'data[3][client]': '39284',
			'data[3][type]': 'request',
			'data[3][data][critical]': true,
			'data[3][data][hash]': '24-0/4/42342:{?$@{@?$'
		});
		var r = url.get(query, {array:true});
		expect(r['!![2][5]']).to.equal('**');
		expect(r.data[0]).to.equal('push');
		expect(r.data[1].client).to.equal('182');
		expect(r.data[1].type).to.equal('message');
		expect(r.data[1].data.id).to.equal('1827');
		expect(r.data[1].data.subject).to.equal('Who are you?');
		expect(r.data[2]).to.equal('update');
		expect(r.data[3].client).to.equal('39284');
		expect(r.data[3].type).to.equal('request');
		expect(r.data[3].data.critical).to.equal(true);
		expect(r.data[3].data.hash).to.equal('24-0/4/42342:{?$@{@?$');
	});
	
	it("should always return an object", function() {
		expect(url.get()).to.eql({});
		expect(url.get("exmaple.com/foo", {full:true})).to.eql({});
	});
});
