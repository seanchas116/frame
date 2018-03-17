const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, 'src/bootstrap/main.ts'),
  output: {
    path: path.resolve(__dirname, 'public/assets'),
    filename: 'main.js',
    libraryTarget: 'commonjs'
  },
  target: 'electron-main',
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: {
    'transparent-titlebar': true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'awesome-typescript-loader',
          options: {
            useCache: true
          }
        }
      }
    ]
  }
}
