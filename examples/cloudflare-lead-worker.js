// The old demo relay used wildcard CORS and unbounded input. Do not deploy it.
// Use the validated generic contract in workers/crm-adapter/worker.js instead.
// That adapter is mock-tested but NOT a deployed or CRM-verified integration.
// See BACKEND.md for exact payload, required bindings and activation gates.
export { default } from '../workers/crm-adapter/worker.js';
