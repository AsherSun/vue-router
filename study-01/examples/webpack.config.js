const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const VuePlugin = require('vue-loader/lib/plugin')
module.exports = {
  context: __dirname,
  node: {
    __dirname: true
  },

  mode: process.env.NODE_ENV || 'development',

  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'main.js')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['es6-promise/auto', entry]
    }
    return entries
  }, {}),

  output: {
    path: path.join(__dirname, '__study__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__study__/'
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
      vue: 'vue/dist/vue.esm.js',
      routes: path.join(__dirname, '..', '/src/routes.js')
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

  plugins: [
    new VuePlugin(),
    new webpack.DefinePlugin({
      DEFAULTBASE: JSON.stringify('/default'),
      HISTORYBASE: JSON.stringify('/history')
    })
  ]
}
