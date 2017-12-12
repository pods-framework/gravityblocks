module.exports = {
	watch: true,
	entry: './js/block.js',
	output: {
		path: __dirname + '/js',
		filename: 'block.min.js',
	},
	module: {
		loaders: [
			{
				test: /.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
};