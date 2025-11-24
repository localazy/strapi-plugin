import { Core } from '@strapi/strapi';
import getStrapiStore from '../db/model/utils/get-strapi-store';

const ENTRY_EXCLUSION_KEY = 'localazy-entry-exclusions';

type EntryExclusion = {
  contentType: string;
  documentId: string;
  excludeFromTranslation: boolean;
};

type EntryExclusionData = {
  [key: string]: EntryExclusion;
};

const EntryExclusionService = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Generate a unique key for an entry based on contentType and documentId
   */
  getEntryKey(contentType: string, documentId: string): string {
    return `${contentType}:${documentId}`;
  },

  /**
   * Get entry exclusion state for a specific entry
   */
  async getEntryExclusion(contentType: string, documentId: string): Promise<boolean> {
    const pluginStore = getStrapiStore(strapi);
    const exclusions = ((await pluginStore.get({ key: ENTRY_EXCLUSION_KEY })) as EntryExclusionData) || {};

    const entryKey = this.getEntryKey(contentType, documentId);
    const exclusion = exclusions[entryKey];

    return exclusion?.excludeFromTranslation || false;
  },

  /**
   * Set entry exclusion state for a specific entry
   */
  async setEntryExclusion(contentType: string, documentId: string, excludeFromTranslation: boolean): Promise<void> {
    const pluginStore = getStrapiStore(strapi);
    const exclusions = ((await pluginStore.get({ key: ENTRY_EXCLUSION_KEY })) as EntryExclusionData) || {};

    const entryKey = this.getEntryKey(contentType, documentId);

    if (excludeFromTranslation) {
      exclusions[entryKey] = {
        contentType,
        documentId,
        excludeFromTranslation: true,
      };
    } else {
      // Remove the entry if it's not excluded (default behavior)
      delete exclusions[entryKey];
    }

    await pluginStore.set({
      key: ENTRY_EXCLUSION_KEY,
      value: exclusions,
    });
  },

  /**
   * Get all exclusions for a specific content type
   */
  async getContentTypeExclusions(contentType: string): Promise<string[]> {
    const pluginStore = getStrapiStore(strapi);
    const exclusions = ((await pluginStore.get({ key: ENTRY_EXCLUSION_KEY })) as EntryExclusionData) || {};

    return Object.values(exclusions)
      .filter((exclusion) => exclusion.contentType === contentType && exclusion.excludeFromTranslation)
      .map((exclusion) => exclusion.documentId);
  },
});

export type EntryExclusionServiceReturnType = ReturnType<typeof EntryExclusionService>;

export default EntryExclusionService;
