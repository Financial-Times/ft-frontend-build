module.exports = {
	files: ['./src/main/resources/views/*.mustache'],
	cwd: './target',
	pathToCompiled: '/views/origami-templates',
	pathToBower: '<%= path.bower %>',
};