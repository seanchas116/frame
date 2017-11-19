const path = require('path')
const webpack = require('webpack')

const fileRegex = /\.(jpg|png|woff|woff2|eot|ttf|svg)/

module.exports = {
  entry: {
    test: path.resolve(__dirname, 'src/test.ts')
  },
  output: {
    path: path.resolve(__dirname, 'public/assets'),
    publicPath: '/assets/',
    filename: '[name].js',
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        use: ['istanbul-instrumenter-loader', {
          loader: 'awesome-typescript-loader',
          options: {
            useCache: true
          }
        }]
      }
    ]
  },
  devtool: 'inline-source-map'
}
