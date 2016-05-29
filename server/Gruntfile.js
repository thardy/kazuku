module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        jshint: {
            files: ['src/**/*.js'],
            options: {
                '-W079': true,
                'node': true,
                'mocha': true,
                'esnext': true // deprecated, use the following once jshint upgrades
                //'esversion': 6
            }
        },
//        watch: {
//            files: ['src/**/*js'],
//            tasks: ['jshint']
//        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true
                },
                src: [ 'src/**/*.spec.js' ]
            }
        },

        delta: {
            js: {
                options: {
                    spawn: false
                },
                files: [ 'src/**/*.js' ],
                tasks: [ 'jshint', 'mochaTest' ]
            }
        }
    });

    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', [ 'jshint', 'mochaTest', 'delta' ]);

    // On watch events, if the changed file is a test file then configure mochaTest to only
    // run the tests from that file. Otherwise run all the tests
    var defaultTestSrc = grunt.config('mochaTest.test.src');
    grunt.event.on('watch', function(action, filepath) {
        grunt.config('mochaTest.test.src', defaultTestSrc);
        if (filepath.match('.spec.js$')) {
            grunt.config('mochaTest.test.src', filepath);
        }
    });

}
