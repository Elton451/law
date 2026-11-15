import { describe, expect, it } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import Markdown from './Markdown';

describe('Markdown', () => {
  it('renders basic formatting', () => {
    render(<Markdown>{'**Legítima defesa**\n\n- art. 23\n- art. 25'}</Markdown>);

    expect(screen.getByText('Legítima defesa').tagName).toBe('STRONG');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('never renders raw HTML', () => {
    const { container } = render(<Markdown>{'<img src=x onerror="alert(1)">'}</Markdown>);
    expect(container.querySelector('img')).toBeNull();
  });
});
