import pkg from './../../package.json';

const nodeBuiltins = [
  'async_hooks',
  'assert',
  'crypto',
  'string_decoder',
  'events',
  'fs',
  'fs/promises',
  'http',
  'https',
  'net',
  'path',
  'querystring',
  'stream',
  'timers',
  'tls',
  'url',
  'zlib',
].reduce((acc, cur) => {
  acc.push(cur, `node:${cur}`);
  return acc;
}, []);

export default (config) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      rollupOptions: {
        external: [...nodeBuiltins, ...Object.keys(pkg.dependencies || {})],
      },
    },
  });
};
