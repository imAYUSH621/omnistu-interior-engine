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
