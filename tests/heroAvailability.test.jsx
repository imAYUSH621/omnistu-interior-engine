import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Hero } from '../src/components/Hero';

vi.mock('../src/services/imageGenerator', () => ({
  checkGeneratorAvailability: vi.fn(),
}));

import { checkGeneratorAvailability } from '../src/services/imageGenerator';

const client = {
  name: 'Demo Studio',
  isSample: true,
  badge: 'Live demo - sample data',
  heroHeadline: 'Get a Free AI Design Concept for Your Space',
  heroSubheadline: 'Pick a style and generate a free AI design concept.',
};

describe('Hero copy follows generator availability', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not promise AI output when the generator is down', async () => {
    checkGeneratorAvailability.mockResolvedValue(false);
    render(<Hero client={client} onLaunchRedesign={() => {}} onLaunchEstimator={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/Explore Interior Design Concepts for Your Space/i)).toBeDefined();
    });
    expect(screen.queryByText(/Get a Free AI Design Concept for Your Space/i)).toBeNull();
    expect(screen.getByText(/temporarily busy - browse curated sample concepts/i)).toBeDefined();
    expect(screen.getByText(/Browse Design Concepts/i)).toBeDefined();
    expect(screen.queryByText(/Launch Free AI Design Concept/i)).toBeNull();
    expect(screen.getByText(/Samples While AI Is Busy/i)).toBeDefined();
  });

  it('keeps AI copy when the generator is up', async () => {
    checkGeneratorAvailability.mockResolvedValue(true);
    render(<Hero client={client} onLaunchRedesign={() => {}} onLaunchEstimator={() => {}} />);

    await waitFor(() => expect(checkGeneratorAvailability).toHaveBeenCalled());
    expect(screen.getByText(/Get a Free AI Design Concept for Your Space/i)).toBeDefined();
    expect(screen.getByText(/Launch Free AI Design Concept/i)).toBeDefined();
    expect(screen.queryByText(/Samples While AI Is Busy/i)).toBeNull();
  });
});
