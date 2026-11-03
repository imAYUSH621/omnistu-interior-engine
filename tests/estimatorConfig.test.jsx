import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, rerender } from '@testing-library/react';
import { CostEstimator } from '../src/components/CostEstimator';
import { PRESET_CLIENTS, DEFAULT_CLIENT } from '../src/data/clients';

describe('Per-client estimator configuration', () => {
  beforeEach(() => { localStorage.clear(); });

  it('uses the US-dollar reference bands by default', () => {
    render(<CostEstimator client={DEFAULT_CLIENT} onOpenLeadModal={() => {}} />);
    expect(screen.getByText(/~\$75\/sq ft/i)).toBeDefined();
    expect(screen.getByText(/\$43,000/)).toBeDefined();
  });

  it('renders the Indian sample studio with rupee bands and Indian digit grouping', () => {
    const arcline = PRESET_CLIENTS['arcline-interiors'];
    expect(arcline).toBeDefined();
    expect(arcline.isSample).toBe(true);
    render(<CostEstimator client={arcline} onOpenLeadModal={() => {}} />);
    expect(screen.getByText(/~₹3,000\/sq ft/i)).toBeDefined();
    // 450 sq ft Gourmet Kitchen at Rs 3,000/sqft x 1.4 scope x 0.9..1.15
    // low = round(450*3000*1.4*0.9 / 1000)*1000 = 1,701,000 -> en-IN grouping
    expect(screen.getByText(/₹17,01,000/)).toBeDefined();
  });

  it('re-resolves the tier when the client changes, never pricing a new client from stale bands', () => {
    const arcline = PRESET_CLIENTS['arcline-interiors'];
    const { rerender } = render(<CostEstimator client={DEFAULT_CLIENT} onOpenLeadModal={() => {}} />);
    expect(screen.getByText(/\$43,000/)).toBeDefined();
    rerender(<CostEstimator client={arcline} onOpenLeadModal={() => {}} />);
    // must now price from the Indian bands, not the previous US tier object
    expect(screen.getByText(/₹17,01,000/)).toBeDefined();
    expect(screen.queryByText(/₹43,000/)).toBeNull();
  });

  it('carries the configured currency into the enquiry context', () => {
    const arcline = PRESET_CLIENTS['arcline-interiors'];
    let captured = null;
    render(<CostEstimator client={arcline} onOpenLeadModal={(ctx) => { captured = ctx; }} />);
    fireEvent.click(screen.getByText(/Get Itemized Estimate/i));
    expect(captured).not.toBeNull();
    expect(captured.budget).toMatch(/^₹/);
    expect(captured.room).toBe('Gourmet Kitchen');
    expect(captured.style).toBe('Premium Designer');
  });
});
