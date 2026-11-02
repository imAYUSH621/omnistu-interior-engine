# Embedding the Omnistu AI concept widget into an existing website

For clients who already have a website: the engine renders a compact
widget-only view (AI design concept studio + lead capture) that can be
iframed into any page. No redesign or replacement of the client's site is
needed.

## 1. Embed snippet

```html
<iframe
  id="omnistu-embed"
  src="https://id.omnistu.com/?view=embed&client=CLIENT_SLUG"
  style="width:100%;border:0;min-height:900px"
  loading="lazy"
  title="AI design concept studio"
></iframe>
<script>
  // Optional: auto-resize the iframe to the widget's content height
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'omnistu-embed-height') {
      const f = document.getElementById('omnistu-embed');
      if (f) f.style.height = e.data.height + 'px';
    }
  });
</script>
```

Replace `CLIENT_SLUG` with the client's profile slug, or append
`&name=Studio+Name&city=City` for an unconfigured brand preview.

## 2. What runs inside the embed

- The AI concept studio (`?view=embed` renders only this section plus the
  lead modal - no navbar, hero, portfolio or footer).
- Lead capture posts to `VITE_LEAD_ENDPOINT` when configured at build time;
  otherwise it shows the explicit "Demo Mode - Not Sent" state. Nothing is
  silently sent anywhere.
- The direct WhatsApp and booking buttons appear only when
  `VITE_DEMO_WHATSAPP` / `VITE_BOOKING_URL` are configured.

## 3. Honesty notes

- Visitor photos stay on the page and are never sent or analyzed; the AI
  concept is generated from style choices only (free Pollinations tier).
- The embed is a style-concept tool, not a photo-realistic preview of the
  visitor's actual room; the UI says so.
