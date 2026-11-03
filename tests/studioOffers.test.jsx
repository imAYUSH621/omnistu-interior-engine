import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../src/App';

describe('Studio service overview (?view=offers)', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders the three offers with readiness labels and tryable links', () => {
    window.history.pushState({}, '', '/?view=offers');
    render(<App />);

    expect(screen.getByText(/complete website for your studio/i)).toBeDefined();
    expect(screen.getByText(/added to your existing website/i)).toBeDefined();
    expect(screen.getByText(/enquiry funnel/i)).toBeDefined();
    expect(screen.getAllByText(/Working in this demo/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/live delivery needs your accounts/i)).toBeDefined();

    const embedLink = screen.getByText(/sample existing website/i).closest('a');
    expect(embedLink.getAttribute('href')).toBe('./host-demo.html');
  });

  it('does not render the client site chrome on the offers view', () => {
    window.history.pushState({}, '', '/?view=offers');
    render(<App />);
    expect(screen.queryByText(/Request Consultation/i)).toBeNull();
  });

  it('states that setup-dependent integrations are not faked', () => {
    window.history.pushState({}, '', '/?view=offers');
    render(<App />);
    expect(screen.getByText(/not faked in this demo/i)).toBeDefined();
    expect(screen.getByText(/fictional samples/i)).toBeDefined();
  });
});
