var should = require('should');
var Object = require('../../index.js');

describe('ObjectUtils', function () {

    describe('#isDefined', function () {
        it('should think defined is defined', function () {
            Object.isDefined({}).should.be.true;
        });

        it('should not think undefined is defined', function () {
            Object.isDefined(undefined).should.be.false;
        });
    });

    describe('#isUndefined', function () {
        it('should think undefined is undefined', function () {
            Object.isUndefined(undefined).should.be.true;
        });

        it('should think empty is undefined', function () {
            Object.isUndefined().should.be.true;
        });

        it('should think not object is undefined', function () {
            Object.isUndefined({}).should.be.false;
        });
    });


    describe('#isEmpty', function () {
        it('should think no value is empty', function () {
            Object.isEmpty().should.be.true;
        });

        it('should think empty array is empty', function () {
            Object.isEmpty([]).should.be.true;
        });

        it('should think empty string is empty', function () {
            Object.isEmpty('').should.be.true;
        });

        it('should not think array with item is empty', function () {
            Object.isEmpty([1]).should.be.false;
        });

        it('should not think string is empty', function () {
            Object.isEmpty('value').should.be.false;
        });
    });

    describe('#isNotEmpty', function () {
        it('should thinkg value is not empty', function () {
            Object.isNotEmpty('value').should.be.true;
        });

        it('should think array with value is not empty', function () {
            Object.isNotEmpty([1]).should.be.true;
        });

        it('should not think empty string is not empty', function () {
            Object.isNotEmpty('').should.be.false;
        });

        it('should not think empty array is not empty', function () {
            Object.isNotEmpty([]).should.be.false;
        });
    });

    describe('#isObject', function () {
        it('should think object is an object', function () {
            Object.isObject({}).should.be.true;
        });

        it('should not think string is an object', function () {
            Object.isObject('').should.be.false;
        });

        it('should not think int is an object', function () {
            Object.isObject(1).should.be.false;
        });
    });

    describe('#isNotObject', function () {
        it('should not think object is not an object', function () {
            Object.isNotObject({}).should.be.false;
        });

        it('should think string is not an object', function () {
            Object.isNotObject('').should.be.true;
        });

        it('should think int is not an object', function () {
            Object.isNotObject(1).should.be.true;
        });
    });
});
