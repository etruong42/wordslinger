({
	baseUrl: 'public/assets/js',
	mainConfigFile: 'public/assets/js/main.js',
	name: 'main',
	out: 'public/assets/js/scripts.min.js',
	preserveLicenseComments: false,
	paths: {
		requireLib: 'vendor/require'
	},
	include: 'requireLib'
})