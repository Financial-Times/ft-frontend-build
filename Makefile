.PHONY: test

testSetup: 
	node test/test_setup.js

test: 
	@./node_modules/.bin/jasmine-node test
