const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      filename: "index.html",
      inject: true,
    }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ["dist"],
        },
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/style.css', to: 'style.css' },
      ],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 8000,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  mode: "development",
  watch: true,
};
