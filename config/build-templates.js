module.exports = {
	files: ['./src/main/resources/views/*.mustache'],
	cwd: './target',
	pathToCompiled: '/views/origami-templates',
	pathToBower: '<%= path.bower %>',
	overrides: {
		'o-ft-header': {
            _namespace: 'header',
			'topbar-items': '> o-ft-legacy-signin/main'
		},
        'o-ft-legacy-signin': {
            encodedLocation: 'encodedLocation'
        },
        'o-ft-footer': {
            _namespace: 'footer'
        }
	}
};