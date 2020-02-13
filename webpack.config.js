const path = require('path')
const production = process.env.NODE_ENV === 'production'

module.exports = {
  mode: production ? 'production' : 'development',
  devtool: 'source-map',
  entry: {
    main: './index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    globalObject: 'this',
    libraryExport: 'default',
    library: 'validateNorwegianSSN',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
}
