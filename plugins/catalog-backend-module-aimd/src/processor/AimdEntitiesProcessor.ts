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

import {
  Entity,
  getCompoundEntityRef,
  parseEntityRef,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
  RELATION_HAS_PART,
} from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  AimdEntityV1alpha1,
  aimdEntityV1alpha1Validator,
} from '@internal/plugin-aimd-common';

/**
 * Adds support for AIMD specific entity kinds to the catalog.
 *
 * @public
 */
export class AimdEntitiesProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'AimdEntitiesProcessor';
  }

  private readonly validators = [aimdEntityV1alpha1Validator];

  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      if (await validator.check(entity)) {
        return true;
      }
    }

    return false;
  }

  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    const selfRef = getCompoundEntityRef(entity);

    if (
      entity.apiVersion === 'yourcompany.io/v1alpha1' &&
      entity.kind === 'Aimd'
    ) {
      const aimd = entity as AimdEntityV1alpha1;

      const owner = aimd.spec.owner;
      if (owner) {
        const ownerRef = parseEntityRef(owner, {
          defaultKind: 'Group',
          defaultNamespace: selfRef.namespace,
        });
        emit(
          processingResult.relation({
            source: selfRef,
            type: RELATION_OWNED_BY,
            target: {
              kind: ownerRef.kind,
              namespace: ownerRef.namespace,
              name: ownerRef.name,
            },
          }),
        );
        emit(
          processingResult.relation({
            source: {
              kind: ownerRef.kind,
              namespace: ownerRef.namespace,
              name: ownerRef.name,
            },
            type: RELATION_OWNER_OF,
            target: selfRef,
          }),
        );
      }

      const system = aimd.spec.system;
      if (system) {
        const systemRef = parseEntityRef(system, {
          defaultKind: 'System',
          defaultNamespace: selfRef.namespace,
        });
        emit(
          processingResult.relation({
            source: selfRef,
            type: RELATION_PART_OF,
            target: {
              kind: systemRef.kind,
              namespace: systemRef.namespace,
              name: systemRef.name,
            },
          }),
        );
        emit(
          processingResult.relation({
            source: {
              kind: systemRef.kind,
              namespace: systemRef.namespace,
              name: systemRef.name,
            },
            type: RELATION_HAS_PART,
            target: selfRef,
          }),
        );
      }
    }

    return entity;
  }
}
