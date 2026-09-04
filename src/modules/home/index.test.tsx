import { describe, expect, it } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import Home from './index';

describe('Home', () => {
  it('renders the header navigation', () => {
    render(<Home />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
