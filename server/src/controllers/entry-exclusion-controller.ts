import { Core } from '@strapi/strapi';
import { getEntryExclusionService } from '../core';

const EntryExclusionController = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Get entry exclusion state
   * GET /entry-exclusion/:contentType/:documentId
   */
  async getEntryExclusion(ctx) {
    const { contentType, documentId } = ctx.params;

    if (!contentType || !documentId) {
      return ctx.badRequest('Content type and document ID are required');
    }

    try {
      const isExcluded = await getEntryExclusionService().getEntryExclusion(contentType, documentId);
      ctx.body = { isExcluded };
    } catch (error) {
      strapi.log.error('Error getting entry exclusion:', error);
      return ctx.internalServerError('Failed to get entry exclusion state');
    }
  },

  /**
   * Set entry exclusion state
   * PUT /entry-exclusion/:contentType/:documentId
   */
  async setEntryExclusion(ctx) {
    const { contentType, documentId } = ctx.params;
    const { isExcluded } = ctx.request.body;

    if (!contentType || !documentId) {
      return ctx.badRequest('Content type and document ID are required');
    }

    if (typeof isExcluded !== 'boolean') {
      return ctx.badRequest('isExcluded must be a boolean value');
    }

    try {
      await getEntryExclusionService().setEntryExclusion(contentType, documentId, isExcluded);
      ctx.body = { success: true, isExcluded };
    } catch (error) {
      strapi.log.error('Error setting entry exclusion:', error);
      return ctx.internalServerError('Failed to set entry exclusion state');
    }
  },

  /**
   * Get all excluded entries for a content type
   * GET /entry-exclusion/:contentType
   */
  async getContentTypeExclusions(ctx) {
    const { contentType } = ctx.params;

    if (!contentType) {
      return ctx.badRequest('Content type is required');
    }

    try {
      const excludedIds = await getEntryExclusionService().getContentTypeExclusions(contentType);
      ctx.body = { excludedIds };
    } catch (error) {
      strapi.log.error('Error getting content type exclusions:', error);
      return ctx.internalServerError('Failed to get content type exclusions');
    }
  },
});

export default EntryExclusionController;
