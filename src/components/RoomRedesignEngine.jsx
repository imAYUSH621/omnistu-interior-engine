import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Upload, RefreshCw, SlidersHorizontal, Lock, CheckCircle, Eye, Download, Info } from 'lucide-react';
import { STYLE_PRESETS, ROOM_PRESETS } from '../data/portfolio';
import { generateArchitecturalRedesign } from '../services/imageGenerator';

export function RoomRedesignEngine({ client, onOpenLeadModal }) {
  const [selectedRoom, setSelectedRoom] = useState(ROOM_PRESETS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0]);
  const [customImage, setCustomImage] = useState(null);
  const [customNotes, setCustomNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(ROOM_PRESETS[0].fallbackRender);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [generationStep, setGenerationStep] = useState('');
  const [isAiRendered, setIsAiRendered] = useState(false);

  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // Active raw image (custom upload takes priority over preset)
  const currentBeforeImage = customImage || selectedRoom.rawImage;

  // Handle local file upload with zero external storage cost
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run the zero-cost architectural redesign
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep('Preparing your design brief...');
    
    setTimeout(() => setGenerationStep('Generating your concept image with AI...'), 1200);
    setTimeout(() => setGenerationStep('Adding finishing touches...'), 2400);

    const result = await generateArchitecturalRedesign({
      roomType: selectedRoom.name,
      styleSnippet: selectedStyle.promptSnippet,
      customPrompt: customNotes,
      fallbackUrl: selectedRoom.fallbackRender
    });

    setGeneratedImage(result.imageUrl);
    setIsAiRendered(result.isAiGenerated);
    setIsGenerating(false);
    setGenerationStep('');
    setSliderPosition(50);
  };

  // Slider Mouse/Touch Drag Handlers
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e) => {
    if (isDragging.current && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => { isDragging.current = false; };
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <section id="room-redesign" className="py-20 bg-[#0c0c0e] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive AI Staging Studio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Get a Free AI Design Concept in Your Chosen Style
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-light">
            Select a sample room or upload a photo for reference, choose a signature style, and our AI generates a design concept - for inspiration and planning, not a literal preview of your room.
          </p>
        </div>

        {/* 2-Column Studio Grid: Controls on Left, Live Interactive View on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 space-y-6 bg-zinc-950/70 p-6 rounded-2xl border border-zinc-800/80 shadow-2xl backdrop-blur-sm">
            
            {/* Step 1: Room Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                1. Select Room Type or Upload
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROOM_PRESETS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoom(room);
                      setCustomImage(null);
                      setGeneratedImage(room.fallbackRender);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left transition border ${
                      selectedRoom.id === room.id && !customImage
                        ? 'bg-brand-500/20 border-brand-400 text-white font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>

              {/* Upload Custom Room Photo */}
              <div className="mt-3">
                <label className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl border border-dashed border-zinc-700 hover:border-brand-400 bg-zinc-900/50 cursor-pointer text-xs text-zinc-300 hover:text-white transition group">
                  <Upload className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                  <span>{customImage ? 'Replace Uploaded Room Photo' : 'Upload Your Existing Room (Free)'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <p className="mt-2 text-[10px] leading-snug text-zinc-500 font-mono">
                  Your photo stays on this page and is not sent or analyzed - the AI concept is generated from your style choices only.
                </p>
              </div>
            </div>

            {/* Step 2: Signature Design Style Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                2. Choose Signature Design Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STYLE_PRESETS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-3 ${
                      selectedStyle.id === style.id
                        ? 'bg-brand-500/20 border-brand-400 text-white shadow-md'
                        : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <img src={style.thumb} alt={style.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-white truncate">{style.name}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{style.tagline}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Custom Architectural Notes */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                3. Custom Material Requests (Optional)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g., Fluted oak panels, Roman travertine fireplace..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-brand-400 font-sans"
              />
            </div>

            {/* Action Trigger Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-xl ${
                isGenerating
                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white shadow-brand-500/25 active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-brand-300" />
                  <span>{generationStep || 'Generating your concept image...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Generate My Free Design Concept</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
              <span>Free AI concept generation</span>
              <span>For inspiration and planning only</span>
            </div>

          </div>

          {/* Right Column: Interactive Before/After Split Viewer */}
          <div className="lg:col-span-7 space-y-4">
            
            <div
              ref={containerRef}
              onMouseDown={() => { isDragging.current = true; }}
              onTouchStart={() => { isDragging.current = true; }}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl select-none cursor-ew-resize group bg-zinc-950"
            >
              
              {/* After (Redesigned) Image */}
              <img
                src={generatedImage || selectedRoom.fallbackRender}
                alt="AI design concept"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Before (Original Raw) Image with Clip Path */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <img
                  src={currentBeforeImage}
                  alt="Original Space"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-95"
                />
              </div>

              {/* Drag Handle Bar */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-zinc-900 shadow-2xl flex items-center justify-center font-bold text-xs border border-zinc-300">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                </div>
              </div>

              {/* Badges on Viewport */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-mono text-zinc-200 border border-white/10">
                {customImage ? 'YOUR PHOTO (NOT ANALYZED)' : 'SAMPLE ROOM (REFERENCE)'}
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-brand-500/90 backdrop-blur-md text-[11px] font-mono text-white border border-brand-400 font-semibold shadow-lg">
                {isAiRendered ? `AI CONCEPT (${selectedStyle.name.toUpperCase()})` : 'SAMPLE PHOTO (AI BUSY)'}
              </div>

              {/* Loading Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center space-y-4 z-20">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-400 flex items-center justify-center text-brand-300 animate-pulse">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold text-sm">{generationStep}</div>
                    <div className="text-xs text-zinc-400 font-mono mt-1">Free AI generation can take up to a minute - thank you for waiting...</div>
                  </div>
                </div>
              )}

            </div>

            {/* Slider Instructions & Spec Unlocking CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs">
              <div className="flex items-center space-x-2 text-zinc-400">
                <Info className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Drag the vertical divider left or right to inspect finish details.</span>
              </div>

              <button
                onClick={() => onOpenLeadModal({
                  room: selectedRoom.name,
                  style: selectedStyle.name,
                  image: generatedImage || selectedRoom.fallbackRender
                })}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-brand-500 hover:from-amber-400 hover:to-brand-400 text-black font-semibold flex items-center justify-center space-x-2 transition shadow-lg active:scale-95"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Get Full Concept Details & Free Consultation</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
