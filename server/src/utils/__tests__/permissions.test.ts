import { LOCALAZY_RBAC_ACTIONS, PERMISSION_UIDS } from '../../constants/permissions';

describe('Localazy RBAC permission registry', () => {
  it('exposes a stable UID for each persona-level action', () => {
    // Renaming any of these UIDs is a breaking change for existing role grants.
    expect(PERMISSION_UIDS).toEqual({
      READ: 'plugin::localazy.read',
      TRANSFER: 'plugin::localazy.transfer',
      SETTINGS_READ: 'plugin::localazy.settings.read',
      SETTINGS_UPDATE: 'plugin::localazy.settings.update',
    });
  });

  it('snapshots the action records registered with admin::permission.actionProvider', () => {
    expect(LOCALAZY_RBAC_ACTIONS).toMatchInlineSnapshot(`
[
  {
    "displayName": "Read",
    "pluginName": "localazy",
    "section": "plugins",
    "subCategory": "General",
    "uid": "read",
  },
  {
    "displayName": "Transfer",
    "pluginName": "localazy",
    "section": "plugins",
    "subCategory": "General",
    "uid": "transfer",
  },
  {
    "displayName": "Read settings",
    "pluginName": "localazy",
    "section": "plugins",
    "subCategory": "Settings",
    "uid": "settings.read",
  },
  {
    "displayName": "Update settings",
    "pluginName": "localazy",
    "section": "plugins",
    "subCategory": "Settings",
    "uid": "settings.update",
  },
]
`);
  });

  it('declares every action under the localazy plugin namespace', () => {
    for (const action of LOCALAZY_RBAC_ACTIONS) {
      expect(action.pluginName).toBe('localazy');
      expect(action.section).toBe('plugins');
      expect(action.uid).not.toMatch(/^plugin::/);
    }
  });

  // Strapi's @strapi/admin yup schema rejects `category` on `plugins`-section
  // entries and registerMany() validates the full array up-front — a single
  // mis-shaped entry silently drops ALL of our permissions from the role editor.
  // Keeping every action in `plugins` (with `subCategory` for grouping, no
  // `category` field) sidesteps the rejection and keeps all four visible in the
  // Plugins tab of the role editor under "Localazy".
  it('matches the Strapi action-provider plugins-section invariants', () => {
    for (const action of LOCALAZY_RBAC_ACTIONS) {
      expect(action.section).toBe('plugins');
      expect(action).not.toHaveProperty('category');
      expect(action.subCategory).toBeTruthy();
    }
  });

  it('exposes one action record per persona UID', () => {
    const concreteUids = LOCALAZY_RBAC_ACTIONS.map((a) => `plugin::${a.pluginName}.${a.uid}`).sort();
    const expectedUids = Object.values(PERMISSION_UIDS).slice().sort();
    expect(concreteUids).toEqual(expectedUids);
  });
});
