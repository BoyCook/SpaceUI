var should = require('should');
var Filter = require('../assets/filter.js').Filter;

describe('Filter', function () {
    var stringData = undefined;
    var objectData = undefined;
    before(function() {
        stringData =  ['e', 'b', 'd', 'c', 'a'];
        objectData = [ 
            { key: 'e' },
            { key: 'a' },
            { key: 'd' },
            { key: 'c' },
            { key: 'b' }
        ];
    });
    describe('#filterString', function () {
        it('should filter ok ', function () {
            var filtered = new Filter(stringData, true).filterString('', 'c');
            filtered.should.have.length(1);
            filtered[0].should.eql('c');
        });
    });
    describe('#filterObject', function () {
        it('should filter ok ', function () {
            var filtered = new Filter(objectData, false).filterObject('key', 'c');
            filtered.should.have.length(1);
            filtered[0].should.eql({ key: 'c' });
        });
    });
    describe('#filter', function () {
        it('should filter string ok ', function () {
            var filtered = new Filter(stringData, true).filter('', 'c');
            filtered.should.have.length(1);
            filtered[0].should.eql('c');
        });
        it('should filter object ok ', function () {
            var filtered = new Filter(objectData).filter('key', 'c');
            filtered.should.have.length(1);
            filtered[0].should.eql({ key: 'c' });
        });
    });
});
