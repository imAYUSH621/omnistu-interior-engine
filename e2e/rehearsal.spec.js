import { test, expect } from '@playwright/test';

test('self-contained client rehearsal: both setups, outcomes and no external work', async ({page}) => {
  const external = [], posts = [], errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const req = route.request();
    if (!req.url().startsWith('http://127.0.0.1:3000')) { external.push(req.url()); return route.abort(); }
    if (req.method() === 'POST') posts.push(req.url());
    return route.continue();
  });
  await page.goto('/?view=offers');
  await page.getByRole('link', {name: /Rehearse the client journey/}).click();
  await expect(page.getByRole('heading', {name: /See what your studio gets/})).toBeVisible();
  await page.screenshot({path:'test-results/rehearsal-start.png', fullPage:true});
  await page.getByRole('button', {name:'Try the homeowner journey'}).click();
  await page.getByLabel("Homeowner's style preference").selectOption('Japandi');
  await page.getByRole('button', {name:'Use these project choices'}).click();
  await expect(page.getByText('Japandi', {exact:true})).toBeVisible();
  await page.getByLabel('Email accepted, CRM reply lost').check();
  await page.getByRole('button', {name:'Rehearse studio handoff'}).click();
  await expect(page.getByText(/CRM outcome is unknown/)).toBeVisible();
  await page.screenshot({path:'test-results/rehearsal-unknown.png', fullPage:true});
  await page.getByRole('button', {name:'Try another setup'}).click();
  await page.getByRole('button', {name:/We need a full studio website/}).click();
  await page.getByRole('button', {name:'Try the homeowner journey'}).click();
  await expect(page.getByRole('button', {name:'Use this illustrative estimate'})).toBeVisible();
  await page.getByRole('button', {name:'Use this illustrative estimate'}).click();
  await expect(page.getByText(/₹.* - ₹/)).toBeVisible();
  await page.getByLabel('Delivery rejected', {exact:true}).check();
  await page.getByRole('button', {name:'Rehearse studio handoff'}).click();
  await expect(page.getByRole('heading', {name:'Not delivered - do not claim receipt'})).toBeVisible();
  await page.getByRole('button', {name:'Try another setup'}).click();
  await page.getByRole('button', {name:'Try the homeowner journey'}).click();
  await page.getByRole('button', {name:'Use this illustrative estimate'}).click();
  await page.getByRole('button', {name:'Rehearse studio handoff'}).click();
  await expect(page.getByText(/CRM is intentionally not connected/)).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'test-results/rehearsal-mobile.png',fullPage:true});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const data = await page.evaluate(() => ({local: Object.keys(localStorage), session: Object.keys(sessionStorage)}));
  expect(data).toEqual({local:[],session:[]});
  expect(external.every(url => url.startsWith('https://fonts.googleapis.com/'))).toBe(true); expect(posts).toEqual([]); expect(errors).toEqual([]);
});
