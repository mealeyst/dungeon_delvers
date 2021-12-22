const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '../../.env')
});


module.exports = {
  mode: 'development',
  entry: {
    index: path.join(__dirname, './lib/client.tsx')
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  module:{
    rules:[{
        loader: 'babel-loader',
        test: /\.js|\.ts|\.jsx|\.tsx$/,
        exclude: /node_modules/
    }]
},
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env)
    }),
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};