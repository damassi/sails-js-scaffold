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

  var handleify = require('handleify');
  var uglify    = require("uglify-js");


  grunt.initConfig({


    // + ---------------------------------------------


    basePath : '.',
    sources  : '<%= basePath %>',
    frontend : '<%= basePath %>/frontend',
    output   : '<%= basePath %>/.tmp/public',
    dist     : '<%= basePath %>/www',
    port     : 3001,


    // + ---------------------------------------


    //
    // Compile JavaScript using browserify
    //

    'browserify2': {

      compile: {
        entry: [ '<%= frontend %>/javascripts/initialize.js'],
        compile: '<%= output %>/assets/javascripts/app.js',

        // Precompile Handlebars templates
        beforeHook: function( bundle ) {
          bundle.transform( handleify )
        },

        debug: true
      },

      dist: {
        entry: [ '<%= frontend %>/javascripts/initialize.js'],
        compile: '<%= output %>/assets/javascripts/app.js',
        debug: false,

        // Precompile Handlebars templates
        beforeHook: function( bundle ) {
          bundle.transform( handleify )
        },

        // Minify sources
        afterHook: function(src){
          var result = uglify.minify(src, {fromString: true});
          return result.code;
        }
      }
    },


    //
    // Concatinate all vendor files into a single source
    //

    'concat': {

      options: {
        separator: ';'
      },

      vendor: {
        src: [
          '<%= frontend %>/vendor/scripts/jquery-2.0.3.js',
          '<%= frontend %>/vendor/scripts/jquery.mobile.custom.min.js',
          '<%= frontend %>/vendor/scripts/modernizr-2.6.2.min.js',
          '<%= frontend %>/vendor/scripts/gumby.min.js',
          '<%= frontend %>/vendor/scripts/lodash.js',
          '<%= frontend %>/vendor/scripts/backbone.js',
          '<%= frontend %>/vendor/scripts/backbone.mods.js',
          '<%= frontend %>/vendor/scripts/greensock/TweenMax.js',
          '<%= frontend %>/vendor/scripts/greensock/easing/EasePack.js',
          '<%= frontend %>/vendor/scripts/greensock/utils/Draggable.js',
          '<%= frontend %>/vendor/scripts/greensock/plugins/CSSPlugin.js',
          '<%= frontend %>/vendor/scripts/greensock/plugins/RoundPropsPlugin.js',
          '<%= frontend %>/vendor/scripts/greensock/plugins/GreenProp.js',
          '<%= frontend %>/vendor/scripts/greensock/plugins/ThrowPropsPlugin.min.js',
        ],

        dest: '<%= output %>/assets/javascripts/vendor.js'
      }
    },



    'concurrent': {
      dev: {
        tasks: ['nodemon', 'default'],
        options: {
          logConcurrentOutput: true
        }
      }
    },



    //
    // Copy asset and vendor files to public
    //

    'copy': {

      images: {
        files: [{
          expand: true,
          cwd: '<%= frontend %>/images/',
          src: [
            '**',
          ],
          dest: '<%= output %>/assets/images/'
        }]
      },

      sails: {
        files: [{
          expand: true,
          cwd: '<%= frontend %>/vendor/scripts/sails',
          src: ['**'],
          dest: '<%= output %>/assets/javascripts/'
        }]
      },

      html: {
        files: [
          {
            expand: true,
            cwd: '<%= frontend %>/html/',
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
          file: '<%= sources %>/app.js',
          //args: ['production'],
          //nodeArgs: ['--debug'],
          ignoredFiles: [
            'README.md',
            'node_modules/*',
            'assets/*',
            'views/*',
            '/.tmp/*',
            '/.git/*',
            '/.tmp/*',
            '/.sass-cache/*',
            '/.tmpassets/*'
          ],
          watchedExtensions: ['js'],
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
            '<%= frontend %>/styles/app.scss'
          ],
          dest: '<%= output %>/assets/styles/app.css'
        }]
      },

      vendor: {
        options: {
          compass: true,
          style: "expanded",
          debugInfo: false
        },

        files: [{
          src: [
            '<%= frontend %>/vendor/styles/gumby/sass/gumby.scss'
          ],
          dest: '<%= output %>/assets/styles/vendor.css'
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
        livereload: '<%= port %>',
        spawn: false
      },

      tests: {
        files: [ 'test/**' ],
        tasks: [ 'simplemocha' ]
      },

      images: {
        files: '<%= frontend %>/images/**',
        tasks: ['copy:images']
      },

      styles: {
        files: '<%= frontend %>/styles/**/*',
        tasks: ['sass:compile']
      },

      vendor: {
        files: '<%= frontend %>/vendor/**/*.js',
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


  grunt.registerTask( 'default', [
    'compileAssets',
    'dev'
  ])

  grunt.registerTask( 'compileAssets', [
    'clean:output',
    'copy:images',
    'copy:sails',
    'copy:html',
    'browserify2:compile',
    'sass:compile',
    'sass:vendor',
    'concat:vendor'
  ])

  grunt.registerTask( 'dev', [
    //'coffeelint',
    //'tests',
    //'nodemon',
    //'concurrent'
    'watch'
  ])

  grunt.registerTask( 'tests', [
    'simplemocha'
  ])

  //grunt.registerTask( 'linkAssets', [])
  //grunt.registerTask( 'build', [])
  //grunt.registerTask( 'prod', [])


  // + ---------------------------------------


  // Load task dependencies via 'load-grunt-tasks'
  require('load-grunt-tasks')( grunt )


  // + ---------------------------------------


  grunt.option( 'stack', true );
  grunt.option( 'force', true );


}
