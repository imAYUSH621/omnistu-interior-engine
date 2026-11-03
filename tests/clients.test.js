import { describe, it, expect } from 'vitest';
import { getClientProfile, isPlatformDemoHost, PRESET_CLIENTS, DEFAULT_CLIENT } from '../src/data/clients';

describe('Multi-Tenant Client Resolution', () => {
  it('resolves preset clients accurately by slug', () => {
    const delAir = getClientProfile('del-air');
    expect(delAir.name).toBe('Del-Air Luxury Home & Remodeling');
    expect(delAir.city).toContain('Florida');

    const studioLuxe = getClientProfile('studio-luxe');
    expect(studioLuxe.name).toBe('Studio Luxe Architectural Interiors');
  });

  it('falls back to DEFAULT_CLIENT when slug is empty or null', () => {
    expect(getClientProfile(null)).toEqual(DEFAULT_CLIENT);
    expect(getClientProfile('')).toEqual(DEFAULT_CLIENT);
  });

  it('synthesizes dynamic client when unknown slug is passed', () => {
    const custom = getClientProfile('highland-modern-design');
    expect(custom.id).toBe('highland-modern-design');
    expect(custom.name).toBe('Highland Modern Design');
    expect(custom.heroHeadline).toContain('Highland Modern Design');
  });

  it('decodes customized query parameters across devices', () => {
    const params = new URLSearchParams({
      client: 'custom-firm',
      name: 'Vance Architecture & Living',
      city: 'Aspen, Colorado',
      phone: '+1 (970) 555-0188',
      tagline: 'High-Altitude Luxury Alpine Architecture'
    });

    const profile = getClientProfile('custom-firm', params);
    expect(profile.name).toBe('Vance Architecture & Living');
    expect(profile.city).toBe('Aspen, Colorado');
    expect(profile.phone).toBe('+1 (970) 555-0188');
    expect(profile.whatsapp).toBe('19705550188');
    expect(profile.tagline).toBe('High-Altitude Luxury Alpine Architecture');
  });
});


describe('Platform demo hosts', () => {
  it('treats static hosting platform subdomains as deploy accounts, not client brands', () => {
    expect(isPlatformDemoHost('imayush621.github.io')).toBe(true);
    expect(isPlatformDemoHost('studio.pages.dev')).toBe(true);
    expect(isPlatformDemoHost('demo.netlify.app')).toBe(true);
    expect(isPlatformDemoHost('app.vercel.app')).toBe(true);
  });

  it('treats real client subdomains as client brands', () => {
    expect(isPlatformDemoHost('del-air.omnistu.com')).toBe(false);
    expect(isPlatformDemoHost('id.omnistu.com')).toBe(false);
    expect(isPlatformDemoHost('')).toBe(false);
  });
});
