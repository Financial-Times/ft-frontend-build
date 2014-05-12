module.exports = {
	files: ['<%= ft.srcPath %>**/*.mustache'],
	cwd: '<%= ft.stagingPath %>',
	pathToCompiled: '/origami-templates',
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