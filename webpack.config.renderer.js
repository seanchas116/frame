const path = require('path')
const webpack = require('webpack')

const fileRegex = /\.(jpg|png|woff|woff2|eot|ttf|svg)/

module.exports = {
  entry: {
    renderer: path.resolve(__dirname, 'src/renderer.tsx'),
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
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'awesome-typescript-loader',
          options: {
            useCache: true
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader?modules']
      },
      {
        test: /node_modules.*\.css$/,
        use: [ 'style-loader', 'css-loader']
      },
      {
        test: fileRegex,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    port: 23000
  }
}
