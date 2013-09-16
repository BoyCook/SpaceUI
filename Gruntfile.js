module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    karma: {
      unit: {
        configFile: 'karma.js',
         autoWatch: false,
         singleRun: true
      },
      continuous: {
        configFile: 'karma.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    mochacli: {
        options: {
            require: ['should'],
            reporter: 'spec',
            bail: true
        },
        all: ['test/spec/*.js']
    },
    mochacov: {
      options: {
        // quiet: true,
        reporter: 'html-cov',
        require: ['should'],
        output: 'coverage.html'
      },
      all: ['test/spec/*.js']
    }    
  });

  // Load the plugin that provides the "uglify" task.
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-mocha-cov');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-connect');  
  // grunt.loadNpmTasks('grunt-istanbul-coverage');

  // grunt.loadNpmTasks('grunt-karma');
  // grunt.loadNpmTasks('grunt-karma-coveralls');

  // Default task(s).
  // grunt.registerTask('test', ['connect', 'mocha']);  
  // grunt.registerTask('test', ['mochacli']);
  grunt.registerTask('test', ['mochacov']);
  grunt.registerTask('default', ['mochacli']);
};
