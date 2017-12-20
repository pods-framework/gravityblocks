var PROD = (process.env.NODE_ENV === 'production')

module.exports = {
	entry: './js/block.jsx',
	output: {
		path: __dirname + '/js',
		filename: 'block.min.js',
	},
	devtool: PROD ? '' : 'eval-source-map',
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