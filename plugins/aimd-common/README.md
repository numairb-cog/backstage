# @internal/plugin-aimd-common

Common functionalities for the AIMD plugin, defining the AIMD entity kind.

This package provides the entity definition and validation for the AIMD (AI Markdown Documentation) kind, which allows markdown documentation to be represented as catalog entities in Backstage.

## Installation

```bash
yarn add @internal/plugin-aimd-common
```

## Usage

```typescript
import {
  AimdEntityV1alpha1,
  aimdEntityV1alpha1Validator,
} from '@internal/plugin-aimd-common';
```

## Entity Definition

The AIMD entity follows this structure:

```yaml
apiVersion: yourcompany.io/v1alpha1
kind: Aimd
metadata:
  name: my-documentation
  description: Important documentation
spec:
  type: markdown
  lifecycle: production
  owner: documentation-team
  system: docs-portal
  definition:
    $text: ./documentation.md
```
