import { mergeConfig, type UserConfig } from 'vite';
import pkg from './../../package.json';

const nodeBuiltins: string[] = [
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
].reduce((acc: string[], cur: string): string[] => {
  acc.push(cur, `node:${cur}`);
  return acc;
}, []);

export default (config: UserConfig) => {
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
