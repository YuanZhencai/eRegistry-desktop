const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.entries = function () {
  return {
	renderer: path.join(__dirname, '../src/renderer/main.js'),
	video: path.join(__dirname, '../src/renderer/video/index.js'),
  }
}

exports.plugins = function () {
  return [
	new HtmlWebpackPlugin({
	  filename: 'index.html',
	  template: path.resolve(__dirname, '../src/index.ejs'),
	  chunks: ['manifest', 'vendor', 'renderer'],
	  inject: true,
	  minify: {
		collapseWhitespace: true,
		removeAttributeQuotes: true,
		removeComments: true
	  },
	  nodeModules: process.env.NODE_ENV !== 'production'
		? path.resolve(__dirname, '../node_modules')
		: false
	}),
	new HtmlWebpackPlugin({
	  filename: 'video.html',
	  template: path.resolve(__dirname, '../src/index.ejs'),
	  chunks: ['manifest', 'vendor', 'video'],
	  inject: true,
	  minify: {
		collapseWhitespace: true,
		removeAttributeQuotes: true,
		removeComments: true
	  },
	  nodeModules: process.env.NODE_ENV !== 'production'
		? path.resolve(__dirname, '../node_modules')
		: false
	})
  ]
}
