module.exports = function(grunt){

	// grunt tasks
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// grunt config
	grunt.initConfig({
		uglify: {
			build: {
				files: { 
					'build/jquery.fullscreener.min.js': ['src/jquery.fullscreener.js']
				}
			}
		},
		copy: {
			main: {
				expand: true,
				cwd: 'src/',
				src: '**.css',
				dest: 'build/',
				filter: 'isFile'
			}
		}
	});

	// custom tasks
	grunt.registerTask('build', ['uglify:build', 'copy'])

};