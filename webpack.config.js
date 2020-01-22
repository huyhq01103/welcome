const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglify-es-webpack-plugin');

const path = require('path');

const ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development';
const DEVELOPMENT = ENV === 'development';

const extractless = new ExtractTextPlugin({
    filename: 'welcome-page.css',
    disable: ENV === 'development'
});


module.exports = {
    context: __dirname + '/',
    entry: './app/index.js',
    bail: true,
    output: {
		path: __dirname + (DEVELOPMENT ? '/build' : '/dist'),
		filename: 'welcome-page.js'
    },
    stats: {
		warnings: false
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
            {
                test: /\.styl$/,
                use: extractless.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
								sourceMap: DEVELOPMENT,
								// minimize: !DEVELOPMENT
							}
                        },
                        {
                            loader: 'stylus-loader',
                            options: {
								sourceMap: DEVELOPMENT
							}
                        }
                    ],
					fallback: 'style-loader'
                })
            },
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				loader: 'url-loader'
			}
        ]
    },
    plugins: [
        extractless,
        new HtmlWebpackPlugin({
            filename: DEVELOPMENT ? 'index.html' : 'welcome-page.html',
			template: 'app/index.html',
			inject: false,
			ENV: ENV
        }),
        new webpack.DefinePlugin({
			DEVELOPMENT: DEVELOPMENT,
			'process.env': {
				NODE_ENV: DEVELOPMENT ? JSON.stringify('development') : JSON.stringify('production')  // for React optimizations
			}
		})
    ]
}

if (DEVELOPMENT) {
	const devPlugins = [
		new CopyWebpackPlugin([
			{ from: './app/mock.js', to: './mock.js' }
		]),
		new webpack.HotModuleReplacementPlugin()
	];

	module.exports.plugins = module.exports.plugins.concat(devPlugins);

	module.exports.devServer = {
		contentBase: path.join(__dirname, '/build'),
		host: 'localhost',
		port: 8080,
		hot: true,
		inline: true,
		overlay: true
	};

} else {
	module.exports.plugins.push(new UglifyJsPlugin({
		sourceMap: false,
		compress: {
			sequences: true,
			dead_code: true,
			conditionals: true,
			booleans: true,
			unused: true,
			if_return: true,
			join_vars: true,
			drop_console: false
		},
		output: {
			comments: /^\s?(?:<if|<\/if)/gi
		}
	}));
}