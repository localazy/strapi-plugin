export const KEY = 'sync-cursor';

/**
 * Per-language map of Localazy key ID to the last successfully processed event number.
 * Structure: { [langCode]: { [keyId]: eventNumber } }
 */
export type SyncCursor = {
  processedKeys: Record<string, Record<string, number>>;
};

export const emptySyncCursor: SyncCursor = {
  processedKeys: {},
};
