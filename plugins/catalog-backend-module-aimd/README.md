# @internal/plugin-catalog-backend-module-aimd

Adds support for the AIMD specific entity model (e.g. the Aimd kind) to the catalog backend plugin.

## Installation

```bash
yarn add @internal/plugin-catalog-backend-module-aimd
```

## Usage

Add the module to your backend:

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@internal/plugin-catalog-backend-module-aimd'));
backend.start();
```

This will register the AIMD entity processor with the catalog backend, enabling support for the Aimd entity kind.
