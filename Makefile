TESTS = test/node/*.js
# TESTS = test/tests.js
#REPORTER = dot
REPORTER = spec

g = "converter"

build: components index.js
	@component build #--dev

components: component.json
	@component install #--dev


min: components salita.js #test
	@component build --use component-minify

clean:
	rm -fr build components # template.js

docs:
	marked Readme.md > Junk/Readme.html

.PHONY: test clean docs
