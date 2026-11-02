import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../src/App';

describe('Embeddable widget mode (?view=embed)', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders only the engine and lead modal chrome, without site navigation', () => {
    window.history.pushState({}, '', '/?view=embed');
    render(<App />);

    expect(screen.getByText(/Interactive AI Staging Studio/i)).toBeDefined();
    expect(screen.queryByText(/Request Consultation/i)).toBeNull();
    expect(screen.queryByText(/Sample Concepts & Style Gallery/i)).toBeNull();
    expect(screen.queryByText(/Powered by/i)).toBeNull();
  });

  it('renders the full site when the embed flag is absent', () => {
    render(<App />);
    expect(screen.getByText(/Request Consultation/i)).toBeDefined();
    expect(screen.getByText(/Sample Concepts & Style Gallery/i)).toBeDefined();
  });
});
