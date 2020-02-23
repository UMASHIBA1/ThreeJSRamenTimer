const path = require("path");
const workBoxWebpackPlugin = require("workbox-webpack-plugin");
const outputPath = path.resolve(__dirname, "public");
const HtmlWebpackPlugin = require('html-webpack-plugin');

// []webpackを使いたかったらyarn buildでいける
module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: `${outputPath}`
  },
  module: {
    rules: [{
        test: /\.ts/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.png/,
        use: ["file-loader"]
      },
      {
        test: /\.html/,
        use: ["html-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  devServer: {
    contentBase: `${outputPath}/`,
    open: true,
    hot: true,
    inline: true,
    watchContentBase: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/html/index.html"
    }),
    new workBoxWebpackPlugin.GenerateSW({
      swDest: outputPath + "/service-worker.js",
      clientsClaim: true,
      skipWaiting: true
    })
  ]
};
