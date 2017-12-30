const path = require('path')
const webpack = require('webpack')

const fileRegex = /\.(jpg|png|woff|woff2|eot|ttf|svg)/

module.exports = {
  entry: {
    renderer: path.resolve(__dirname, 'src/renderer.tsx'),
    testapp: path.resolve(__dirname, 'src/testapp.ts')
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
        enforce: 'pre',
        use: {
          loader: 'tslint-loader',
          options: {
            emitErrors: true
          }
        }
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
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { modules: true, sourceMap: true } }
        ]
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
