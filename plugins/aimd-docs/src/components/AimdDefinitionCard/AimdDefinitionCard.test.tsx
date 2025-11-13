/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AimdDefinitionCard } from './AimdDefinitionCard';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { AimdEntityV1alpha1 } from '@internal/plugin-aimd-common';

describe('AimdDefinitionCard', () => {
  const mockEntity: AimdEntityV1alpha1 = {
    apiVersion: 'yourcompany.io/v1alpha1',
    kind: 'Aimd',
    metadata: {
      name: 'test-doc',
      description: 'Test documentation',
    },
    spec: {
      type: 'markdown',
      lifecycle: 'production',
      owner: 'team-a',
      definition: '# Test\n\nThis is a test document.',
    },
  };

  it('should render the entity title', () => {
    render(
      <EntityProvider entity={mockEntity}>
        <AimdDefinitionCard />
      </EntityProvider>,
    );

    expect(screen.getByText('test-doc')).toBeInTheDocument();
  });

  it('should render the entity title from metadata.title if available', () => {
    const entityWithTitle = {
      ...mockEntity,
      metadata: {
        ...mockEntity.metadata,
        title: 'Custom Title',
      },
    };

    render(
      <EntityProvider entity={entityWithTitle}>
        <AimdDefinitionCard />
      </EntityProvider>,
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('should render Rendered and Raw tabs', () => {
    render(
      <EntityProvider entity={mockEntity}>
        <AimdDefinitionCard />
      </EntityProvider>,
    );

    expect(screen.getByText('Rendered')).toBeInTheDocument();
    expect(screen.getByText('Raw')).toBeInTheDocument();
  });

  it('should render markdown content in the rendered tab', () => {
    render(
      <EntityProvider entity={mockEntity}>
        <AimdDefinitionCard />
      </EntityProvider>,
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('This is a test document.')).toBeInTheDocument();
  });
});
