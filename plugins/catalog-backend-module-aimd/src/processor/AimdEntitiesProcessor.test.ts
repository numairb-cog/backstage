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

import { AimdEntitiesProcessor } from './AimdEntitiesProcessor';
import { Entity } from '@backstage/catalog-model';
import { LocationSpec } from '@backstage/plugin-catalog-common';

describe('AimdEntitiesProcessor', () => {
  const processor = new AimdEntitiesProcessor();

  describe('getProcessorName', () => {
    it('should return the correct processor name', () => {
      expect(processor.getProcessorName()).toBe('AimdEntitiesProcessor');
    });
  });

  describe('validateEntityKind', () => {
    it('should validate a valid AIMD entity', async () => {
      const entity: Entity = {
        apiVersion: 'yourcompany.io/v1alpha1',
        kind: 'Aimd',
        metadata: {
          name: 'test-doc',
        },
        spec: {
          type: 'markdown',
          lifecycle: 'production',
          owner: 'team-a',
          definition: '# Test',
        },
      };

      await expect(processor.validateEntityKind(entity)).resolves.toBe(true);
    });

    it('should reject an invalid entity', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'team-a',
        },
      };

      await expect(processor.validateEntityKind(entity)).resolves.toBe(false);
    });

    it('should reject an AIMD entity with missing required fields', async () => {
      const entity: Entity = {
        apiVersion: 'yourcompany.io/v1alpha1',
        kind: 'Aimd',
        metadata: {
          name: 'test-doc',
        },
        spec: {
          type: 'markdown',
          lifecycle: 'production',
        },
      };

      await expect(processor.validateEntityKind(entity)).rejects.toThrow();
    });
  });

  describe('postProcessEntity', () => {
    const location: LocationSpec = {
      type: 'url',
      target: 'https://example.com/catalog-info.yaml',
    };

    it('should emit ownedBy and ownerOf relations', async () => {
      const entity: Entity = {
        apiVersion: 'yourcompany.io/v1alpha1',
        kind: 'Aimd',
        metadata: {
          name: 'test-doc',
          namespace: 'default',
        },
        spec: {
          type: 'markdown',
          lifecycle: 'production',
          owner: 'team-a',
          definition: '# Test',
        },
      };

      const emitted: any[] = [];
      const emit = jest.fn((result: any) => {
        emitted.push(result);
      });

      await processor.postProcessEntity(entity, location, emit);

      expect(emitted).toHaveLength(2);
      expect(emitted[0]).toMatchObject({
        type: 'relation',
        relation: {
          source: { kind: 'Aimd', namespace: 'default', name: 'test-doc' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'team-a' },
        },
      });
      expect(emitted[1]).toMatchObject({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'team-a' },
          type: 'ownerOf',
          target: { kind: 'Aimd', namespace: 'default', name: 'test-doc' },
        },
      });
    });

    it('should emit partOf and hasPart relations when system is specified', async () => {
      const entity: Entity = {
        apiVersion: 'yourcompany.io/v1alpha1',
        kind: 'Aimd',
        metadata: {
          name: 'test-doc',
          namespace: 'default',
        },
        spec: {
          type: 'markdown',
          lifecycle: 'production',
          owner: 'team-a',
          definition: '# Test',
          system: 'test-system',
        },
      };

      const emitted: any[] = [];
      const emit = jest.fn((result: any) => {
        emitted.push(result);
      });

      await processor.postProcessEntity(entity, location, emit);

      expect(emitted).toHaveLength(4);

      const partOfRelation = emitted.find(e => e.relation?.type === 'partOf');
      expect(partOfRelation).toMatchObject({
        type: 'relation',
        relation: {
          source: { kind: 'Aimd', namespace: 'default', name: 'test-doc' },
          type: 'partOf',
          target: { kind: 'System', namespace: 'default', name: 'test-system' },
        },
      });

      const hasPartRelation = emitted.find(e => e.relation?.type === 'hasPart');
      expect(hasPartRelation).toMatchObject({
        type: 'relation',
        relation: {
          source: { kind: 'System', namespace: 'default', name: 'test-system' },
          type: 'hasPart',
          target: { kind: 'Aimd', namespace: 'default', name: 'test-doc' },
        },
      });
    });

    it('should handle owner with explicit kind', async () => {
      const entity: Entity = {
        apiVersion: 'yourcompany.io/v1alpha1',
        kind: 'Aimd',
        metadata: {
          name: 'test-doc',
          namespace: 'default',
        },
        spec: {
          type: 'markdown',
          lifecycle: 'production',
          owner: 'user:john.doe',
          definition: '# Test',
        },
      };

      const emitted: any[] = [];
      const emit = jest.fn((result: any) => {
        emitted.push(result);
      });

      await processor.postProcessEntity(entity, location, emit);

      expect(emitted[0]).toMatchObject({
        type: 'relation',
        relation: {
          source: { kind: 'Aimd', namespace: 'default', name: 'test-doc' },
          type: 'ownedBy',
          target: { kind: 'user', namespace: 'default', name: 'john.doe' },
        },
      });
    });

    it('should not emit relations for non-AIMD entities', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          namespace: 'default',
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'team-a',
        },
      };

      const emit = jest.fn();

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).not.toHaveBeenCalled();
    });

    it('should handle entities without owner gracefully', async () => {
      const entity: Entity = {
        apiVersion: 'yourcompany.io/v1alpha1',
        kind: 'Aimd',
        metadata: {
          name: 'test-doc',
          namespace: 'default',
        },
        spec: {
          type: 'markdown',
          lifecycle: 'production',
          owner: '',
          definition: '# Test',
        },
      };

      const emit = jest.fn();

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).not.toHaveBeenCalled();
    });
  });
});
