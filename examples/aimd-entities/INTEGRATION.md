# AIMD Plugin Integration Guide

This guide explains how to integrate the AIMD (AI Markdown Documentation) plugin system into your Backstage instance.

## Overview

The AIMD plugin system consists of three packages:

1. **@internal/plugin-aimd-common** - Entity definition and validation
2. **@internal/plugin-catalog-backend-module-aimd** - Backend processor for AIMD entities
3. **@internal/plugin-aimd-docs** - Frontend plugin for displaying AIMD entities

## Installation

### 1. Install Dependencies

Add the packages to your Backstage instance:

```bash
# From the root of your Backstage repository
yarn workspace app add @internal/plugin-aimd-docs
yarn workspace backend add @internal/plugin-catalog-backend-module-aimd
```

### 2. Register Backend Module

Add the AIMD backend module to your backend:

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ... other plugins
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@internal/plugin-catalog-backend-module-aimd'));

backend.start();
```

This registers the AIMD entity processor with the catalog backend, enabling support for the Aimd entity kind.

### 3. Add Frontend Routes

Add the AIMD explorer page to your app routes:

```tsx
// packages/app/src/App.tsx
import { AimdExplorerPage } from '@internal/plugin-aimd-docs';

const routes = (
  <FlatRoutes>
    {/* ... other routes */}
    <Route path="/aimd-docs" element={<AimdExplorerPage />} />
  </FlatRoutes>
);
```

### 4. Add to Entity Pages

Integrate AIMD entities into your entity pages:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityAimdDefinitionCard,
  isAimdAvailable,
} from '@internal/plugin-aimd-docs';
import { EntityLayout } from '@backstage/plugin-catalog';
import { Grid } from '@material-ui/core';

// Create a dedicated page for AIMD entities
const aimdEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item xs={12}>
          <EntityAimdDefinitionCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

// Add to your EntityPage component
const entityPage = (
  <EntitySwitch>
    {/* ... other entity cases */}
    <EntitySwitch.Case if={isAimdAvailable}>{aimdEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
```

### 5. Add Navigation Link (Optional)

Add a link to the AIMD explorer in your sidebar:

```tsx
// packages/app/src/components/Root/Root.tsx
import MenuBookIcon from '@material-ui/icons/MenuBook';

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      {/* ... other items */}
      <SidebarItem icon={MenuBookIcon} to="aimd-docs" text="Documentation" />
    </Sidebar>
    {children}
  </SidebarPage>
);
```

## Creating AIMD Entities

### Basic AIMD Entity

Create a YAML file for your AIMD entity:

```yaml
apiVersion: yourcompany.io/v1alpha1
kind: Aimd
metadata:
  name: user-guide
  description: User guide documentation
  labels:
    category: documentation
spec:
  type: markdown
  lifecycle: production
  owner: documentation-team
  system: docs-portal
  definition:
    $text: ./user-guide.md
```

### Inline Markdown

You can also define markdown content inline:

```yaml
apiVersion: yourcompany.io/v1alpha1
kind: Aimd
metadata:
  name: quick-start
  description: Quick start guide
spec:
  type: markdown
  lifecycle: production
  owner: platform-team
  definition: |
    # Quick Start Guide

    Welcome to our platform!

    ## Getting Started

    1. Sign in
    2. Explore the catalog
    3. Create your first service
```

### Entity Fields

- **apiVersion**: Must be `yourcompany.io/v1alpha1`
- **kind**: Must be `Aimd`
- **metadata.name**: Unique identifier for the entity
- **metadata.description**: Human-readable description
- **spec.type**: Type of documentation (typically `markdown`)
- **spec.lifecycle**: Lifecycle stage (e.g., `experimental`, `production`, `deprecated`)
- **spec.owner**: Entity reference to the owner (user or group)
- **spec.definition**: Markdown content (inline or via `$text` substitution)
- **spec.system** (optional): Entity reference to the parent system

## Entity Discovery

AIMD entities are discovered through the same catalog locations as other entities:

### Static Location

```yaml
# app-config.yaml
catalog:
  locations:
    - type: file
      target: ../../examples/aimd-entities/user-guide.yaml
```

### GitHub Integration

```yaml
# app-config.yaml
catalog:
  locations:
    - type: url
      target: https://github.com/your-org/your-repo/blob/main/catalog-info.yaml
      rules:
        - allow: [Aimd]
```

### GitHub Discovery

```yaml
# app-config.yaml
catalog:
  providers:
    github:
      yourOrg:
        organization: 'your-org'
        catalogPath: '/catalog-info.yaml'
        filters:
          branch: 'main'
          repository: '.*'
```

## Features

### Markdown Rendering

The AIMD plugin renders markdown with support for:

- Headings (H1-H6)
- Paragraphs and line breaks
- **Bold** and _italic_ text
- Code blocks with syntax highlighting
- Inline `code`
- Lists (ordered and unordered)
- Blockquotes
- Tables
- Links and images

### Tabbed View

The AIMD definition card provides two tabs:

1. **Rendered**: Displays the formatted markdown
2. **Raw**: Shows the raw markdown source with syntax highlighting

### Entity Relations

AIMD entities support standard Backstage relations:

- **ownedBy**: Links to the owner (user or group)
- **ownerOf**: Reverse relation from owner to AIMD
- **partOf**: Links to the parent system
- **hasPart**: Reverse relation from system to AIMD

## Best Practices

### Organization

- Group related documentation by system
- Use consistent naming conventions
- Add descriptive labels for categorization

### Content

- Keep documentation up to date
- Use clear, concise language
- Include examples and code snippets
- Add links to related resources

### Ownership

- Assign clear ownership to teams or individuals
- Review and update documentation regularly
- Use lifecycle stages to indicate documentation status

## Troubleshooting

### Entity Not Appearing

1. Check that the backend module is registered
2. Verify the entity YAML syntax
3. Check catalog processing logs for errors
4. Ensure the entity location is configured

### Markdown Not Rendering

1. Verify the markdown syntax
2. Check for special characters that need escaping
3. Ensure the definition field contains valid markdown

### Relations Not Working

1. Verify owner and system references exist
2. Check entity reference format (e.g., `group:default/team-name`)
3. Ensure referenced entities are in the catalog

## Examples

See the `examples/aimd-entities/` directory for complete examples:

- `user-guide.yaml` - Documentation with external markdown file
- `api-guidelines.yaml` - Documentation with inline markdown

## Support

For issues or questions:

- Check the plugin README files
- Review Backstage documentation on extending the catalog
- Contact the platform team
