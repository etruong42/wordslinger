({
	baseUrl: 'server/public/assets/js',
	mainConfigFile: 'server/public/assets/js/main.js',
	name: 'main',
	out: 'server/public/assets/js/scripts.min.js',
	preserveLicenseComments: false,
	generateSourceMaps: true,
	optimize: 'uglify2',
	paths: {
		requireLib: 'vendor/require'
	},
	include: 'requireLib'
})