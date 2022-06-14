


test('configuration loads', () => {
	expect(() => {
		let options = require('./index.js')(require("./test.json"));
	}).not.toThrow()
})

test('configuration has options', () => {
	let options = require('./index.js')(require("./test.json"));
	expect(options.testnumber).toBe(8080);
	expect(options.teststring).toBe("default1")
})