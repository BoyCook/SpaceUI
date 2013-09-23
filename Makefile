
TESTS = test/spec
REPORTER = spec
COVERAGE_REPORT = ./coverage/lcov.info
COVERALLS = ./node_modules/coveralls/bin/coveralls.js
ASSETS := $(wildcard assets/*)

test: test-mocha

test-mocha:
	@NODE_ENV=test mocha \
	    --timeout 200 \
		--reporter $(REPORTER) \
		$(TESTS)

test-cov: istanbul

istanbul:
	istanbul cover _mocha -- -R spec $(TESTS)

coveralls:
	cat $(COVERAGE_REPORT) | $(COVERALLS)

cov-html: test-cov html-cov-report

html-cov-report: 
	istanbul report html	

push:
	@for asset in $(ASSETS); do tsapp push_hard spaceui `echo $$asset | cut -d '/' -f 2` ; done

npm:
	npm publish ./

auth:
	echo "auth_token:$(tiddlyspace_username):$(tiddlyspace_password)" >> .tsapp

check:
	travis-lint .travis.yml

clean:
	rm -rf ./coverage
