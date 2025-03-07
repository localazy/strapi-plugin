## 1.0.0-beta.0 (2025-03-07)
### 🔀 Pull Requests

- [Fix webhook secret fetch 2 #76](https://github.com/localazy/strapi-plugin/pull/76)
- [edit-gh-workflow #73](https://github.com/localazy/strapi-plugin/pull/73)
- [Add config #71](https://github.com/localazy/strapi-plugin/pull/71)
- [Strapi v5 migration #70](https://github.com/localazy/strapi-plugin/pull/70)

### 💥 Breaking Changes

- refactor to Documents Service API ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))

### ✨ Features

- **download:** base scope ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **download:** populate ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **lifecycles:** beforeDelete deprecation ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **notifications:** wss notifications ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **overview:** page implementation ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **plugin:** add CLI installation script and dependencies ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **populate:** upload/download optimizations ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **relations:** rework assigning for v5 ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **triggers:** re-implementation for v5 ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **upload:** optimize upload process ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **upload:** upload to Localazy ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))

### 🐛 Bug Fixes

- **webhook:** simplify secret retrieval from Localazy API ([97f1fe6](https://github.com/localazy/strapi-plugin/commit/97f1fe6)) ([#76](https://github.com/localazy/strapi-plugin/pull/76))
- **model:** return components models as well ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **navigation:** prevent whole page reload ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **navigation:** redirect after login ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **upload:** document identifier ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **upload:** dynamic zones identifiers ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))

### 📚 Documentation

- update README with comprehensive Strapi plugin installation and configuration guide ([247d36c](https://github.com/localazy/strapi-plugin/commit/247d36c)) ([#71](https://github.com/localazy/strapi-plugin/pull/71))

### 🧪 Tests

- add tests for server utils (WIP) ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))

### 🧰 Other Commits

