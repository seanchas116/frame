const path = require('path')
const webpack = require('webpack')

const fileRegex = /\.(jpg|png|woff|woff2|eot|ttf|svg)/

module.exports = {
  entry: {
    test: path.resolve(__dirname, 'src/bootstrap/test.ts')
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
        exclude: /test/,
        enforce: 'post',
        use: 'istanbul-instrumenter-loader',
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'awesome-typescript-loader',
          options: {
            useCache: true
          }
        }
      }
    ]
  },
  devtool: 'inline-source-map'
}
