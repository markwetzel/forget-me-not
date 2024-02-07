const path = require("path");

module.exports = {
  entry: "./src/background.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  "devtool": "source-map",
  output: {
    filename: "background.js",
    path: path.resolve(__dirname, "dist"),
  },
};
