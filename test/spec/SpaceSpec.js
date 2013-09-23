var should = require('should');
var fs = require('fs');
var vm = require('vm');
var HTTP = require('../../assets/http.js').HTTP;
var Space = require('../../assets/space.js').Space;

describe('Space', function () {
	var space = undefined;
    before(function() {
    	vm.runInThisContext(fs.readFileSync('assets/http.js'));
        space = new Space('localhost', 'testspace', this);
    });

    describe('#getDate', function () {
        it('should give valid date string', function () {
        	space.getDate();
        });
    });
});
