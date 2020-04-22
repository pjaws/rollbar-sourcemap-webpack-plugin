const RollbarSourcemapPlugin = require('rollbar-sourcemap-webpack-plugin');
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'nosources-source-map'
});

// replace `<ROLLBAR_ACCESS_TOKEN>` with your Rollbar access token
const ROLLBAR_ACCESS_TOKEN = '<ROLLBAR_ACCESS_TOKEN>';

module.exports = withSourceMaps({
  env: {
    ROLLBAR_ACCESS_TOKEN: ROLLBAR_ACCESS_TOKEN
  },
  webpack: (config, { dev, webpack, buildId }) => {
    if (!dev) {
      config.output.futureEmitAssets = false;
      // Generate a common `id` to be used when initializing Rollbar & when uploading the sourcemaps.
      // This could be any common value, as long as it is used in `_document.js` when initializing Rollbar.
      const codeVersion = buildId;
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_BUILD_ID': codeVersion
        })
      );

      config.plugins.push(
        new RollbarSourcemapPlugin({
          accessToken: ROLLBAR_ACCESS_TOKEN,
          version: codeVersion,
          publicPath: 'https://domain.com/_next/'
        })
      );
    }

    return config;
  }
});
