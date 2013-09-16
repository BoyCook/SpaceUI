
TESTS = test/spec
REPORTER = spec
XML_FILE = reports/TEST-all.xml
HTML_FILE = reports/coverage.html
COVERALLS = ./node_modules/coveralls/bin/coveralls.js

test: test-mocha

test-ci:
	$(MAKE) test-mocha REPORTER=xUnit > $(XML_FILE)

test-all: clean test-ci test-cov

test-ui: start
	casperjs test test/ui

test-mocha:
	@NODE_ENV=test mocha \
	    --timeout 200 \
		--reporter $(REPORTER) \
		$(TESTS)

test-blanket:
	@NODE_ENV=test SUI_COV=1 \ mocha \
		--require blanket \
		--reporter mocha-lcov-reporter | $(COVERALLS) \
		$(TESTS)

test-cov: lib-cov
	@SUI_COV=1 $(MAKE) test-mocha REPORTER=html-cov > $(HTML_FILE)

lib-cov:
	jscoverage lib lib-cov

npm:
	npm publish ./

clean:
	rm -f reports/*
	rm -fr lib-cov
