# Local acceptance without service credentials

This suite exercises the real app in a local Chromium browser, not a public
deployment. Every non-local HTTP request is intercepted and aborted or answered
with a test fixture. It cannot send email, create CRM records, contact the image
provider, collect analytics or book an appointment.

```sh
npm ci
npx playwright install chromium
npm test
npm run test:e2e
npm run build
```

With an existing Chrome installation, set `CHROME_PATH=/path/to/chrome` instead
of downloading Chromium. The browser suite starts/stops Vite on 127.0.0.1:3000.
JSON results/screenshots go to ignored `test-results/`.

Covered: estimator-to-enquiry context, delivery acceptance versus CRM failure,
provider rejection blocking CRM, actual iframe host rendering, mobile scrolling
and consent, unconfigured custom-client isolation and double-submit protection.
Unit tests also exercise the generic Worker contract and owner-preview filtering.

These tests prove local behavior with controlled responses. They do NOT verify
an inbox, an actual CRM, booking availability, deployed CORS, provider terms,
client content/licensing or production security. The browser-local owner preview
is filtered by studio but is not an authenticated multi-user CRM. Old local
records without a studio identifier are not shown as someone else's leads.

## Per-client activation

Select approved modules in the profile, not from assumptions about every studio.
Set only that client's destinations. Custom/sample profiles must not inherit the
master business email key. Before activating a real account, verify owner consent,
credential handling, price bands, consultation policy and conflict handling.

Keep booking slots unavailable until approved. 'Hidden' only removes a Cal.com
link from its profile. Production hosting is not part of running these tests.
GitHub Pages must not be republished under the current owner instruction.

## Executable activation gate

```sh
npm run check:client -- examples/clients/existing-site-pilot.json
npm run check:client -- examples/clients/full-site-pilot.json
```

Both samples intentionally exit 1 (NOT ready). Copy a sample, choose modules
for the client and record only acceptance evidence actually verified. The gate
prints configured versus verified separately and exits 0 only when all selected
modules and base hosting/content/privacy/email gates pass. It never deploys,
sends or stores a secret. No API keys belong in the evidence JSON.

The existing-site sample doesn't force a replacement website, CRM, booking,
estimator or portfolio onto a business that doesn't need them. The full-site
sample shows their additional activation requirements. An operator can lie in
the evidence flags; this tool is a checklist, NOT an independent service audit.

CRM has its own `modules.crm` switch now, so email delivery can stay enabled
while CRM handoff stays disabled, even if an old endpoint is still configured.
