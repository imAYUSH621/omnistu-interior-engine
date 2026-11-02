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
    // warning names the button's new action, not the old one
    expect(screen.getByText(/This will instantly show a curated sample render/i)).toBeDefined();
    expect(screen.queryByText(/Generate will instantly show/i)).toBeNull();
    // supporting caption and headline stop promising AI output
    expect(screen.getByText(/Sample concept \(generator busy\)/i)).toBeDefined();
    expect(screen.queryByText(/^Free AI concept generation$/i)).toBeNull();
    expect(screen.getByText(/Explore Design Concepts in Your Chosen Style/i)).toBeDefined();
    expect(screen.queryByText(/Get a Free AI Design Concept in Your Chosen Style/i)).toBeNull();
    // upload helper stops promising an AI-generated concept too
    expect(screen.getByText(/the sample concept comes from your style choices only/i)).toBeDefined();
    expect(screen.queryByText(/the AI concept is generated from your style choices only/i)).toBeNull();
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
