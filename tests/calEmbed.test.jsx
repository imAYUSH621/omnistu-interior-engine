import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { CalEmbed } from '../src/components/CalEmbed';

describe('Native Cal.com hosted embed', () => {
  beforeEach(() => {
    delete window.Cal;
    document.head.querySelectorAll('script[src="https://app.cal.com/embed/embed.js"]').forEach((n) => n.remove());
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete window.Cal;
  });

  it('renders nothing when no calLink is configured (inactive state)', () => {
    const { container } = render(<CalEmbed calLink="" />);
    expect(container.firstChild).toBeNull();
  });

  it('loads the official embed.js and mounts the inline calendar when Cal is available', async () => {
    const calMock = vi.fn();
    window.Cal = calMock;
    render(<CalEmbed calLink="studio/demo-call" />);

    await waitFor(() => {
      expect(calMock).toHaveBeenCalledWith('inline', expect.objectContaining({ calLink: 'studio/demo-call' }));
    });
  });

  it('falls back to a plain booking link when the embed script cannot load', async () => {
    render(<CalEmbed calLink="studio/demo-call" loadTimeoutMs={30} />);

    await waitFor(() => {
      const link = screen.getByText(/Book a Consultation Slot/i);
      expect(link.closest('a').href).toBe('https://cal.com/studio/demo-call');
    }, { timeout: 2000 });
  });
});
