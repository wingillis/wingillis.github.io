module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.initConfig(
    {
      pug: {
        default: {
          options: {
            pretty: true
          },
          files: {
            '_includes/head.html': ['_includes/head.jade']
          }
        }
      }
    }
  );
};
