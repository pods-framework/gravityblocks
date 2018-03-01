const webpack = require( 'webpack' );
const PROD = ( process.env.NODE_ENV === 'production' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const extractSass = new ExtractTextPlugin( {
	filename: ( getPath ) => {
		return getPath( 'css/[name].min.css' ).replace( 'css/js', 'css' );
	}
} )

module.exports = {
	entry:     {
		'js/blocks/core': './js/blocks/core.jsx',
	},
	output:    {
		path:     __dirname + '/',
		filename: '[name].min.js',
	},
	devtool:   PROD ? '' : 'eval-source-map',
	resolve:   {
		extensions: [ '.js', '.jsx' ]
	},
	module:    {
		rules: [
			{
				test:    /.jsx?$/,
				exclude: /node_modules/,
				use:     {
					loader: 'babel-loader',
					query:  {
						presets: [ 'react' ],
						plugins: [ 'transform-object-rest-spread' ]
					}
				}
			},
			{
				test: /\.scss$/,
				use:  extractSass.extract( {
					use: [ {
						loader:  "css-loader",
						options: {
							minimize:     true,
							sourceMap:    true,
							autoprefixer: {
								add:     true,
								cascade: false,
							},
						}
					}, {
						loader:  "sass-loader",
						options: {
							sourceMap: true
						}
					} ]
				} )
			}
		]
	},
	externals: {
		react:       'React',
		'react-dom': 'ReactDOM',
	},
	plugins:   [
		extractSass
	]
};