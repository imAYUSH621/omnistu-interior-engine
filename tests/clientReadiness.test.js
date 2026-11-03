import { describe, it, expect } from 'vitest';
import { assessClientReadiness } from '../src/services/clientReadiness';
import { DEFAULT_CLIENT } from '../src/data/clients';
describe('client activation checklist', () => {
 it('never equates configured demo connectors with production acceptance', () => {
  const result = assessClientReadiness(DEFAULT_CLIENT);
  expect(result.productionReady).toBe(false);
  expect(result.checks.find(c=>c.id==='email').configured).toBe(true);
  expect(result.checks.every(c=>!c.verified)).toBe(true);
 });
 it('excludes unselected modules instead of forcing a universal stack', () => {
  const result=assessClientReadiness({ ...DEFAULT_CLIENT, modules: { crm:false, booking:false, whatsapp:false, aiStudio:false, estimator:false, portfolio:false } });
  expect(result.checks.map(c=>c.id)).toEqual(['content','hosting','privacy','email']);
 });
 it('rejects insecure/unconfigured destinations even with claimed evidence', () => {
  const result=assessClientReadiness({ ...DEFAULT_CLIENT, web3formsKey:'', crmWebhookUrl:'http://crm.example', calLink:'' }, { inboxReceived:true, crmRecordCreated:true, bookingVerified:true, hostUrl:'https://user:password@host.example', hostingVerified:true });
  for (const id of ['email','crm','booking','hosting']) expect(result.checks.find(c=>c.id===id).verified).toBe(false);
 });
 it('requires every selected module and base acceptance to pass', () => {
  const client={ ...DEFAULT_CLIENT, isSample:false, modules: { crm:false, booking:false, whatsapp:false, aiStudio:false, estimator:false, portfolio:false } };
  const result=assessClientReadiness(client,{ hostUrl:'https://studio.example', contentApproved:true, hostingVerified:true, privacyApproved:true, inboxReceived:true });
  expect(result.productionReady).toBe(true);
  expect(assessClientReadiness(client,{ hostUrl:'https://studio.example', contentApproved:true, hostingVerified:true, inboxReceived:true }).productionReady).toBe(false);
 });
});
