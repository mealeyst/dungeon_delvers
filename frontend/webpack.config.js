var HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  resolve: {
    alias: {
      SRC: path.resolve(__dirname, "src")
    }
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Dungeon Delvers",
      template: "./src/index.html"
    })
  ]
};
