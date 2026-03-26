# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@localazy/strapi-plugin` — the official Strapi v5 plugin by Localazy for managing multilingual content. It connects a Strapi CMS instance to the Localazy localization platform, enabling upload/download of translatable content.

## Commands

```bash
npm run build              # Build the plugin (uses strapi-plugin CLI)
npm run lint               # ESLint (flat config, eslint.config.mjs)
npm run lint:fix           # ESLint with auto-fix
npm run format:check       # Prettier check
npm run format             # Prettier write
npm run test:server        # Run server-side Jest tests
npm run test:server:watch  # Jest in watch mode
npm run test:server:coverage  # Jest with coverage
npm run verify             # Strapi plugin verification
```

Run a single test file:

```bash
npx jest --config server/jest.config.ts server/src/utils/__tests__/<file>.test.ts
```

Node version: specified in `.nvmrc` (currently 20).

## Architecture

The plugin follows the standard Strapi v5 plugin structure with two main entry points:

### `server/src/` — Backend (Node.js, CommonJS)

- **`index.ts`** — Exports the plugin's server-side API: `register`, `bootstrap`, `destroy`, config, controllers, routes, services, content-types, policies, middlewares.
- **`services/`** — Core business logic:
  - `localazy-transfer-upload-service.ts` / `localazy-transfer-download-service.ts` — Content transfer to/from Localazy
  - `localazy-upload-service.ts` — Upload orchestration
  - `localazy-pubapi-service.ts` — Localazy public API client
  - `localazy-user-service.ts` — User management
  - `strapi-service.ts` / `strapi-i18n-service.ts` / `strapi-localazy-i18n-service.ts` — Strapi data access and i18n integration
  - `plugin-settings-service.ts` — Plugin configuration persistence
  - `entry-exclusion-service.ts` — Entry-level exclusion from translation
- **`controllers/`** — REST endpoints (auth, transfer, project, user, settings, strapi info, entry exclusion)
- **`routes/`** — Route definitions; includes both admin-authenticated and public transfer routes
- **`core/`** — Internal framework helpers
- **`utils/`** — Shared utilities; **all server tests live in `utils/__tests__/`**
- **`models/`**, **`functions/`**, **`db/`** — Data models, helper functions, database operations
- **`lifecycles/`** — Strapi content-type lifecycle hooks

### `admin/src/` — Frontend (React + TypeScript)

- **`pages/`** — Top-level page components: Login, Overview, Upload, Download, GlobalSettings, ContentTransferSetup, etc.
- **`modules/`** — Feature modules organized by domain: `login/`, `overview/`, `localazy-upload/`, `localazy-download/`, `plugin-settings/`, `entry-exclusion/`, `alerts/`, `strapi/`, `user/`, `@common/`
- **`state/`** — Global state management (uses `react-hooks-global-state`)
- **`translations/`** — i18n strings
- **`plugins/`** — Plugin-level React integrations

### `install/` — Post-install CLI (`npx @localazy/strapi-plugin`)

Guides users through bundler config setup (Vite/Webpack examples).

## Testing

Tests use **Jest** with **ts-jest**. Only server-side utils are tested (in `server/src/utils/__tests__/`). The Jest config maps `@/` to `server/src/` and aliases `lodash-es` to `lodash` for CommonJS compatibility.

## Key Dependencies

- `@localazy/api-client` and `@localazy/generic-connector-client` — Localazy platform API integration
- `ws` / `socket.io` — WebSocket support for real-time transfer progress
- `lodash-es` (aliased to `lodash` in tests) — Utility functions
- Strapi v5 peer dependencies (`@strapi/strapi ^5.6.0`, `@strapi/design-system`, `@strapi/icons`)

## CI

QA workflow (`.github/workflows/qa.yml`) runs on PRs to `main`: install, build, verify, and server tests.
