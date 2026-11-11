import { set } from 'lodash-es';
import { findSetupModelByCollectionUid } from './transfer-setup-utils';
import {
  locateDownloadedField,
  ShouldSetDownloadedPropertyReturnType,
} from '../functions/should-set-downloaded-property';
import { createJsonFieldsDownloadAccumulator } from './json-fields-download-accumulator';

export type DownloadedLocalazyKey = {
  id: string;
  key: string[];
  value: unknown;
  event?: number;
};

export type DownloadedKeySource = { lang: string; id: string; event: number | undefined };

/** `{ [isoStrapi]: { [uid]: { [documentId]: translatedModel } } }` */
export type ParsedLocalazyContent = Record<string, Record<string, Record<string, any>>>;

type ParseLocalazyKey = (key: string) => { uid: string; id: string; rest: string[] };

/**
 * Turns the keys downloaded from Localazy into one translated model per Strapi entry and locale,
 * and records which keys changed for each entry (so they can be marked processed once the entry
 * is written).
 *
 * With a sync cursor (`processedKeys`), only entries with at least one key changed since it was
 * last processed are taken, but each of them with all of its keys: an incremental download
 * rewrites a changed entry exactly as a full sync would. Applying the changed keys alone is not
 * enough, because a json/blocks field is rebuilt from all of its leaves and list items are placed
 * by the source entry, so a partial set of keys would put source-language text or wrong items into
 * everything that did not change.
 */
export const collectDownloadedContent = ({
  languages,
  processedKeys,
  contentTransferSetup,
  models,
  parseLocalazyKey,
}: {
  languages: Array<{ isoStrapi: string; keys: DownloadedLocalazyKey[] }>;
  processedKeys: Record<string, Record<string, number>>;
  contentTransferSetup: any;
  models: any[];
  parseLocalazyKey: ParseLocalazyKey;
}) => {
  const parsedLocalazyContent: ParsedLocalazyContent = {};
  const entryKeySourceMap: Record<string, DownloadedKeySource[]> = {};
  const jsonFieldsAccumulator = createJsonFieldsDownloadAccumulator();

  for (const { isoStrapi, keys } of languages) {
    const parsedKeys = keys.map((localazyEntry) => {
      const storedEvent = processedKeys[isoStrapi]?.[localazyEntry.id];
      const isChanged = !(
        storedEvent !== undefined &&
        localazyEntry.event !== undefined &&
        localazyEntry.event <= storedEvent
      );
      const parsedKey = parseLocalazyKey(localazyEntry.key[0]);
      return { localazyEntry, parsedKey, isChanged, entryKey: `${isoStrapi}:${parsedKey.uid}:${parsedKey.id}` };
    });

    for (const { localazyEntry, entryKey, isChanged } of parsedKeys) {
      if (isChanged) {
        if (!entryKeySourceMap[entryKey]) {
          entryKeySourceMap[entryKey] = [];
        }
        entryKeySourceMap[entryKey].push({ lang: isoStrapi, id: localazyEntry.id, event: localazyEntry.event });
      }
    }

    for (const { localazyEntry, parsedKey, entryKey } of parsedKeys) {
      if (!entryKeySourceMap[entryKey]) {
        continue; // nothing changed in this entry
      }

      const modelContentTransferSetup = findSetupModelByCollectionUid(contentTransferSetup, models, parsedKey.uid);
      if (typeof modelContentTransferSetup === 'undefined') {
        continue;
      }

      const { type, fieldSegmentIndex } = locateDownloadedField(modelContentTransferSetup, parsedKey.rest);
      if (type === ShouldSetDownloadedPropertyReturnType.JSON) {
        // before the field's own segment: path to the owning entry/component; after it: the
        // leaf's path inside the field's value
        jsonFieldsAccumulator.add(
          [isoStrapi, parsedKey.uid, parsedKey.id, ...parsedKey.rest.slice(0, fieldSegmentIndex + 1)],
          parsedKey.rest.slice(fieldSegmentIndex + 1),
          localazyEntry.value
        );
      } else if (type === ShouldSetDownloadedPropertyReturnType.YES) {
        set(parsedLocalazyContent, [isoStrapi, parsedKey.uid, parsedKey.id, ...parsedKey.rest], localazyEntry.value);
      }
    }
  }

  jsonFieldsAccumulator.applyTo(parsedLocalazyContent);

  return { parsedLocalazyContent, entryKeySourceMap };
};
