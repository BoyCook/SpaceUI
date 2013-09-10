var should = require('should');
var fs = require('fs');
var vm = require('vm');

describe('Filter', function () {
    var data = undefined;
    before(function() {
        vm.runInThisContext(fs.readFileSync('assets/filter.js'));
        data =  ['e', 'b', 'd', 'c', 'a'];
    });

    describe('#filterString', function () {
        it('should filter ok ', function () {
            var filter = new Filter(data, true);
        });
    });

    describe('#filterObject', function () {
        it('should filter ok ', function () {

        });
    });

    describe('#filter', function () {
        it('should filter ok ', function () {

        });
    });
});
