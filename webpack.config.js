const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/client/lib/client.tsx'
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  module:{
    rules:[{
        loader: 'babel-loader',
        test: /\.js|\.jsx|\.tsx$/,
        exclude: /node_modules/
    }]
},
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  }
};