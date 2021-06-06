/* Autor: Prof. Dr. Norman Lahme-Hütig (FH Münster) */

const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /^\/[a-z]*/, to: '/app/index.html' }]
    },
    host: '0.0.0.0',
    port: 8080,
    public: 'localhost:8080',
    publicPath: '/app/'
  },
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [
      { test: /\.ts$/, use: { loader: 'ts-loader', options: { transpileOnly: true } } },
      {
        test: /\.scss$/,
        include: /index\.scss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /index\.scss$/,
        use: [
          'to-string-loader',
          { loader: 'css-loader', options: { sourceMap: true, esModule: false } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true , sassOptions: {
            plugins: function () { // post css plugins, can be exported to postcss.config.js
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          } } }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{ loader: 'file-loader', options: { outputPath: 'fonts/', publicPath: '/app/fonts' } }]
      },
      {
        test: /\.css$/,
        use: [{loader: 'css-loader'}]
      },
      {
        test: /\.(png|jpe?g|gif)?$/,
        use: [{ loader: 'file-loader'}]
      }
      
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })]
};
