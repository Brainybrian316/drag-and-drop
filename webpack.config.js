const path = require('path');

module.exports = {
	entry: './src/app.ts',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	// tells webpack to extract the source map into a separate file and to include it in the bundle
	devtool: 'inline-source-map',
	// module is just a file
	module: {
		// rules is an array of rules that we want to apply to our files
		rules: [
			{
				// describes a test to run on a file to see if it should be included in the rules
				test: /\.ts$/,
				// if the test passes, use the following loader
				use: 'ts-loader',
				// exclude node_modules
				exclude: /node_modules/,
			},
		],
	},
	// resolve is an object that tells webpack how to resolve certain file types
	resolve: {
		// tells webpack to look for files with the following extensions
		extensions: ['.ts', '.js'],
	},
};
