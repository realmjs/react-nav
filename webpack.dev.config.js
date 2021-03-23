"use strict"

const path = require("path")

module.exports = {
    entry: {
      dev: ["./example/index.js"]
    },
    output: {
      filename: "app.bundle.js",
      publicPath: "/assets/",
    },
    resolve: { extensions: ['.js', '.jsx'] },
    module: {
      rules: [
        {
          test: /(\.js?$|\.jsx?$)/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'example'),
      publicPath: "/assets/",
      historyApiFallback: true
    }
}
