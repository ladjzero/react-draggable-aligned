const path = require('path');

module.exports = {
  entry: './src/lib/index',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    library: '',
    libraryTarget: 'commonjs',
  },
  externals: [
    'react',
    'react-draggable',
    'prop-types',
  ],
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  }
};