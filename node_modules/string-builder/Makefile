
TESTS = test/*.js
REPORTER = dot

spec: test-spec

test: test-timings

test-timings:
	node test/timings.js

test-spec:
	jasmine-node test/spec --junitreport --forceexit

ui-test:
	casperjs test test/ui

test-mocha:
	@NODE_ENV=test mocha \
	    --require should \
	    --timeout 200 \
		--reporter $(REPORTER) \
		$(TESTS)

test-cov: lib-cov
	@RPSLP_COV=1 $(MAKE) test

lib-cov:
	jscoverage lib lib-cov

clean:
	rm -f reports/*
	rm -fr lib-cov
