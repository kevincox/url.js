if ( typeof require == "function" )
{
	var expect = require("expect.js");
	var url    = require("../url");
}

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

	it("should keep the rightmost value", function() {
		expect(url.get("test=5&test=6&foo=bar&test=7")).to.eql({test:"7",foo:"bar"});
	});

	it("should grab the query string", function() {
		expect(url.get("example.com/?a=5&b&c=5",{full:true})).to.eql({a:5,b:true,c:5});
	});

	it("should parse into arrays", function() {
		var opt = {array:true};
		expect(url.get("a[0]=5&a[1]=6", opt)).to.eql({a:[5,6]});
		expect(url.get("a[0]=5&a[hello]=6", opt)).to.eql({a:{0:5,"hello":6}});
		expect(url.get("a[0][0]=1", opt)).to.eql({a:[[1]]});
		expect(url.get("a[0][0]=1&a[0][1]=3&a[1][0]=4", opt)).to.eql({a:[["1","3"],["4"]]});
	});

	it("should handle gaps in  arrays", function() {
		expect(url.get("array[1]=test", {array:true}).array[1]).to.be("test");
	});

	it("should give presedance to scalars", function() {
		expect(url.get("a=7&a[0][0]=1", {array:true})).to.eql({a:"7"});
		expect(url.get("a[0][0]=1&a=7", {array:true})).to.eql({a:"7"});
	});

	it("should handle URL encoding", function() {
		expect(url.get("%5B%5D%3D%3F%26=%5B%5D%3D%3F%26")).to.eql({"[]=?&":"[]=?&"});
		expect(url.get("%5B%5D%3D%3F%26[%5B%5D%3D%3F%26]=%5B%5D%3D%3F%26",{array:true})).to.eql({"[]=?&":{"[]=?&":"[]=?&"}});
	});
	
	it("should automaically assign indicies", function() {
		expect(url.get("a[]=0&a[]=1&a[]=2", {array:true})).to.eql({a:["0","1","2"]});
	});
});
