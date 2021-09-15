const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    devServer: {
        open: true,
        watchFiles: ["./src/**/*", "../app_package/lib/**/*"]
    },
    output: {
        path: path.resolve(__dirname, "../docs"),
        filename: "bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({ title: "Babylon.js Proving Ground" })
    ]
};
