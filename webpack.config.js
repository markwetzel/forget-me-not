const path = require("path");

module.exports = {
  entry: {
    background: "./src/background.ts", // Existing background script
    popup: "./src/popup.ts", // Add this line for your popup script
  },
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
    filename: "[name].js", // This will use the entry point names to generate the output files
    path: path.resolve(__dirname, "dist"),
  },
};
