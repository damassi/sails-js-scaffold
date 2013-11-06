/**
 * Development tasks
 *
 * @author  Christopher Pappas
 * @date    10.29.13
 *
 * Primary Tasks:
 *   tests  :  Execute mocha tests
 *   dev    :  Development mode, file-watcher
 */


module.exports = function( grunt ) {

  grunt.initConfig({

    // + ---------------------------------------------


    basePath : '.',
    sources  : '<%= basePath %>/',
    output   : '<%= basePath %>/.tmp/public',
    dist     : '<%= basePath %>/www',
    port     : 3001,


    // + ---------------------------------------


    //
    // Concatinate all vendor files into a single source
    //

    'concat': {

      options: {
        separator: ';'
      },

      vendor: {
        src: [
          '<%= sources %>/vendor/scripts/jquery-2.0.3.js',
          '<%= sources %>/vendor/scripts/jquery.mobile.custom.min.js',
          '<%= sources %>/vendor/scripts/modernizr-2.6.2.min.js',
          '<%= sources %>/vendor/scripts/gumby.min.js',
          '<%= sources %>/vendor/scripts/lodash.js',
          '<%= sources %>/vendor/scripts/backbone.js',
          '<%= sources %>/vendor/scripts/backbone.mods.js',
          '<%= sources %>/vendor/scripts/greensock/TweenMax.js',
          '<%= sources %>/vendor/scripts/greensock/easing/EasePack.js',
          '<%= sources %>/vendor/scripts/greensock/utils/Draggable.js',
          '<%= sources %>/vendor/scripts/greensock/plugins/CSSPlugin.js',
          '<%= sources %>/vendor/scripts/greensock/plugins/RoundPropsPlugin.js',
          '<%= sources %>/vendor/scripts/greensock/plugins/GreenProp.js',
          '<%= sources %>/vendor/scripts/greensock/plugins/ThrowPropsPlugin.min.js',
        ],

        dest: '<%= output %>/assets/javascripts/vendor.js'
      }
    },



    'concurrent': {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },



    //
    // Copy asset and vendor files to public
    //

    'copy': {

      assets: {
        files: [{
          expand: true,
          cwd: '<%= sources %>/assets/',
          src: ['**'],
          dest: '<%= output %>/assets/'
        }]
      },

      sails: {
        files: [{
          expand: true,
          cwd: '<%= sources %>/vendor/scripts/sails',
          src: ['**'],
          dest: '<%= output %>/assets/javascripts/'
        }]
      },

      html: {
        files: [
          {
            expand: true,
            cwd: '<%= sources %>/html/',
            src: ['**'],
            dest: '<%= output %>'
          }
        ]
      },

      dist: {
        files:[{
          expand: true,
          cwd: '<%= output %>',
          src:['**'],
          dest: '<%= dist %>'
        }]
      }
    },



    //
    // Clean client-facing directories
    //

    'clean': {

      output: {
        files: [{
          expand: true,
          cwd: '<%= output %>',
          src: ['**']
        }]
      },

      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= dist %>',
            src: ['**']
          }
        ]
      }
    },



    //
    // Check for errors in CoffeeScript files
    //

    'coffeelint': {
      app: ['<%= sources %>/**/*.coffee'],
      options: {
        no_tabs: {
          value: false,
          level: 'ignore'
        },
        indentation: {
          value: false,
          level: 'ignore'
        }
      }
    },



    //
    // Add the livereload server
    //

    'livereload': {
      port: 35727
    },



    //
    // Automatically restart server on source changes
    //

    'nodemon': {
      dev: {
        options: {
          file: '<%= sources %>/scripts/index.coffee',
          args: ['production'],
          //nodeArgs: ['--debug'],
          ignoredFiles: ['README.md', 'node_modules/**'],
          watchedExtensions: ['js', 'coffee'],
          delayTime: .5,
          env: {
            PORT: '3000'
          }
        }
      }
    },



    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5857,
          'save-live-edit': true
        }
      }
    },



    //
    // Compile sass files to css
    //

    'sass': {

      compile: {
        options: {
          compass: true,
          style: "expanded",
          debugInfo: true
        },

        files: [{
          src: [
            '<%= sources %>/vendor/styles/gumby/sass/gumby.scss',
            '<%= sources %>/styles/app.sass'
          ],
          dest: '<%= output %>/assets/styles/app.css'
        }]
      },

      dist: {
        options: {
          style: "compressed",
          debugInfo: false
        },

        files: [{
          src: '<%= sources %>/styles/app.sass',
          dest: '<%= output %>/assets/styles/app.css'
        }]
      }
    },



    //
    // Mocha spec runner for server-side files
    //

    'simplemocha': {
      options: {
        ui: 'bdd',
        reporter: 'spec',
        compilers: 'coffee:coffee-script',
        bail: true
      },

      all: {
        src: ['test/ranker_spec.coffee']
      }
    },



    //
    // Watch server files and tests
    //

    'watch': {
      options: {
        livereload: '<%= port %>'
      },

      tests: {
        files: [ 'test/**' ],
        tasks: [ 'simplemocha' ]
      },

      assets: {
        files: '<%= sources %>/assets/**/*.*',
        tasks: ['copy:assets']
      },

      html: {
        files: '<%= sources %>/html/**',
        tasks: ['copy:html']
      },

      styles: {
        files: '<%= sources %>/styles/**/*.*',
        tasks: ['sass:compile']
      },

      vendor: {
        files: '<%= sources %>/vendor/**/*.js',
        tasks: ['concat:vendor']
      }
    },


    //
    // Compress and minify files
    //

    'uglify': {

      vendor: {
        src: '<%= dist %>/javascripts/vendor.js',
        dest: '<%= dist %>assets//javascripts/vendor.js'
      }
    }


  })


  // + ---------------------------------------


  grunt.registerTask( 'compileAssets', [
    'clean:output',
    'copy:assets',
    'copy:sails',
    'copy:html',
    'sass:compile',
    'concat:vendor',
    //'concurrent'
  ])

  grunt.registerTask( 'dev', [
    //'coffeelint',
    //'tests',
    'watch'
  ])

  grunt.registerTask( 'tests', [
    'simplemocha'
  ])

  grunt.registerTask( 'default', [
    'compileAssets',
    'dev'
  ])

  grunt.registerTask( 'linkAssets', [])
  grunt.registerTask( 'build', [])
  grunt.registerTask( 'prod', [])


  // + ---------------------------------------


  // Load task dependencies via 'load-grunt-tasks'
  require('load-grunt-tasks')( grunt )


  // + ---------------------------------------


  grunt.option( 'stack', true );
  grunt.option( 'force', true );


}
