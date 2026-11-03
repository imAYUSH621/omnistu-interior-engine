import { it, expect, vi } from 'vitest';
import { handoffLeadToCrm, handoffRecovery } from '../src/services/crmHandoff';
it('never automatically retries ambiguous acceptance or repeats delivered email', () => {
 for (const state of ['unknown','failed','synced','skipped']) {
  expect(handoffRecovery(state).autoRetry).toBe(false);
  expect(handoffRecovery(state).deliveryMustBeRepeated).toBe(false);
 }
 expect(handoffRecovery('unknown').next).toBe('check_destination_before_retry');
});
it('aborts an unresponsive handoff and preserves uncertainty without replay', async () => {
 const fetchImpl=vi.fn((_, options)=>new Promise((_, reject)=>options.signal.addEventListener('abort',()=>reject(new Error('timed out')))));
 expect(await handoffLeadToCrm({ endpoint:'https://crm.example/hook', lead:{name:'Fake'}, fetchImpl, timeoutMs:5 })).toBe('unknown');
 expect(fetchImpl).toHaveBeenCalledTimes(1);
});
it('server failure is ambiguous even if the proxy reports rejection', async () => {
 const fetchImpl=vi.fn().mockResolvedValue({ok:false,status:502});
 expect(await handoffLeadToCrm({ endpoint:'https://crm.example/hook', lead:{name:'Fake'}, fetchImpl })).toBe('unknown');
 expect(fetchImpl).toHaveBeenCalledTimes(1);
});
