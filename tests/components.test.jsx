import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from '../src/App';
import { Navbar } from '../src/components/Navbar';
import { Hero } from '../src/components/Hero';
import { RoomRedesignEngine } from '../src/components/RoomRedesignEngine';
import { CostEstimator } from '../src/components/CostEstimator';
import { PortfolioShowcase } from '../src/components/PortfolioShowcase';
import { LeadModal } from '../src/components/LeadModal';
import { OnboardingModal } from '../src/components/OnboardingModal';
import { Footer } from '../src/components/Footer';
import { DEFAULT_CLIENT } from '../src/data/clients';

describe('React Component Suite & Full Application Flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders App seamlessly with top-level tenant routing', () => {
    render(<App />);
    expect(screen.getAllByText(DEFAULT_CLIENT.name).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/See Your Space Transformed/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Transparent Investment Estimator/i).length).toBeGreaterThan(0);
  });

  it('renders Navbar with client branding and interactions', () => {
    const handleSelect = vi.fn();
    const handleOnboard = vi.fn();
    const handleConsult = vi.fn();

    render(
      <Navbar
        client={DEFAULT_CLIENT}
        onSelectClient={handleSelect}
        onOpenOnboard={handleOnboard}
        onBookConsult={handleConsult}
      />
    );

    expect(screen.getByText(DEFAULT_CLIENT.name)).toBeDefined();
    expect(screen.getByText('Book Consultation')).toBeDefined();

    // Trigger consultation button
    fireEvent.click(screen.getByText('Book Consultation'));
    expect(handleConsult).toHaveBeenCalled();

    // Trigger switcher dropdown
    const switchBtn = screen.getByTitle(/Switch demo client/i);
    fireEvent.click(switchBtn);
    expect(screen.getByText(/Pre-Configured Lead Demos/i)).toBeDefined();

    // Click a preset client
    fireEvent.click(screen.getByText('Del-Air Luxury Home & Remodeling'));
    expect(handleSelect).toHaveBeenCalledWith('del-air');

    // Re-open dropdown and click onboard new firm
    fireEvent.click(switchBtn);
    fireEvent.click(screen.getByText(/\+ Onboard New Firm/i));
    expect(handleOnboard).toHaveBeenCalled();
  });

  it('renders Hero with value proposition and triggers', () => {
    const launchRedesign = vi.fn();
    const launchEstimator = vi.fn();

    render(
      <Hero
        client={DEFAULT_CLIENT}
        onLaunchRedesign={launchRedesign}
        onLaunchEstimator={launchEstimator}
      />
    );

    expect(screen.getByText(DEFAULT_CLIENT.heroHeadline)).toBeDefined();
    
    fireEvent.click(screen.getByText('Launch Instant 3D Room Redesign'));
    expect(launchRedesign).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Calculate Project Scope & Budget'));
    expect(launchEstimator).toHaveBeenCalled();
  });

  it('renders and interacts with RoomRedesignEngine and slider drag', async () => {
    const openLead = vi.fn();
    render(<RoomRedesignEngine client={DEFAULT_CLIENT} onOpenLeadModal={openLead} />);

    expect(screen.getByText(/Interactive AI Staging Studio/i)).toBeDefined();
    
    // Click room preset
    fireEvent.click(screen.getByText('Gourmet Kitchen'));

    // Click style preset
    fireEvent.click(screen.getByText('Warm Organic Modern'));

    // Input custom material note
    const customInput = screen.getByPlaceholderText(/Fluted oak panels/i);
    fireEvent.change(customInput, { target: { value: 'Roman travertine floor' } });
    expect(customInput.value).toBe('Roman travertine floor');

    // Drag slider
    const sliderContainer = screen.getByText('RAW SPACE (BEFORE)').closest('.cursor-ew-resize');
    if (sliderContainer) {
      fireEvent.mouseDown(sliderContainer, { clientX: 200 });
      fireEvent.mouseMove(sliderContainer, { clientX: 300 });
      fireEvent.mouseUp(window);

      fireEvent.touchStart(sliderContainer, { touches: [{ clientX: 200 }] });
      fireEvent.touchMove(sliderContainer, { touches: [{ clientX: 300 }] });
      fireEvent.touchEnd(window);
    }

    // Trigger generate button
    const genButton = screen.getByText(/Generate Instant 3D Architectural Staging/i);
    await act(async () => {
      fireEvent.click(genButton);
    });

    // Click unlock 4K blueprints
    fireEvent.click(screen.getByText(/Unlock 4K Blueprints/i));
    expect(openLead).toHaveBeenCalled();
  });

  it('handles custom file upload in RoomRedesignEngine', () => {
    const openLead = vi.fn();
    const { container } = render(<RoomRedesignEngine client={DEFAULT_CLIENT} onOpenLeadModal={openLead} />);

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'my_living_room.jpg', { type: 'image/jpeg' });
    
    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [file] } });
    }
  });

  it('calculates dynamic budgets and triggers scope modals in CostEstimator', () => {
    const openModal = vi.fn();
    render(<CostEstimator client={DEFAULT_CLIENT} onOpenLeadModal={openModal} />);

    expect(screen.getByText('Transparent Investment Estimator')).toBeDefined();
    expect(screen.getByText(/Gourmet Kitchen/i)).toBeDefined();

    // Change square footage slider
    const sqftSlider = screen.getByRole('slider');
    fireEvent.change(sqftSlider, { target: { value: '1200' } });

    // Select Master Bath Suite
    fireEvent.click(screen.getByText('Master Bath Suite'));

    // Select finish tier
    fireEvent.click(screen.getByText('Ultra-Bespoke Penthouse'));

    // Trigger download blueprint button
    const ctaButton = screen.getByText('Download Itemized Cost Blueprint');
    fireEvent.click(ctaButton);
    expect(openModal).toHaveBeenCalled();
  });

  it('renders PortfolioShowcase with interactive view flip', () => {
    const openModal = vi.fn();
    render(<PortfolioShowcase client={DEFAULT_CLIENT} onOpenLeadModal={openModal} />);

    expect(screen.getByText(/The Tribeca Japandi Sanctuary/i)).toBeDefined();
    
    const flipButtons = screen.getAllByText(/Flip to/i);
    expect(flipButtons.length).toBeGreaterThan(0);
    fireEvent.click(flipButtons[0]);

    // Inquire about style
    const inquireButtons = screen.getAllByText(/Inquire About This Style/i);
    fireEvent.click(inquireButtons[0]);
    expect(openModal).toHaveBeenCalled();
  });

  it('submits LeadModal and captures lead data', () => {
    const handleClose = vi.fn();
    render(
      <LeadModal
        isOpen={true}
        onClose={handleClose}
        client={DEFAULT_CLIENT}
        contextData={{ room: 'Living Pavilion', budget: '$45,000' }}
      />
    );

    expect(screen.getByText(/Unlock 4K Blueprints & Itemized Scope/i)).toBeDefined();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/Katherine Vance/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/\+1 \(555\) 019-2834/i), { target: { value: '+15551234567' } });
    fireEvent.change(screen.getByPlaceholderText(/katherine@vance.com/i), { target: { value: 'jane@example.com' } });

    // Submit form
    fireEvent.click(screen.getByText(/Send Blueprint & Priority Access/i));

    // Success screen
    expect(screen.getByText(/Blueprint Sent Successfully/i)).toBeDefined();
    expect(screen.getByText(/Chat Instantly on WhatsApp/i)).toBeDefined();

    // Close window
    fireEvent.click(screen.getByText(/Close Window/i));
    expect(handleClose).toHaveBeenCalled();
  });

  it('synthesizes new client portal and handles copying in OnboardingModal', () => {
    const handleClose = vi.fn();
    const handleCreated = vi.fn();

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue()
      }
    });

    render(
      <OnboardingModal
        isOpen={true}
        onClose={handleClose}
        onClientCreated={handleCreated}
      />
    );

    expect(screen.getByText(/Generate Branded Portal in 30 Seconds/i)).toBeDefined();

    // Enter firm info
    fireEvent.change(screen.getByPlaceholderText(/Del-Air Luxury Remodeling/i), { target: { value: 'Highland Luxe' } });
    fireEvent.change(screen.getByPlaceholderText(/Orlando, FL/i), { target: { value: 'Miami, FL' } });
    fireEvent.change(screen.getByPlaceholderText(/\+1 \(407\) 555-0199/i), { target: { value: '+13055551234' } });

    // Submit
    fireEvent.click(screen.getByText(/Synthesize Live Client Portal/i));

    expect(handleCreated).toHaveBeenCalled();
    expect(screen.getByText(/Live Client Link Generated/i)).toBeDefined();

    // Click copy link
    fireEvent.click(screen.getByText(/Copy Pitch Link/i));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // Click onboard another client
    fireEvent.click(screen.getByText(/\+ Onboard Another Client/i));
  });

  it('renders Footer with brand invariants and links', () => {
    render(<Footer client={DEFAULT_CLIENT} />);
    expect(screen.getByText(DEFAULT_CLIENT.tagline, { exact: false })).toBeDefined();
    expect(screen.getByText(/Omnistu Interior Engine/i)).toBeDefined();
  });
});
