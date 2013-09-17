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
    blanket: {
      options: {},
      files: {
        'assets-cov': ['assets'],
      },
    },    
    mochacov: {
      coverage: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      coveragemanual: {
        options: {
          coveralls: {
            serviceName: 'travis-ci',
            serviceJobId: '000000001',
            repoToken: 'DkSQyzanXTf3LMBZ3MmvTCY0oDj5uxAuA'
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
  grunt.loadNpmTasks('grunt-blanket');
  grunt.registerTask('travis', ['mochacov:coverage']);
  grunt.registerTask('test', ['mochacov:test']);
  grunt.registerTask('cov', ['mochacov:coveragemanual']);
  grunt.registerTask('default', ['test']);
};
