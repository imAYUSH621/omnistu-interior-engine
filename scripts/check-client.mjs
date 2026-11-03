import fs from 'node:fs';
import { assessClientReadiness } from '../src/services/clientReadiness.js';
const path = process.argv[2];
if (!path) { console.error('Usage: npm run check:client -- ./client-activation.json'); process.exit(2); }
const { client, evidence = {} } = JSON.parse(fs.readFileSync(path, 'utf8'));
if (!client?.id || !client?.name) throw new Error('Client id and name are required');
const result = assessClientReadiness(client, evidence);
console.log(JSON.stringify(result, null, 2));
// A gate: no deployment is performed. Caller decides whether/how to activate.
process.exitCode = result.productionReady ? 0 : 1;
