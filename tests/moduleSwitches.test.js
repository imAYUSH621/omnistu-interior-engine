import { describe, it, expect } from 'vitest';
import { getModules, DEFAULT_MODULES, PRESET_CLIENTS, DEFAULT_CLIENT } from '../src/data/clients';

describe('getModules', () => {
  it('defaults every module on for backward compatibility', () => {
    const m = getModules({});
    for (const key of Object.keys(DEFAULT_MODULES)) expect(m[key]).toBe(true);
  });

  it('honours per-client boolean overrides and ignores junk', () => {
    const m = getModules({ modules: { estimator: false, booking: false, whatsapp: 'no', unknown: true } });
    expect(m.estimator).toBe(false);
    expect(m.booking).toBe(false);
    expect(m.whatsapp).toBe(true); // non-boolean junk ignored
    expect(m.aiStudio).toBe(true);
    expect(m).not.toHaveProperty('unknown');
  });

  it('preset clients carry crmWebhookUrl and analyticsEndpoint fields, empty by default', () => {
    for (const c of Object.values(PRESET_CLIENTS)) {
      expect(c).toHaveProperty('crmWebhookUrl');
      expect(c).toHaveProperty('analyticsEndpoint');
      expect(c.crmWebhookUrl).toBe('');
      expect(c.analyticsEndpoint).toBe('');
    }
    expect(DEFAULT_CLIENT).toHaveProperty('crmWebhookUrl');
  });
});
