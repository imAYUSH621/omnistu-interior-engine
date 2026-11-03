import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoomRedesignEngine } from './components/RoomRedesignEngine';
import { CostEstimator } from './components/CostEstimator';
import { PortfolioShowcase } from './components/PortfolioShowcase';
import { LeadModal } from './components/LeadModal';
import { OnboardingModal } from './components/OnboardingModal';
import { Footer } from './components/Footer';
import { getClientProfile, DEFAULT_CLIENT, getModules, isPlatformDemoHost } from './data/clients';
import { DemoPrologue } from './components/DemoPrologue';
import { DemoGuide } from './components/DemoGuide';
import { OwnerInbox } from './components/OwnerInbox';

export function App() {
  const [currentClient, setCurrentClient] = useState(DEFAULT_CLIENT);
  const modules = useMemo(() => getModules(currentClient), [currentClient]);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadContext, setLeadContext] = useState(null);
  // Prospect-facing demo layer (sample profiles only, never in embed mode):
  // prologue explains what the demo proves, the guide walks the working
  // flows, the owner inbox shows what the studio receives.
  const [prologueOpen, setPrologueOpen] = useState(false);
  const [guideVisible, setGuideVisible] = useState(false);
  const [ownerInboxOpen, setOwnerInboxOpen] = useState(false);
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);

  // Initialize client from Subdomain or URL Query parameter
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryClient = urlParams.get('client') || urlParams.get('c');
      
      // Guard against IPv4 addresses (e.g. 127.0.0.1 or 192.168.1.1) and localhost
      const hostname = window.location.hostname || '';
      const isIpv4 = /^\d+(\.\d+){3}$/.test(hostname);
      const isLocalhost = hostname === 'localhost';
      
      let subClient = null;
      if (!isIpv4 && !isLocalhost && !isPlatformDemoHost(hostname)) {
        const parts = hostname.split('.');
        if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'id') {
          subClient = parts[0];
        }
      }

      const activeSlug = queryClient || subClient;
      if (activeSlug) {
        const profile = getClientProfile(activeSlug, urlParams);
        setCurrentClient(profile);
      }
    } catch {
      // Graceful fallback to default client
    }
  }, []);

  const handleSelectClient = (slug) => {
    const profile = getClientProfile(slug);
    setCurrentClient(profile);
    const newUrl = `${window.location.pathname}?client=${slug}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleOpenLeadModal = (context = {}) => {
    setLeadContext(context);
    setLeadModalOpen(true);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Embeddable widget mode: ?view=embed renders only the AI concept engine
  // and lead modal, for iframing into a client's existing website.
  const isEmbed = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).get('view') === 'embed';
    } catch {
      return false;
    }
  }, []);

  // Auto-open the prologue once per session for sample (demo) profiles.
  useEffect(() => {
    if (isEmbed || !currentClient.isSample) return;
    try {
      if (!sessionStorage.getItem('omnistu_demo_prologue_seen')) {
        setPrologueOpen(true);
      }
    } catch { /* storage blocked -> still show */ setPrologueOpen(true); }
  }, [isEmbed, currentClient]);

  const closePrologue = () => {
    setPrologueOpen(false);
    try { sessionStorage.setItem('omnistu_demo_prologue_seen', '1'); } catch { /* non-blocking */ }
  };

  const startGuidedTour = () => {
    closePrologue();
    setGuideVisible(true);
  };

  const handleGuideAction = (action) => {
    if (!action) return;
    if (action.type === 'scroll') scrollToSection(action.target);
    else if (action.type === 'enquiry') handleOpenLeadModal({ intent: 'guided_tour_test' });
    else if (action.type === 'ownerInbox') setOwnerInboxOpen(true);
  };

  // Report height to the parent page so the iframe can auto-resize
  useEffect(() => {
    if (!isEmbed || typeof window === 'undefined' || window.parent === window) return;
    if (typeof ResizeObserver === 'undefined') return;
    const post = () => {
      try {
        window.parent.postMessage(
          { type: 'omnistu-embed-height', height: document.documentElement.scrollHeight },
          '*'
        );
      } catch { /* non-blocking */ }
    };
    const observer = new ResizeObserver(post);
    observer.observe(document.body);
    post();
    return () => observer.disconnect();
  }, [isEmbed]);

  if (isEmbed) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-[#f4f2ee] font-sans antialiased selection:bg-brand-500 selection:text-white">
        <RoomRedesignEngine
          client={currentClient}
          onOpenLeadModal={handleOpenLeadModal}
        />
        <LeadModal
          isOpen={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
          client={currentClient}
          contextData={leadContext}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0c0c0e] text-[#f4f2ee] font-sans antialiased flex flex-col selection:bg-brand-500 selection:text-white">
      
      {/* Dynamic Client Navigation */}
      <Navbar
        client={currentClient}
        onSelectClient={handleSelectClient}
        onOpenOnboard={() => setOnboardModalOpen(true)}
        onBookConsult={() => handleOpenLeadModal({ intent: 'direct_consultation' })}
        onOpenGuide={() => setPrologueOpen(true)}
      />

      {/* Main Experience */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          client={currentClient}
          modules={modules}
          onLaunchRedesign={() => scrollToSection('room-redesign')}
          onLaunchEstimator={() => scrollToSection('cost-estimator')}
        />

        {/* 1. Interactive AI Room Redesign & Staging (Adapted from roomGPT) */}
        {modules.aiStudio && (
          <RoomRedesignEngine
            client={currentClient}
            onOpenLeadModal={handleOpenLeadModal}
          />
        )}

        {/* 2. Transparent Scope & Cost Calculator */}
        {modules.estimator && (
          <CostEstimator
            client={currentClient}
            onOpenLeadModal={handleOpenLeadModal}
          />
        )}

        {/* 3. SOTA Curated Architectural Portfolio */}
        {modules.portfolio && (
          <PortfolioShowcase
            client={currentClient}
            onOpenLeadModal={handleOpenLeadModal}
          />
        )}
      </main>

      {/* Architectural Brand Footer */}
      <Footer client={currentClient} />

      {/* Modals */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        client={currentClient}
        contextData={leadContext}
      />

      <OnboardingModal
        isOpen={onboardModalOpen}
        onClose={() => setOnboardModalOpen(false)}
        onClientCreated={(newClient) => {
          setCurrentClient(newClient);
        }}
      />

      {/* Prospect demo layer: sample profiles only */}
      {currentClient.isSample && (
        <>
          <DemoPrologue
            isOpen={prologueOpen}
            onClose={closePrologue}
            onStartTour={startGuidedTour}
            client={currentClient}
          />
          <DemoGuide
            visible={guideVisible}
            onClose={() => setGuideVisible(false)}
            onAction={handleGuideAction}
          />
          <OwnerInbox
            isOpen={ownerInboxOpen}
            onClose={() => setOwnerInboxOpen(false)}
            client={currentClient}
          />
        </>
      )}

    </div>
  );
}

export default App;
