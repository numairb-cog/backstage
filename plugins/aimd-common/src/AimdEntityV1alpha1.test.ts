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

import { aimdEntityV1alpha1Validator } from './AimdEntityV1alpha1';

describe('AimdEntityV1alpha1', () => {
  describe('aimdEntityV1alpha1Validator', () => {
    it('should accept a valid AIMD entity', async () => {
      const entity = {
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

      await expect(aimdEntityV1alpha1Validator.check(entity)).resolves.toBe(
        true,
      );
    });

    it('should accept a valid AIMD entity with system', async () => {
      const entity = {
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
          system: 'test-system',
        },
      };

      await expect(aimdEntityV1alpha1Validator.check(entity)).resolves.toBe(
        true,
      );
    });

    it('should reject an entity with missing required fields', async () => {
      const entity = {
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

      await expect(aimdEntityV1alpha1Validator.check(entity)).rejects.toThrow();
    });

    it('should reject an entity with wrong apiVersion', async () => {
      const entity = {
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

      await expect(aimdEntityV1alpha1Validator.check(entity)).resolves.toBe(
        false,
      );
    });

    it('should reject an entity with wrong kind', async () => {
      const entity = {
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

      await expect(aimdEntityV1alpha1Validator.check(entity)).resolves.toBe(
        false,
      );
    });

    it('should reject an entity with empty required fields', async () => {
      const entity = {
        apiVersion: 'yourcompany.io/v1alpha1',
        kind: 'Aimd',
        metadata: {
          name: 'test-doc',
        },
        spec: {
          type: '',
          lifecycle: '',
          owner: '',
          definition: '',
        },
      };

      await expect(aimdEntityV1alpha1Validator.check(entity)).rejects.toThrow();
    });

    it('should accept different lifecycle values', async () => {
      const lifecycles = ['experimental', 'production', 'deprecated'];

      for (const lifecycle of lifecycles) {
        const entity = {
          apiVersion: 'yourcompany.io/v1alpha1',
          kind: 'Aimd',
          metadata: {
            name: 'test-doc',
          },
          spec: {
            type: 'markdown',
            lifecycle,
            owner: 'team-a',
            definition: '# Test',
          },
        };

        await expect(aimdEntityV1alpha1Validator.check(entity)).resolves.toBe(
          true,
        );
      }
    });

    it('should accept markdown content with special characters', async () => {
      const entity = {
        apiVersion: 'yourcompany.io/v1alpha1',
        kind: 'Aimd',
        metadata: {
          name: 'test-doc',
        },
        spec: {
          type: 'markdown',
          lifecycle: 'production',
          owner: 'team-a',
          definition:
            '# Test\n\n```typescript\nconst x = "hello";\n```\n\n| Column | Value |\n|--------|-------|\n| A | 1 |',
        },
      };

      await expect(aimdEntityV1alpha1Validator.check(entity)).resolves.toBe(
        true,
      );
    });
  });
});
