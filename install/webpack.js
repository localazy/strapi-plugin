"use strict";

/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config
  // Important: return the modified config

  // return config;


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
        // os: false,
        stream: false,
        path: false,
        timers: false,
        tls: false,
        net: false,
        // util: false,
      },
    }
  };
};
