[![Build Status](http://craigcook.co.uk/build/job/String%20Builder%20JS/badge/icon)](http://craigcook.co.uk/build/job/String%20Builder%20JS/)

## Description
A String Builder implementation in JavaScript for node.js

## Usage

For using String based storage

    var builder = new StringBuilder();
    builder.append('Some text');
    builder.toString('Some text');

For using Array based storage

    var builder = new StringBuilder(true);
    builder.append('Some text');
    builder.toString('Some text');

## Performance
See the timings.js for an idea. String concatenation performs better over Array join

    node test/timings.js

## Including in node.js app

You can include the module from GitHub directly by adding the following to your `package.json` and then doing `npm install`

    "dependencies": {
        "string-builder": "https://github.com/BoyCook/StringBuilderJS/tarball/master"
    }

## Links

* http://craigcook.co.uk/build/job/String%20Builder%20JS
* http://craigcook.co.uk/quality/dashboard/index/254

