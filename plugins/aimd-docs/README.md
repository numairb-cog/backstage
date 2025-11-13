# @internal/plugin-aimd-docs

A Backstage plugin that helps represent AIMD (AI Markdown Documentation) entities in the frontend.

## Installation

```bash
yarn add @internal/plugin-aimd-docs
```

## Usage

### Adding the Explorer Page

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

### Adding to Entity Pages

Add the AIMD definition card to entity pages:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityAimdDefinitionCard,
  isAimdAvailable,
} from '@internal/plugin-aimd-docs';

const aimdEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EntityAimdDefinitionCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

// In your EntityPage component
const entityPage = (
  <EntitySwitch>
    {/* ... other entity cases */}
    <EntitySwitch.Case if={isAimdAvailable}>{aimdEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
```

## Features

- **AIMD Explorer Page**: Browse all AIMD documentation entities in your catalog
- **Markdown Rendering**: Display markdown content with proper formatting and styling
- **Raw View**: View the raw markdown source with syntax highlighting
- **Entity Integration**: Seamlessly integrate AIMD entities into your entity pages

## Components

### AimdExplorerPage

A page component for browsing all AIMD entities in the catalog.

### EntityAimdDefinitionCard

A card component that displays the AIMD entity's markdown content with tabs for rendered and raw views.

### MarkdownDefinitionWidget

A widget component that renders markdown content with proper styling.

### isAimdAvailable

A helper function to check if an entity is an AIMD entity, useful for conditional rendering in entity pages.
