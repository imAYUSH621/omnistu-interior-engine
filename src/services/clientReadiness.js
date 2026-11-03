import { getModules } from '../data/clients.js';

// Configuration checks only, not evidence that an account or service works.
// The caller supplies acceptance evidence after verifying the actual service.
const validHttps = value => {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
  catch { return false; }
};
export function assessClientReadiness(client, evidence = {}) {
  const modules = getModules(client);
  const checks = [];
  const add = (id, configured, verified, detail) => checks.push({ id, configured, verified: configured && verified === true, detail });
  add('content', !client.isSample, evidence.contentApproved, 'Real client content, licensed images, prices and contact details approved');
  add('hosting', validHttps(evidence.hostUrl), evidence.hostingVerified, 'Commercial-permitted host, account limits, domain and TLS verified');
  add('privacy', true, evidence.privacyApproved, 'Data destinations, retention, consent and browser-local storage reviewed');
  add('email', !!client.web3formsKey || validHttps(evidence.leadEndpoint), evidence.inboxReceived, 'Submit fake enquiry and inspect actual approved inbox receipt');
  if (modules.crm) add('crm', validHttps(client.crmWebhookUrl), evidence.crmRecordCreated, 'Verify actual selected CRM record, field mapping and duplicate handling; HTTP 2xx is insufficient');
  if (modules.booking) add('booking', /^[\w-]+\/[\w-]+$/.test(client.calLink || '') || validHttps(evidence.bookingUrl), evidence.bookingVerified, 'Approved hours, duration, medium, conflict/cancellation policy and real slot flow; Hidden is not disabled');
  if (modules.whatsapp) add('whatsapp', /^\d{7,15}$/.test(client.whatsapp || ''), evidence.whatsappApproved, 'Owner-approved business number and tested message context');
  if (modules.aiStudio) add('concepts', true, evidence.conceptAccepted, 'Style-only concepts/fallbacks accepted; not automatic redesign of the uploaded room');
  if (modules.estimator) add('estimator', !!client.estimator?.tiers?.length, evidence.ratesApproved, 'Client-specific currency, scope, rates and illustrative-quote wording approved');
  if (modules.portfolio) add('portfolio', true, evidence.portfolioApproved, 'Actual client portfolio or explicitly labelled licensed samples approved');
  return { clientId: client.id, purpose: 'configuration-and-acceptance-checklist', productionReady: checks.every(c => c.verified), checks };
}
