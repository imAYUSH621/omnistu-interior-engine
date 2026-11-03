# Omnistu Interior Engine

Reusable React demo for interior-business websites and enquiry funnels. This is
an inspectable prototype, not a fully connected client service or an automatic
room-photo redesign tool.

## Demonstrated

- Branded sample websites and per-client module switches.
- Existing-site iframe integration: `public/host-demo.html`, with `EMBED.md`.
- Style-based concept generation with explicitly labelled sample fallbacks.
  Uploaded photos stay in the browser and are NOT used to condition generation.
- Illustrative configurable estimator, not a contractor quote.
- Structured enquiry context and browser-local owner preview, not a CRM.
- Master demo's email connector is configured; named sample studios are not.
  Provider acceptance, inbox receipt, and CRM creation are separate checks.
- Booking integration code exists, but all master-account events are hidden
  until the owner confirms hours, duration and medium. No calendar connected.

## Not established

- A production connection to the owner's chosen '20CRM'. The generic adapter
  is contract-tested with mocked upstream responses only. See `BACKEND.md`.
- Reliable/unlimited free image inference, photo-conditioned redesign,
  automatic floor plans, interactive furnished 3D tours or proved sales lift.
- Commercial hosting, custom domain, production privacy/retention policy,
  accessibility/security acceptance, or client-specific content approval.

## Develop and test

```sh
npm ci
npm test
npm run dev
npm run build
# For the existing repository-path demonstration only:
npm run build:pages
```

Run the development server for source preview; do not use a Python static
server to serve uncompiled JSX.

## Production release gates

Use a commercial-permitted host with verified current terms/account limits.
GitHub Pages is for the sample demonstration, NOT the client production hosting
plan. Vercel Hobby is non-commercial; do not silently deploy this service there.
See `DEPLOY.md`.

Configure each client's approved destinations, account ownership, content,
prices and consultation policy. Keep credentials server-side. Use sample data
for acceptance tests. Verify actual inbox receipt, actual CRM record creation,
and booking/conflict handling separately before promising those modules.

Concept/sample imagery is not a client portfolio. Third-party asset, dependency,
and code provenance still needs review before a paid client delivery. No client
results, revenue guarantees, unlimited inference, or automatic photo-redesign
claims are supported.
