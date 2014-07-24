.PHONY: test

npmSetupForTest: 
	node test/npm_setup.js	

test: 
	node test/test_setup.js
	@./node_modules/.bin/jasmine-node test --verbose

testWithFullSetup: npmSetupForTest test