module.exports = {
  devServer: {
    proxy: {
      "^/gql": {
        target: "http://localhost:80",
      },
    },
  },
};
