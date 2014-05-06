module.exports = {
    prod: {
        'devFile': '<%=path.bower %>/modernizr/modernizr.js', // [REQUIRED] Path to the build you're using for development.
        'outputFile': './src/main/resources/tmp/modernizr-custom.js', // [REQUIRED] Path to save out the built file.
        'extra': {
            'shiv': true,
            'printshiv': false,
            'load': true,
            'mq': false,
            'cssclasses': true
        },
        'extensibility': {
            'addtest': false,
            'prefixed': false,
            'teststyles': false,
            'testprops': false,
            'testallprops': false,
            'hasevents': false,
            'prefixes': false,
            'domprefixes': false
        },
        'uglify': false,
        'tests': [],
        'parseFiles': true,
        'files': {
            src: [
                '<%=path.target%><%= static_assets_path.js %>*.js',
                '<%=path.target%><%= static_assets_path.css %>*.css',
                './target/views/common/inlineHeadScript.mustache'
            ]
        },
        'matchCommunityTests': false, // When parseFiles = true, matchCommunityTests = true will attempt to match user-contributed tests.
        'customTests': [] // Have custom Modernizr tests? Add paths to their location here.
    }
};