/**
 * Split a Localazy key produced by the upload (`flattenObject`) into the content type uid, the
 * document id and the remaining path segments, e.g.
 * `api::page.page[doc].sections[3;sections.timeline].stops[11].label` →
 * `{ uid: 'api::page.page', id: 'doc', rest: ['sections', '3;sections.timeline', 'stops', '11', 'label'] }`.
 */
export const parseLocalazyKey = (key: string) => {
  const split = key.split(/\.(?![^[]*])|\[|\]/);
  const filteredSplit = split.filter((item) => item !== '');

  return {
    uid: `${filteredSplit[0]}.${filteredSplit[1]}`,
    id: filteredSplit[2],
    rest: filteredSplit.slice(3),
  };
};
