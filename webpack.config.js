const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const javascript = {
  test: /\.(js)$/,
  use: [{
    loader: 'babel-loader',
    options: { presets: ['es2015'] }
  }],
};

const postcss = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    plugins() {
      return [autoprefixer({ browsers: 'last 3 versions' })];
    }
  }
};

const styles = {
  test: /\.(scss)$/,
  use: ExtractTextPlugin.extract(['css-loader?sourceMap', postcss, 'sass-loader?sourceMap'])
};

const uglify = new webpack.optimize.UglifyJsPlugin({
  compress: { warnings: false }
});

const fontAwesome = {
  componentStyles: {
    test: /\.scss$/,
    loaders: ["style-loader", "css-loader", "sass-loader"],
    exclude: path.resolve(__dirname, 'src/app')
  },
  fonts: {
    test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
    loader: 'file-loader?name=fonts/[name].[ext]'
  }
};

const config = {
  entry: {
    App: './public/js/budgetify.js'
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      fontAwesome.componentStyles,
      fontAwesome.fonts,
      styles,
      javascript
    ]
  },

  // TODO uncomment
  // plugins: [uglify]

  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    })
  ]
};
process.noDeprecation = true;

module.exports = config;