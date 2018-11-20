//code adapted from https://github.com/coryhouse/pluralsight-redux-starter/blob/master/webpack.config.dev.js
import webpack from 'webpack';
import path from 'path';

export default {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map', 
  entry: [
    'eventsource-polyfill', 
    'webpack-hot-middleware/client',
    './src/index'
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './src'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loader: 'babel-loader'},
      {
        test: /(\.css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {sourcemap: true}
          }
        ]
      },
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
      {test: /\.(woff|woff2)$/, options: {prefix: 'font/', limit: 5000}, loader: 'url-loader'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, options: {limit: 10000, mimetype: 'application/octet-stream'}, loader: 'url-loader'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, options: {limit: 10000, mimetype: 'image/svg+xml'}, loader: 'url-loader'}

    ]
  }
};
