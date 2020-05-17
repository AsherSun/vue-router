// const fs = require('fs')
const path = require('path')
const VuePlugin = require('vue-loader/lib/plugin')

module.exports = {
  context: __dirname,
  node: {
    __dirname: true
  },

  mode: process.env.NODE_ENV || 'development',

  entry: {
    history: './history/main.js'
  },

  output: {
    path: path.join(__dirname, '__study__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '__study__'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },

  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js'
    }
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        shared: {
          name: 'shared',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  },

  plugins: [new VuePlugin()]
}
