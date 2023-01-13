const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin, SourceMapDevToolPlugin } = require("webpack");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: false,
  devServer: {
    open: true,
    watchFiles: ["./src/**/*", "../app_package/lib/**/*"],
  },
  output: {
    path: path.resolve(__dirname, "../docs"),
    filename: "bundle.js",
  },
  plugins: [
    new DefinePlugin({
      DEV_BUILD: JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({ title: "Dungeon Delvers" }),
    new SourceMapDevToolPlugin({
      filename: "[file].map",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
};
