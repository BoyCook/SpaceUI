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
      coverage: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      test: {
        options: {
          reporter: 'spec'
        }
      },
      options: {
        require: ['should'],
        files: 'test/spec/*.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.registerTask('travis', ['mochacov:coverage']);
  grunt.registerTask('test', ['mochacov:test']);
  grunt.registerTask('default', ['test']);
};
