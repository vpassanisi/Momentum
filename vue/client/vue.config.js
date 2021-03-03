module.exports = {
  devServer: {
    port: 5000,
    disableHostCheck: true,
    proxy: {
      "^/gql": {
        target: "http://localhost",
      },
    },
  },
  outputDir: "../dist/client",
};
