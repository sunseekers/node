const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  // 配置查找loader目录
  resolveLoader: {
    modules: [path.resolve('node_modules'), path.resolve(__dirname, 'src', 'loaders')]
  },
  module: {
    rules: [{
      test: /\.html$/,
      use: {
        loader: 'html-layout-loader',
        options: {
          layout: path.join(__dirname, 'src', 'layout.html'),
          placeholder: '{{__content__}}',
          decorator: 'layout'
        }
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/home.html',
      filename: 'home.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/login.html',
      filename: 'login.html',
    }),
  ]
}