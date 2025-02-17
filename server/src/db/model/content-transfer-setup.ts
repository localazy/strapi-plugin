import { ContentTransferSetup } from '../../models/plugin/content-transfer-setup';

const KEY = 'content-transfer-setup';

const emptyContentTransferSetup: ContentTransferSetup = {
  has_setup: false,
  setup: [],
};

export { KEY, emptyContentTransferSetup };
