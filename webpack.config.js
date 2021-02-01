const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'javascripts', 'index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.glsl$/,
      use: 'raw-loader',
    }],
  },
};
