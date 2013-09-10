var StringBuilder = require('./../lib/stringbuilder').StringBuilder;

function testForString() {
    var start = Date.now();
    var builder = new StringBuilder();

    var count = 10000000;
    for (var i = 0; i < count; i++) {
        builder.append('text' + i);
    }
    builder.toString();

    var end = Date.now();
    console.log('Time taken: [%s] ms', end - start);
}

function testForArray() {
    var start = Date.now();
    var builder = new StringBuilder(true);

    var count = 10000000;
    for (var i = 0; i < count; i++) {
        builder.append('text' + i);
    }
    builder.toString();

    var end = Date.now();
    console.log('Time taken: [%s] ms', end - start);
}

testForString();
testForArray();
