const path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'worker.js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'cheap-module-source-map',
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      logic: path.resolve(__dirname, 'src/logic'),
      util: path.resolve(__dirname, 'src/util'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
}
