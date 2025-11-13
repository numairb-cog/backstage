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

import { Entity } from '@backstage/catalog-model';
import { isAimdAvailable } from './isAimdAvailable';

describe('isAimdAvailable', () => {
  it('should return true for a valid AIMD entity', () => {
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

    expect(isAimdAvailable(entity)).toBe(true);
  });

  it('should return false for a non-AIMD entity', () => {
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

    expect(isAimdAvailable(entity)).toBe(false);
  });

  it('should return false for an entity with wrong apiVersion', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
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

    expect(isAimdAvailable(entity)).toBe(false);
  });

  it('should return false for an entity with wrong kind', () => {
    const entity: Entity = {
      apiVersion: 'yourcompany.io/v1alpha1',
      kind: 'API',
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

    expect(isAimdAvailable(entity)).toBe(false);
  });

  it('should return false for undefined entity', () => {
    expect(isAimdAvailable(undefined as any)).toBe(false);
  });

  it('should return false for null entity', () => {
    expect(isAimdAvailable(null as any)).toBe(false);
  });
});
