/*
 * Copyright 2025 The Backstage Authors
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

import React, { useEffect, useState } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { AimdEntityV1alpha1 } from '@backstage/catalog-model';
import {
  InfoCard,
  Progress,
  MarkdownContent,
} from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';

export const AimdContent = () => {
  const { entity } = useEntity<AimdEntityV1alpha1>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const definition = entity.spec.definition;

        if (
          definition.startsWith('http://') ||
          definition.startsWith('https://')
        ) {
          const response = await fetch(definition);
          if (!response.ok) {
            throw new Error(`Failed to fetch markdown: ${response.statusText}`);
          }
          const text = await response.text();
          setContent(text);
        } else if (definition.startsWith('file://')) {
          setError(
            'Local file references are not yet supported. Please use a URL or inline content.',
          );
        } else {
          setContent(definition);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load markdown content',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [entity]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <InfoCard title="Markdown Documentation">
      <MarkdownContent content={content} />
    </InfoCard>
  );
};
