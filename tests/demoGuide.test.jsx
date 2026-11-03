import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DemoPrologue } from '../src/components/DemoPrologue';
import { DemoGuide } from '../src/components/DemoGuide';
import { OwnerInbox } from '../src/components/OwnerInbox';
import { DEFAULT_CLIENT } from '../src/data/clients';

const sampleClient = { ...DEFAULT_CLIENT, web3formsKey: '' }; // isSample: true, keyless sample studio

describe('Prospect demo prologue', () => {
  it('explains what the demo does and why it benefits the studio, with honest boundaries', () => {
    render(<DemoPrologue isOpen={true} onClose={() => {}} onStartTour={() => {}} client={sampleClient} />);
    // What it is
    expect(screen.getByText(/Live product demo/i)).toBeDefined();
    expect(screen.getByText(/Watch a visitor become a qualified enquiry/i)).toBeDefined();
    // The working flows and their benefits
    expect(screen.getByText(/AI design concepts/i)).toBeDefined();
    expect(screen.getByText(/Instant scope & budget/i)).toBeDefined();
    expect(screen.getByText(/Enquiries that reach you/i)).toBeDefined();
    expect(screen.getByText(/Direct consultation booking/i)).toBeDefined();
    // Honest boundaries stated
    expect(screen.getByText(/sample studio with sample data - not a real business/i)).toBeDefined();
  });

  it('makes no claim the demo cannot back: booking shown-not-connected, no blanket everything-works', () => {
    render(<DemoPrologue isOpen={true} onClose={() => {}} onStartTour={() => {}} client={sampleClient} />);
    expect(screen.queryByText(/Everything on the page works/i)).toBeNull();
    // Booking is introduced as shown-but-not-connected in the demo
    expect(screen.getByText(/shown but not connected/i)).toBeDefined();
    // Enquiry delivery is claimed only for the live setup, not the demo
    expect(screen.getByText(/In a live setup the same enquiry is delivered to your business email and CRM automatically/i)).toBeDefined();
    // The tools that do work are stated as working
    expect(screen.getByText(/The design and estimate tools really work/i)).toBeDefined();
  });

  it('describes real delivery to the Omnistu inbox when the master demo key is present', () => {
    render(<DemoPrologue isOpen={true} onClose={() => {}} onStartTour={() => {}} client={DEFAULT_CLIENT} />);
    expect(screen.getByText(/really is emailed to the Omnistu team inbox/i)).toBeDefined();
    expect(screen.getByText(/really arrive in Omnistu’s own team inbox/i)).toBeDefined();
    expect(screen.queryByText(/nothing here claims to be connected to a real inbox or CRM/i)).toBeNull();
  });

  it('starts the guided tour from the primary action', () => {
    const onStartTour = vi.fn();
    render(<DemoPrologue isOpen={true} onClose={() => {}} onStartTour={onStartTour} client={sampleClient} />);
    fireEvent.click(screen.getByText(/Start the guided tour/i));
    expect(onStartTour).toHaveBeenCalled();
  });
});

describe('Demo guide', () => {
  it('walks the working flows and fires their actions', () => {
    const onAction = vi.fn();
    render(<DemoGuide visible={true} onClose={() => {}} onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: /Try the AI concept/i }));
    expect(onAction).toHaveBeenCalledWith({ type: 'scroll', target: 'room-redesign' });
    fireEvent.click(screen.getByRole('button', { name: /Send a test enquiry/i }));
    expect(onAction).toHaveBeenCalledWith({ type: 'enquiry' });
    fireEvent.click(screen.getByRole('button', { name: /See what you receive/i }));
    expect(onAction).toHaveBeenCalledWith({ type: 'ownerInbox' });
  });
});

describe('Owner inbox (studio owner view)', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { localStorage.clear(); });

  it('shows an empty state that tells the prospect how to try it', () => {
    render(<OwnerInbox isOpen={true} onClose={() => {}} client={sampleClient} />);
    expect(screen.getByText(/No enquiries yet in this session/i)).toBeDefined();
    expect(screen.getByText(/fake details are fine in the demo/i)).toBeDefined();
  });

  it('renders a submitted enquiry exactly as the studio would receive it', () => {
    localStorage.setItem('omnistu_leads', JSON.stringify([{
      name: 'Demo Visitor',
      phone: '+1 (555) 000-1234',
      email: 'demo@example.com',
      timeline: 'Within 1-2 Months',
      notes: 'Test note',
      context: { room: 'Living Room', budget: 'Rs 8-12L' },
      timestamp: '2026-11-03T06:48:52.741Z'
    }]));
    render(<OwnerInbox isOpen={true} onClose={() => {}} client={sampleClient} />);
    expect(screen.getByText('Demo Visitor')).toBeDefined();
    expect(screen.getByText('+1 (555) 000-1234')).toBeDefined();
    expect(screen.getByText('demo@example.com')).toBeDefined();
    expect(screen.getByText(/Within 1-2 Months/)).toBeDefined();
    expect(screen.getByText(/Living Room • Rs 8-12L/)).toBeDefined();
    // Honest demo boundary stated
    expect(screen.getByText(/stay in this browser/i)).toBeDefined();
  });
});
