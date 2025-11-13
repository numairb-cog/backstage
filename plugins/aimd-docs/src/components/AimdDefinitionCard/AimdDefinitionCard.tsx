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

import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import Alert from '@material-ui/lab/Alert';
import { CardTab, TabbedCard, CodeSnippet } from '@backstage/core-components';
import { AimdEntityV1alpha1 } from '@internal/plugin-aimd-common';
import { MarkdownDefinitionWidget } from '../MarkdownDefinitionWidget';

/** @public */
export const AimdDefinitionCard = () => {
  const { entity } = useEntity<AimdEntityV1alpha1>();

  if (!entity) {
    return <Alert severity="error">Could not fetch the AIMD entity</Alert>;
  }

  const entityTitle = entity.metadata.title ?? entity.metadata.name;

  return (
    <TabbedCard title={entityTitle}>
      <CardTab label="Rendered" key="rendered">
        <MarkdownDefinitionWidget definition={entity.spec.definition} />
      </CardTab>
      <CardTab label="Raw" key="raw">
        <CodeSnippet
          text={entity.spec.definition}
          language="markdown"
          showCopyCodeButton
        />
      </CardTab>
    </TabbedCard>
  );
};
