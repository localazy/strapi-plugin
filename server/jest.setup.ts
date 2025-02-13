import '@strapi/strapi';

// Mock strapi global
global.strapi = {
  log: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
  plugin: jest.fn(() => ({
    config: jest.fn(),
  })),
  requestContext: {
    get: jest.fn(),
  },
} as any;
