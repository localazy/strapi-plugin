import RequestInitiatorHelper from '../request-initiator-helper';
import type { Core } from '@strapi/strapi';

describe('RequestInitiatorHelper', () => {
  let mockStrapi: Partial<Core.Strapi>;

  beforeEach(() => {
    mockStrapi = {
      requestContext: {
        get: jest.fn().mockReturnValue({
          headers: {},
        }),
        run: jest.fn(),
      },
    } as Partial<Core.Strapi>;
  });

  describe('isInitiatedByLocalazyWebhook', () => {
    it('should return true when Localazy webhook headers are present', () => {
      (mockStrapi.requestContext.get as jest.Mock).mockReturnValue({
        headers: {
          'x-localazy-hmac': 'some-hmac',
          'x-localazy-timestamp': '123456789',
        },
      });
      const helper = new RequestInitiatorHelper(mockStrapi as Core.Strapi);
      expect(helper.isInitiatedByLocalazyWebhook()).toBe(true);
    });

    it('should return false when Localazy webhook headers are missing', () => {
      (mockStrapi.requestContext.get as jest.Mock).mockReturnValue({
        headers: {},
      });

      const helper = new RequestInitiatorHelper(mockStrapi as Core.Strapi);
      expect(helper.isInitiatedByLocalazyWebhook()).toBe(false);
    });

    it('should return false when context is undefined', () => {
      (mockStrapi.requestContext.get as jest.Mock).mockReturnValue(undefined);

      const helper = new RequestInitiatorHelper(mockStrapi as Core.Strapi);
      expect(helper.isInitiatedByLocalazyWebhook()).toBe(false);
    });
  });

  describe('isInitiatedByLocalazyPluginUI', () => {
    it('should return true when initiated by plugin UI', () => {
      (mockStrapi.requestContext.get as jest.Mock).mockReturnValue({
        headers: {
          'x-localazy-initiated-by': 'strapi-plugin-localazy',
        },
      });

      const helper = new RequestInitiatorHelper(mockStrapi as Core.Strapi);
      expect(helper.isInitiatedByLocalazyPluginUI()).toBe(true);
    });

    it('should return false when not initiated by plugin UI', () => {
      (mockStrapi.requestContext.get as jest.Mock).mockReturnValue({
        headers: {
          'x-localazy-initiated-by': 'something-else',
        },
      });

      const helper = new RequestInitiatorHelper(mockStrapi as Core.Strapi);
      expect(helper.isInitiatedByLocalazyPluginUI()).toBe(false);
    });

    it('should return false when header is missing', () => {
      (mockStrapi.requestContext.get as jest.Mock).mockReturnValue({
        headers: {},
      });

      const helper = new RequestInitiatorHelper(mockStrapi as Core.Strapi);
      expect(helper.isInitiatedByLocalazyPluginUI()).toBe(false);
    });

    it('should return false when context is undefined', () => {
      (mockStrapi.requestContext.get as jest.Mock).mockReturnValue(undefined);

      const helper = new RequestInitiatorHelper(mockStrapi as Core.Strapi);
      expect(helper.isInitiatedByLocalazyPluginUI()).toBe(false);
    });
  });
});
