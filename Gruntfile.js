module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		watch: {
			scripts: {
				files: ['public/js/**/*.js', '!public/js/build/*.js'],
				tasks: ['concat', 'uglify']
			}
		},

		uglify: {
			build: {
				files: {
					'public/js/build/<%= pkg.name %>-<%= pkg.version %>.min.js': 'public/js/build/<%= pkg.name %>-<%= pkg.version %>.js'
				}
			}
		},

		concat: {
			dist: {
				src: [
					'public/js/core.js',
					'public/js/client/*.js',
					'public/js/entities/*.js',
					'public/js/const.js',
					'public/js/Controller.js',
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
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['concat', 'uglify']);
	grunt.registerTask('local', ['concat', 'uglify', 'watch']);

};