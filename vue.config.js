const { defineConfig } = require('@vue/cli-service')
// vue.config.js
module.exports = {
  // IMPORTANT: use your repo name here
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/After-School-Lessons/"
      : "/",
};


