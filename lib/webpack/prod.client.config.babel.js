import webpack from 'webpack';
import path from 'path';
import cssnext from 'cssnext';

const cfg = {
  context: path.join(__dirname, '../app'),
  entry: [
    '../app/client'
  ],

  output: {
    path: path.join(__dirname, '../public'),
    publicPath: '/public',
    filename: 'app.js'
  },

  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      __DEVTOOLS__: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.css$/, loader: 'style!css?modules&localIdentName=[local]___[hash:base64:10]' }
    ]
  },

  postcss: () => {
    return [cssnext];
  }
};

module.exports = cfg;