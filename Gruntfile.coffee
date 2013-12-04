module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON('package.json')

    meta:
      banner: '/*! <%= pkg.name %> <%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.email %>> | <%= pkg.license %> License */\n'

    coffee:
      compile:
        expand: true
        cwd: 'src/'
        src: ['**/*.coffee']
        dest: ''
        ext: '.js'

    concat:
      options:
        banner: '<%= meta.banner %>'
      dist:
        src: ['Stopwatch.js']
        dest: 'Stopwatch.js'

    uglify:
      options:
        banner: '<%= meta.banner %>'
      dist:
        files:
          'Stopwatch.min.js': ['Stopwatch.js']

    watch:
      files: 'src/**/*.coffee'
      tasks: ['compile']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'compile', ['coffee', 'concat', 'uglify']
  grunt.registerTask 'default', ['compile', 'watch']