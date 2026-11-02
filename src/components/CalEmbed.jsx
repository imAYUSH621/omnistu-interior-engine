import React, { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';

const EMBED_SRC = 'https://app.cal.com/embed/embed.js';

// Native Cal.com hosted inline embed. Loads Cal's official embed.js at runtime
// (nothing vendored: the @calcom/embed-react npm package ships under Cal.com's
// commercial EE license, so the documented script embed is the clean path).
// Renders nothing when no calLink is configured, and falls back to a plain
// booking link if the script cannot load (offline, blocked, jsdom).
export function CalEmbed({ calLink, title = 'Book a Consultation Slot', loadTimeoutMs = 6000 }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'failed'

  useEffect(() => {
    if (!calLink) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setStatus((s) => (s === 'loading' ? 'failed' : s));
    }, loadTimeoutMs);

    const mount = () => {
      if (cancelled || !window.Cal || !containerRef.current) return;
      try {
        window.Cal('init', { origin: 'https://cal.com' });
        window.Cal('inline', {
          elementOrSelector: containerRef.current,
          calLink,
          layout: 'month_view',
        });
        clearTimeout(timer);
        setStatus('ready');
      } catch {
        clearTimeout(timer);
        setStatus('failed');
      }
    };

    if (window.Cal) {
      mount();
    } else {
      const existing = document.querySelector(`script[src="${EMBED_SRC}"]`);
      const script = existing || document.createElement('script');
      if (!existing) {
        script.src = EMBED_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      const onLoad = () => mount();
      const onError = () => { clearTimeout(timer); setStatus('failed'); };
      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);
      if (window.Cal) mount(); // script was already loaded by a previous embed
      return () => {
        cancelled = true;
        clearTimeout(timer);
        script.removeEventListener('load', onLoad);
        script.removeEventListener('error', onError);
      };
    }

    return () => { cancelled = true; clearTimeout(timer); };
  }, [calLink, loadTimeoutMs]);

  if (!calLink) return null;

  return (
    <div className="w-full">
      <div ref={containerRef} data-testid="cal-inline" style={{ minHeight: status === 'failed' ? 0 : 320 }} />
      {status === 'failed' && (
        <a
          href={`https://cal.com/${calLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{title}</span>
        </a>
      )}
    </div>
  );
}
