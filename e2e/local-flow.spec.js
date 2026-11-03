import { test, expect } from '@playwright/test';

// Local browser acceptance only. Every non-local request is intercepted:
// no email, CRM, analytics, image provider or booking service is contacted.
test.beforeEach(async ({ page }) => {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (['127.0.0.1', 'localhost'].includes(url.hostname)) return route.continue();
    return route.abort();
  });
  await page.addInitScript(() => sessionStorage.setItem('omnistu_demo_prologue_seen', '1'));
});
async function fill(page) {
  await page.getByPlaceholder('e.g. Katherine Vance').fill('Local Test Visitor');
  await page.getByPlaceholder('+1 (555) 019-2834').fill('+15550100000');
  await page.getByPlaceholder('katherine@vance.com').fill('local-test@example.com');
}
async function request(page) {
  await page.getByRole('button', { name: 'Request My Free Consultation', exact: true }).click();
}

test('estimate context reaches enquiry storage and matching owner preview without any delivery', async ({ page }) => {
  await page.goto('/?client=modnest-living');
  const estimator = page.locator('#cost-estimator');
  await estimator.getByRole('button', { name: 'Whole Home Remodel', exact: true }).click();
  await estimator.getByRole('button', { name: /Smart Basics/ }).click();
  await estimator.getByRole('button', { name: /consult|quote|estimate|scope/i }).last().click();
  await fill(page); await request(page);
  await expect(page.getByText('Demo Mode - Not Sent', { exact: true })).toBeVisible();
  const leads = await page.evaluate(() => JSON.parse(localStorage.getItem('omnistu_leads')));
  expect(leads[0].context.room).toBe('Whole Home Remodel');
  expect(leads[0].context.budget).toContain('₹');
  expect(leads[0].name).toBe('Local Test Visitor');
  await page.getByRole('button', { name: 'Close Window', exact: true }).click();
  await page.getByRole('button', { name: 'How this works', exact: true }).click();
  await page.getByRole('button', { name: /start the guided tour/i }).click();
  await page.getByRole('button', { name: 'See what you receive', exact: true }).click();
  await expect(page.getByText('Local Test Visitor', { exact: true })).toBeVisible();
  await expect(page.getByText(/Whole Home Remodel • Smart Basics/)).toBeVisible();

  await page.screenshot({ path: 'test-results/local-estimate-enquiry.png' });
});

test('master email acceptance and CRM failure remain separate, all requests mocked', async ({ page }) => {
  let sent = 0, crm = 0;
  await page.route('https://api.web3forms.com/submit', route => { sent++; return route.fulfill({ json: { success: true } }); });
  await page.route('https://crm-test.example/hook', route => { crm++; return route.fulfill({ status: 502, json: { ok: false } }); });
  await page.goto('/?demoMode=endpoints&crmWebhook=https://crm-test.example/hook');
  await page.getByRole('button', { name: 'Request Consultation', exact: true }).click();
  await fill(page);
  await expect(page.getByRole('button', { name: 'Request My Free Consultation', exact: true })).toBeDisabled();
  await page.getByRole('checkbox').check();
  await request(page);
  await expect(page.getByText('Request Accepted by Delivery Service', { exact: true })).toBeVisible();
  await expect(page.getByText(/Demo handoff endpoint failed/)).toBeVisible();
  expect(sent).toBe(1); expect(crm).toBe(1);
});

test('delivery rejection never attempts CRM or claims acceptance', async ({ page }) => {
  let crm = 0;
  await page.route('https://api.web3forms.com/submit', route => route.fulfill({ json: { success: false } }));
  await page.route('https://crm-test.example/hook', route => { crm++; return route.fulfill({ json: { ok: true } }); });
  await page.goto('/?demoMode=endpoints&crmWebhook=https://crm-test.example/hook');
  await page.getByRole('button', { name: 'Request Consultation', exact: true }).click();
  await fill(page); await page.getByRole('checkbox').check(); await request(page);
  await expect(page.getByText('Sending Failed', { exact: true })).toBeVisible();
  expect(crm).toBe(0);
});

test('actual iframe host renders the concept tool without full-site navigation', async ({ page }) => {
  await page.goto('/host-demo.html');
  await expect(page.getByRole('heading', { name: 'Greenfield Interiors' })).toBeVisible();
  await page.locator('iframe').scrollIntoViewIfNeeded();
  await expect.poll(()=>page.frames().map(f=>f.url()).find(x=>x.includes('view=embed'))).toBeTruthy();
  const widget = page.frameLocator('iframe');
  await expect(widget.locator('#room-redesign')).toBeVisible({ timeout: 15000 });
  await expect(widget.getByRole('button', { name: 'Request Consultation', exact: true })).toHaveCount(0);
  await page.screenshot({ path: 'test-results/local-embed.png', fullPage: true });
});

test('mobile form is scrollable and consent stays visible, no accidental outbound requests', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?demoMode=endpoints&crmWebhook=https://crm-test.example/hook');
  await page.getByRole('button', { name: 'Consult', exact: true }).click();
  await expect(page.getByText(/enter fake\/sample details only/)).toBeVisible();
  const submit = page.getByRole('button', { name: 'Request My Free Consultation', exact: true });
  await submit.scrollIntoViewIfNeeded();
  await expect(submit).toBeVisible(); await expect(submit).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/local-mobile-consent.png' });
});

test('custom client link cannot inherit the master business delivery key', async ({ page }) => {
 let externalSubmissions = 0;
 await page.route('https://api.web3forms.com/submit', route => { externalSubmissions++; return route.fulfill({ json: { success: true } }); });
 await page.goto('/?client=local-test-studio&name=Local%20Test%20Studio');
 await page.getByRole('button', { name: 'Request Consultation', exact: true }).click();
 await fill(page); await request(page);
 await expect(page.getByText('Demo Mode - Not Sent', { exact: true })).toBeVisible();
 expect(externalSubmissions).toBe(0);
});

test('repeated clicks while delivering cannot create duplicate submissions', async ({ page }) => {
 let sent = 0; let release;
 const pending = new Promise(resolve => { release = resolve; });
 await page.route('https://api.web3forms.com/submit', async route => { sent++; await pending; await route.fulfill({ json: { success: true } }); });
 await page.goto('/'); await page.getByRole('button', { name: 'Request Consultation', exact: true }).click();
 await fill(page); await request(page);
 await expect(page.getByRole('button', { name: 'Sending request...', exact: true })).toBeDisabled();
 expect(sent).toBeLessThanOrEqual(1);
 release();
 await expect(page.getByText('Request Accepted by Delivery Service', { exact: true })).toBeVisible();
 expect(sent).toBe(1);
});
