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

import { rootRoute } from './routes';
import {
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

/** @public */
export const aimdDocsPlugin = createPlugin({
  id: 'aimd-docs',
  routes: {
    root: rootRoute,
  },
});

/** @public */
export const AimdExplorerPage = aimdDocsPlugin.provide(
  createRoutableExtension({
    name: 'AimdExplorerPage',
    component: () =>
      import('./components/AimdExplorerPage').then(m => m.AimdExplorerPage),
    mountPoint: rootRoute,
  }),
);

/** @public */
export const EntityAimdDefinitionCard = aimdDocsPlugin.provide(
  createComponentExtension({
    name: 'EntityAimdDefinitionCard',
    component: {
      lazy: () =>
        import('./components/AimdDefinitionCard').then(
          m => m.AimdDefinitionCard,
        ),
    },
  }),
);
