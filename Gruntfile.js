module.exports = function(grunt) {

  grunt.initConfig({
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['tour.css'],
          dest: 'dist',
          ext: '.min.css'
        }]
      }
    },

    uglify: {
      my_target: {
        files: {
          'dist/tour.min.js': ['src/tour.js']
        }
      }
    },
    watch: {
      files: ['src/*[css|js]'],
      tasks: ["uglify", 'cssmin']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};
