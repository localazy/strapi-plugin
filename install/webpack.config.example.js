export default (config, webpack) => {
  /**
   * This is an example of how to extend webpack config in order to use Localazy Strapi Plugin.
   * Because Strapi is using Webpack 5, it is necessary to disable some Node.js polyfills in the Strapi monorepo.
   *
   * If your webpack config does not exist, create one.
   */

  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        crypto: false,
        http: false,
        fs: false,
        zlib: false,
        https: false,
        stream: false,
        path: false,
        timers: false,
        tls: false,
        net: false,
        url: false,
        querystring: false,
      },
    },
  };
};
