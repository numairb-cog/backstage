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
import { MarkdownDefinitionWidget } from './MarkdownDefinitionWidget';

describe('MarkdownDefinitionWidget', () => {
  it('should render markdown content', () => {
    const definition = '# Test Heading\n\nThis is a test paragraph.';

    render(<MarkdownDefinitionWidget definition={definition} />);

    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('This is a test paragraph.')).toBeInTheDocument();
  });

  it('should render markdown with code blocks', () => {
    const definition = '```typescript\nconst x = "hello";\n```';

    render(<MarkdownDefinitionWidget definition={definition} />);

    expect(screen.getByText(/const x = "hello";/)).toBeInTheDocument();
  });

  it('should render markdown with lists', () => {
    const definition = '- Item 1\n- Item 2\n- Item 3';

    render(<MarkdownDefinitionWidget definition={definition} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('should render markdown with links', () => {
    const definition = '[Example Link](https://example.com)';

    render(<MarkdownDefinitionWidget definition={definition} />);

    const link = screen.getByText('Example Link');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com');
  });

  it('should render markdown with bold and italic text', () => {
    const definition = '**Bold text** and *italic text*';

    render(<MarkdownDefinitionWidget definition={definition} />);

    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();
  });

  it('should render empty markdown gracefully', () => {
    const definition = '';

    const { container } = render(
      <MarkdownDefinitionWidget definition={definition} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render markdown with multiple headings', () => {
    const definition = '# H1\n## H2\n### H3';

    render(<MarkdownDefinitionWidget definition={definition} />);

    expect(screen.getByText('H1')).toBeInTheDocument();
    expect(screen.getByText('H2')).toBeInTheDocument();
    expect(screen.getByText('H3')).toBeInTheDocument();
  });
});
