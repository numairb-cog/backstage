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
import { InfoCard, Progress } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  markdown: {
    '& pre': {
      backgroundColor: theme.palette.type === 'dark' ? '#1e1e1e' : '#f5f5f5',
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      overflow: 'auto',
    },
    '& code': {
      fontFamily: 'monospace',
      fontSize: '0.9em',
    },
    '& table': {
      borderCollapse: 'collapse',
      width: '100%',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    '& th, & td': {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      textAlign: 'left',
    },
    '& th': {
      backgroundColor: theme.palette.type === 'dark' ? '#2d2d2d' : '#e0e0e0',
      fontWeight: 'bold',
    },
  },
}));

export const AimdContent = () => {
  const classes = useStyles();
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
      <div className={classes.markdown}>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {content}
        </pre>
      </div>
    </InfoCard>
  );
};
