const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const domain = require("./src/utils/env").domain;

module.exports = (env, argv) => ({
  entry: "./src/index.tsx",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "js/[name].[contenthash].bundle.js",
    clean: true,
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "./src/assets/"),
      store: path.resolve(__dirname, "./src/store/"),
      utils: path.resolve(__dirname, "./src/utils/"),
      routes: path.resolve(__dirname, "./src/routes/"),
      types: path.resolve(__dirname, "./src/types/"),
      components: path.resolve(__dirname, "./src/components/"),
    },
    extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: argv.mode !== "production",
              modules: {
                localIdentName: "[local]--[hash:base64:5]",
              },
            },
          },
          {
            loader: path.resolve("./plugins/UnGap.js"),
            options: {
              compress: argv.mode === "production",
              indent: argv.mode === "production" ? "" : "  ",
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: argv.mode !== "production",
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  ["postcss-preset-env", {}],
                  ["postcss-logical", {}],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  ignoreWarnings: [/Failed to parse source map/],
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "**/*",
          context: "public",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
    new NodePolyfillPlugin(),
  ],
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      chunks: "async",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  devServer: {
    historyApiFallback: true,
    hot: "only",
    proxy: {
      "/rest": {
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        target: `http://${domain}`,
      },
      "/main_icons": {
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        target: `http://${domain}`,
      },
      "/api": {
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
        target: "http://188.72.76.55",
        // target: `http://${domain}`,
      },
    },
  },
});
