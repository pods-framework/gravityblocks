module.exports = {
	watch: true,
	entry: './js/block.jsx',
	output: {
		path: __dirname + '/js',
		filename: 'block.min.js',
	},
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['react'],
					plugins: ['transform-object-rest-spread']
				}
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx']
	}
};