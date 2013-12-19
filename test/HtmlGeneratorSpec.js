var should = require('should');
var fs = require('fs');
var vm = require('vm');
var HTMLGenerator = require('../assets/htmlgenerator.js').HTMLGenerator;

describe('HTMLGenerator', function () {
	var html = undefined;
    before(function() {
    	// vm.runInThisContext(fs.readFileSync('assets/underscore-min.js'));
    	// vm.runInThisContext(fs.readFileSync('assets/handlebars.js'));
        // html = new HTMLGenerator('testspace');
        //TODO - inject in templates
    });

    describe('#HTMLGenerator', function () {
        it('should work', function () {

        });
    });
});
