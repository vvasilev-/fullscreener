module.exports = function(grunt){

	// tasks
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-zipup');

	// config
	grunt.initConfig({
		packageInfo: grunt.file.readJSON('bower.json'),
		uglify: {
			main: {
				files: { 
					'src/jquery.fullscreener.min.js': ['src/jquery.fullscreener.js']
				}
			}
		},
		zipup: {
			main: {
				appName: '<%= packageInfo.name %>',
				version: '<%= packageInfo.version %>',
				outDir: 'build',
				files: [
					{ src: 'src/jquery.fullscreener.min.js' },
					{ src: 'src/jquery.fullscreener.css' }
				],
				template: '{{appName}}-{{version}}.zip'
			}
		}
	});

	// custom tasks
	grunt.registerTask('build', ['uglify:main', 'zipup:main'])

};