// Karma configuration
// Generated on Thu Sep 12 2013 16:22:56 GMT+0100 (BST)

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',
    // frameworks to use
    frameworks: ['mocha', 'requirejs'],
    // list of files / patterns to load in the browser
    files: [
        MOCHA,
        MOCHA_ADAPTER,
        REQUIRE,
        REQUIRE_ADAPTER,

        // libs required for test framework
        {pattern: 'node_modules/should/lib/should.js', included: false},

        // put what used to be in your requirejs 'shim' config here,
        // these files will be included without requirejs
        'assets/sort.js',
        'assets/filter.js',

        // put all libs in requirejs 'paths' config here (included: false)
        // {pattern: 'lib/**/*.js', included: false},

        // all src and test modules (included: false)
        // {pattern: 'src/**/*', included: false},
        {pattern: 'test/spec/*.js', included: false},

        // test main require module last
        'test/test-main.js'
    ],
    // list of files to exclude
    exclude: [
      
    ],
    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],
    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
