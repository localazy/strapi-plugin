import { createStrapiApiAxiosInstance } from '../../@common/api/strapi-api-base';

const BASE_PATH = '/entry-exclusion';
const axiosInstance = createStrapiApiAxiosInstance();

export default class EntryExclusionService {
  /**
   * Get entry exclusion state for a specific entry
   */
  static async getEntryExclusion(contentType: string, documentId: string): Promise<boolean> {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/${contentType}/${documentId}`);
      return result.data.isExcluded;
    } catch (error) {
      console.error('Error getting entry exclusion:', error);
      throw error;
    }
  }

  /**
   * Set entry exclusion state for a specific entry
   */
  static async setEntryExclusion(contentType: string, documentId: string, isExcluded: boolean): Promise<boolean> {
    try {
      const result = await axiosInstance.put(`${BASE_PATH}/${contentType}/${documentId}`, {
        isExcluded,
      });
      return result.data.isExcluded;
    } catch (error) {
      console.error('Error setting entry exclusion:', error);
      throw error;
    }
  }

  /**
   * Set exclusion state for multiple entries
   */
  static async setMultipleEntriesExclusion(
    contentType: string,
    documentIds: string[],
    isExcluded: boolean
  ): Promise<void> {
    try {
      for (let i = 0; i < documentIds.length; i++) {
        const docId = documentIds[i];
        await this.setEntryExclusion(contentType, docId, isExcluded);
      }
    } catch (error) {
      console.error('Error setting multiple entries exclusion:', error);
      throw error;
    }
  }

  /**
   * Get all excluded entries for a content type
   */
  static async getContentTypeExclusions(contentType: string): Promise<string[]> {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/${contentType}`);
      return result.data.excludedIds;
    } catch (error) {
      console.error('Error getting content type exclusions:', error);
      throw error;
    }
  }
}
