import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RoomRedesignEngine } from '../src/components/RoomRedesignEngine';

vi.mock('../src/services/imageGenerator', () => ({
  checkGeneratorAvailability: vi.fn(),
  generateArchitecturalRedesign: vi.fn(),
}));

import { checkGeneratorAvailability, generateArchitecturalRedesign } from '../src/services/imageGenerator';

const client = { name: 'Demo Studio', isSample: true };

describe('Availability-aware engine UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('warns before the click and relabels the CTA when the generator is down', async () => {
    checkGeneratorAvailability.mockResolvedValue(false);
    render(<RoomRedesignEngine client={client} onOpenLeadModal={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/Show Style Concept \(Sample Render\)/i)).toBeDefined();
    });
    expect(screen.getByText(/free AI generator is busy right now/i)).toBeDefined();
  });

  it('keeps the standard CTA and no warning when the generator is up', async () => {
    checkGeneratorAvailability.mockResolvedValue(true);
    render(<RoomRedesignEngine client={client} onOpenLeadModal={() => {}} />);

    await waitFor(() => {
      expect(checkGeneratorAvailability).toHaveBeenCalled();
    });
    expect(screen.getByText(/Generate My Free Design Concept/i)).toBeDefined();
    expect(screen.queryByText(/free AI generator is busy right now/i)).toBeNull();
  });

  it('clicking Generate while down resolves to a labelled sample render', async () => {
    checkGeneratorAvailability.mockResolvedValue(false);
    generateArchitecturalRedesign.mockResolvedValue({
      success: true,
      imageUrl: 'https://images.unsplash.com/fallback',
      isAiGenerated: false,
      note: 'AI generator unavailable - using curated sample render'
    });
    render(<RoomRedesignEngine client={client} onOpenLeadModal={() => {}} />);

    await waitFor(() => screen.getByText(/Show Style Concept \(Sample Render\)/i));
    fireEvent.click(screen.getByText(/Show Style Concept \(Sample Render\)/i));

    await waitFor(() => {
      expect(screen.getByText(/SAMPLE PHOTO \(AI BUSY\)/i)).toBeDefined();
    });
    expect(screen.queryByText(/AI CONCEPT \(/i)).toBeNull();
  });
});
