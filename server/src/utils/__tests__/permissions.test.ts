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
    "category": "Localazy",
    "displayName": "Read",
    "pluginName": "localazy",
    "section": "plugins",
    "uid": "read",
  },
  {
    "category": "Localazy",
    "displayName": "Transfer",
    "pluginName": "localazy",
    "section": "plugins",
    "uid": "transfer",
  },
  {
    "category": "Localazy",
    "displayName": "Read",
    "pluginName": "localazy",
    "section": "settings",
    "subCategory": "Settings",
    "uid": "settings.read",
  },
  {
    "category": "Localazy",
    "displayName": "Update",
    "pluginName": "localazy",
    "section": "settings",
    "subCategory": "Settings",
    "uid": "settings.update",
  },
]
`);
  });

  it('declares every action under the localazy plugin namespace', () => {
    for (const action of LOCALAZY_RBAC_ACTIONS) {
      expect(action.pluginName).toBe('localazy');
      expect(action.section).toMatch(/^(plugins|settings)$/);
      expect(action.uid).not.toMatch(/^plugin::/);
    }
  });

  it('exposes one action record per persona UID', () => {
    const concreteUids = LOCALAZY_RBAC_ACTIONS.map((a) => `plugin::${a.pluginName}.${a.uid}`).sort();
    const expectedUids = Object.values(PERMISSION_UIDS).slice().sort();
    expect(concreteUids).toEqual(expectedUids);
  });
});
