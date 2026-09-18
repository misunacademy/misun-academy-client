// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Divider } from '@/components/shared/Divider';

describe('Divider', () => {
  it('renders the default Bengali label', () => {
    render(<Divider />);
    expect(screen.getByText('অথবা')).toBeInTheDocument();
  });

  it('renders a custom label', () => {
    render(<Divider label="or" />);
    expect(screen.getByText('or')).toBeInTheDocument();
  });

  it('renders the two divider lines', () => {
    const { container } = render(<Divider label="or" />);
    expect(container.querySelectorAll('.bg-primary\\/15')).toHaveLength(2);
  });
});
