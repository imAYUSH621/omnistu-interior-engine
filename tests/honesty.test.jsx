import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PortfolioShowcase } from '../src/components/PortfolioShowcase';
import { RoomRedesignEngine } from '../src/components/RoomRedesignEngine';
import { Hero } from '../src/components/Hero';
import { Footer } from '../src/components/Footer';
import { DEFAULT_CLIENT, PRESET_CLIENTS } from '../src/data/clients';

describe('Honesty and sample labeling guarantees', () => {
  it('labels the portfolio as sample concepts, never verified case studies', () => {
    render(<PortfolioShowcase client={DEFAULT_CLIENT} onOpenLeadModal={() => {}} />);
    expect(screen.getByText(/Sample Design Concepts/i)).toBeDefined();
    expect(screen.queryByText(/Verified Architectural Case Studies/i)).toBeNull();
  });

  it('labels AI output as an inspiration-only concept, not a 3D redesign of the photo', () => {
    render(<RoomRedesignEngine client={DEFAULT_CLIENT} onOpenLeadModal={() => {}} />);
    expect(screen.getAllByText(/For inspiration and planning only/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/3D REDESIGN/i)).toBeNull();
    expect(screen.getByText(/SAMPLE PHOTO \(AI BUSY\)/i)).toBeDefined();
  });

  it('marks sample clients and ships them without fabricated contact details', () => {
    expect(DEFAULT_CLIENT.isSample).toBe(true);
    expect(DEFAULT_CLIENT.whatsapp).toBe('');
    Object.values(PRESET_CLIENTS).forEach((c) => {
      expect(c.isSample).toBe(true);
      expect(c.badge).toMatch(/not a real business/i);
    });
  });

  it('renders sample-safe hero stats and footer disclaimer for sample clients', () => {
    render(<Hero client={DEFAULT_CLIENT} onLaunchRedesign={() => {}} onLaunchEstimator={() => {}} />);
    expect(screen.getByText('Product Demo')).toBeDefined();
    expect(screen.getByText('Demo Content')).toBeDefined();

    render(<Footer client={DEFAULT_CLIENT} />);
    expect(screen.getByText(/sample content for illustration only/i)).toBeDefined();
    expect(screen.queryByText(/Licensed, Insured & Bonded/i)).toBeNull();
  });
});
