# Deploying the Omnistu Interior Engine demo

## Cloudflare Pages (preferred - free plan, no non-commercial restriction found in the Self-Serve terms; verify account state before committing)

1. Create a Pages project from this repo (or direct-upload `dist`). Build
   command `npm run build`, output directory `dist`.
2. Optional environment variables (see `.env.example`):
   - `VITE_LEAD_ENDPOINT` - JSON POST destination for lead form submissions.
     Without it the site runs in an explicit demo mode where submissions are
     not sent anywhere.
   - `VITE_DEMO_WHATSAPP` - digits-only number for the direct WhatsApp
     fallback in the lead modal.
   - `VITE_BOOKING_URL` - public scheduler link for the "Book a Consultation
     Slot" button (e.g. a Cal.com page). Hidden when unset.
3. Redeploy after changing env vars (they are baked in at build time).

## Cloudflare DNS (to serve on id.omnistu.com)

The zone is on Cloudflare (kobe.ns.cloudflare.com). In the Pages project's
custom-domain settings add `id.omnistu.com`; Cloudflare creates the record
automatically when the zone is on the same account. The apex corporate site
is out of scope here and must not be replaced without verifying the existing
project first.

## Vercel (optional alternative)

Note: Vercel Hobby is restricted to non-commercial use
(https://vercel.com/docs/plans/hobby); this commercial demo needs Pro
($20/mo) or a different host. `vercel.json` is included for optionality.

## Honesty guarantees baked into this branch

- AI output is labeled a design concept for inspiration/planning; visitor
  photos are never sent or analyzed (free Pollinations tier does not see the
  upload).
- Portfolio cards are marked ILLUSTRATIVE SAMPLE with stock Unsplash photos.
- Lead success is claimed only after the configured endpoint confirms
  receipt; otherwise the UI says the request was not sent.
- Preset clients are marked sample profiles with no real contact details.
- `?view=embed` renders the studio as an embeddable widget for clients who
  already have a website (see EMBED.md).