- **ci:** simplify release workflow by removing verification job ([2a13587](https://github.com/localazy/strapi-plugin/commit/2a13587)) ([#73](https://github.com/localazy/strapi-plugin/pull/73))
- **ci:** add verification job to release workflow ([247d36c](https://github.com/localazy/strapi-plugin/commit/247d36c)) ([#71](https://github.com/localazy/strapi-plugin/pull/71))
- **ci:** enhance QA workflow with build and verification steps ([247d36c](https://github.com/localazy/strapi-plugin/commit/247d36c)) ([#71](https://github.com/localazy/strapi-plugin/pull/71))
- add GH actions ([247d36c](https://github.com/localazy/strapi-plugin/commit/247d36c)) ([#71](https://github.com/localazy/strapi-plugin/pull/71))
- remove unnecessary module.exports ([247d36c](https://github.com/localazy/strapi-plugin/commit/247d36c)) ([#71](https://github.com/localazy/strapi-plugin/pull/71))
- **Tree:** margin ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **codebase:** lint and prettier ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **nav:** formatting ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **services:** retrieval shortcut ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **tree:** content-type switch positioning ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **utils:** improve key extraction with Reflect.ownKeys() ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- **utils:** improve language display name handling ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- clean up package dependencies ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- fix Localazy icon ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- implement dark mode support ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- improve types ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- improve typings ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- remove dead code ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- remove extra code ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))
- update package metadata and plugin configuration ([7c8dae1](https://github.com/localazy/strapi-plugin/commit/7c8dae1)) ([#70](https://github.com/localazy/strapi-plugin/pull/70))

## 0.2.13 (2025-03-03)
### 🔀 Pull Requests

- [Fix webhook secret fetch 2 #76](https://github.com/localazy/strapi-plugin/pull/76)

### 🐛 Bug Fixes

- **webhook:** simplify secret retrieval from Localazy API ([97f1fe6](https://github.com/localazy/strapi-plugin/commit/97f1fe6)) ([#76](https://github.com/localazy/strapi-plugin/pull/76))

## 0.2.12 (2024-11-14)
### 🔀 Pull Requests

- [Feat add json fields support #65](https://github.com/localazy/strapi-plugin/pull/65)

### ✨ Features

- add json fields support ([5ef1f08](https://github.com/localazy/strapi-plugin/commit/5ef1f08)) ([#65](https://github.com/localazy/strapi-plugin/pull/65))

### 🐛 Bug Fixes

- **JSON:** `null` values upload ([5ef1f08](https://github.com/localazy/strapi-plugin/commit/5ef1f08)) ([#65](https://github.com/localazy/strapi-plugin/pull/65))
- doubled backslashed in URL ([5ef1f08](https://github.com/localazy/strapi-plugin/commit/5ef1f08)) ([#65](https://github.com/localazy/strapi-plugin/pull/65))
- string array is split into letters ([5ef1f08](https://github.com/localazy/strapi-plugin/commit/5ef1f08)) ([#65](https://github.com/localazy/strapi-plugin/pull/65))

## 0.2.11 (2024-11-14)
### 🔀 Pull Requests

- [Feat add json fields support #65](https://github.com/localazy/strapi-plugin/pull/65)

### ✨ Features

- add json fields support ([5ef1f08](https://github.com/localazy/strapi-plugin/commit/5ef1f08)) ([#65](https://github.com/localazy/strapi-plugin/pull/65))

### 🐛 Bug Fixes

- **JSON:** `null` values upload ([5ef1f08](https://github.com/localazy/strapi-plugin/commit/5ef1f08)) ([#65](https://github.com/localazy/strapi-plugin/pull/65))
- doubled backslashed in URL ([5ef1f08](https://github.com/localazy/strapi-plugin/commit/5ef1f08)) ([#65](https://github.com/localazy/strapi-plugin/pull/65))
- string array is split into letters ([5ef1f08](https://github.com/localazy/strapi-plugin/commit/5ef1f08)) ([#65](https://github.com/localazy/strapi-plugin/pull/65))

## 0.2.10 (2024-09-05)

### 🧰 Other Commits

- **QA:** switch to Node 20 in GH actions ([8ce744a](https://github.com/localazy/strapi-plugin/commit/8ce744a))
- **release:** switch to Node 20 in GH actions ([1760ff8](https://github.com/localazy/strapi-plugin/commit/1760ff8))
- add support for Node 20 ([041c0af](https://github.com/localazy/strapi-plugin/commit/041c0af))
- support Node 20 ([883c3ef](https://github.com/localazy/strapi-plugin/commit/883c3ef))

## 0.2.9 (2024-08-06)

## 0.2.8 (2024-08-06)

## 0.2.7 (2024-08-06)

## <small>0.2.6 (2024-05-09)</small>

* 🔧 conf: update .nvmrc node version to v18 ([78f1e4a](https://github.com/localazy/strapi-plugin/commit/78f1e4a))
* 0.2.3 ([70566df](https://github.com/localazy/strapi-plugin/commit/70566df))
* 0.2.4 (#49) ([17f864c](https://github.com/localazy/strapi-plugin/commit/17f864c)), closes [#49](https://github.com/localazy/strapi-plugin/issues/49)
* Add release CI (#52) ([770ea8a](https://github.com/localazy/strapi-plugin/commit/770ea8a)), closes [#52](https://github.com/localazy/strapi-plugin/issues/52)
* Bump @strapi/strapi from 4.5.6 to 4.15.0 (#42) ([7c4f5f7](https://github.com/localazy/strapi-plugin/commit/7c4f5f7)), closes [#42](https://github.com/localazy/strapi-plugin/issues/42)
* Bump browserify-sign from 4.2.1 to 4.2.2 (#43) ([1e2900e](https://github.com/localazy/strapi-plugin/commit/1e2900e)), closes [#43](https://github.com/localazy/strapi-plugin/issues/43)
* Bump http-cache-semantics from 4.1.0 to 4.1.1 (#44) ([3abdd42](https://github.com/localazy/strapi-plugin/commit/3abdd42)), closes [#44](https://github.com/localazy/strapi-plugin/issues/44)
* LOC-1015 Strapi plugin does not work on certain versions (#48) ([5f55f1b](https://github.com/localazy/strapi-plugin/commit/5f55f1b)), closes [#48](https://github.com/localazy/strapi-plugin/issues/48)
* LOC-1056 - Add support for the unofficial CKEditor5 plugin (#50) ([dddaebc](https://github.com/localazy/strapi-plugin/commit/dddaebc)), closes [#50](https://github.com/localazy/strapi-plugin/issues/50)
* LOC-1096 -  Fix Analytics User Identification Within Integrations (#51) ([6000259](https://github.com/localazy/strapi-plugin/commit/6000259)), closes [#51](https://github.com/localazy/strapi-plugin/issues/51)


