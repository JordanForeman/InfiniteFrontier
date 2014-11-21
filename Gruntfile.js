module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		watch: {
			scripts: {
				files: ['public/js/**/*.js', '!public/js/build/*.js'],
				tasks: ['concat']
			}
		},

		concat: {
			dist: {
				src: [
					'public/bower_components/phaser/build/phaser.js',
					'public/bower_components/phaser-plugin-isometric/dist/phaser-plugin-isometric.js',
					'public/js/core.js',
					'public/js/const.js',
					'public/js/Controller.js',
					'public/js/Player.js',
					'public/js/events/*.js',
					'public/js/views/*.js',
					'public/js/game.js'
				],
				dest: 'public/js/build/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat']);
	grunt.registerTask('local', ['concat', 'watch']);

};