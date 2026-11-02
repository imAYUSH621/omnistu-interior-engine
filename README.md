# Omnistu Interior Engine (roomGPT Adaptive Architecture)

A multi-tenant, zero-cost, high-converting interior design & architectural remodeling client acquisition platform. Adapted from the open-source **`Nutlope/roomGPT`** architecture and upgraded with **zero-cost AI image generation**, **dynamic multi-tenant client onboarding**, **interactive split-screen room staging**, and a **transparent investment scope calculator**.

---

## 💎 What Makes This Solution 100% Free & Zero-Waste

| Feature | Standard roomGPT / Saas | Omnistu Interior Engine |
|---|---|---|
| **AI Inference** | Paid Replicate API ($0.05/img) | **100% Free Pollinations.ai Flux** (Zero keys, zero auth, zero rate limits) + SOTA fallbacks |
| **Image Hosting** | Paid Bytescale / AWS S3 | **In-Browser Client FileReader** (Zero external storage cost) |
| **Hosting & CDN** | Dedicated Node.js server | **Vercel Global Edge CDN** (Zero serverless cold starts, free tier) |
| **Multi-Tenancy** | Individual site per client | **Single codebase with Subdomain & Query routing** (`*.omnistu.com` / `?client=del-air`) |
| **Speed-to-Lead** | Slow 48-hr email form | **Direct WhatsApp Concierge & Instant Lead Handoff** |

---

## 🚀 Instant Vercel Deployment (1-Click)

### Step 1: Deploy with Vercel CLI
```powershell
cd C:\Users\ANANTMADHAV\PROJECTS\omnistu-interior-engine
npx vercel --prod
```

### Step 2: Configure Wildcard Subdomains (Optional)
In your Vercel Project Dashboard:
1. Go to **Settings → Domains**.
2. Add your wildcard domain: `*.omnistu.com` (or `id.omnistu.com`).
3. Set CNAME in DNS to `cname.vercel-dns.com`.
4. Now, any interior designer or contractor can access their customized portal via:
   - `https://del-air.omnistu.com`
   - `https://studio-luxe.omnistu.com`
   - Or standard query: `https://id.omnistu.com/?client=del-air`

---

## 🛠 Features Built-In

1. **Interactive AI Room Stager (Adapted from roomGPT)**:
   - Select room type (Living Pavilion, Gourmet Kitchen, Primary Suite, Wellness Bath) or upload existing room photo.
   - Choose signature architectural aesthetic (Japandi Serenity, Warm Organic Modern, Bespoke Italian Luxury, Modern Haussmann).
   - Generates photorealistic 8K render via Pollinations Flux API.
   - Interactive Before/After split slider with smooth drag controls.
2. **Transparent Investment & Scope Calculator**:
   - Scope picker + square footage slider (150 to 5,000 sq ft).
   - Real-time budget band and labor/material breakdown ($35k - $120k+).
3. **SOTA Curated Architectural Portfolio**:
   - CC0 Unsplash luxury transformation case studies with interactive flip toggle (Before vs. After).
4. **Frictionless Lead Capture & WhatsApp Handoff**:
   - Captures high-ticket homeowner leads.
   - Dispatches instant WhatsApp chat link with prefilled room and budget context.
5. **30-Second Client Onboarding Wizard (`Navbar → Switch Client → + Onboard New Firm`)**:
   - Enter any company name from your 500 leads.
   - Generates their branded portal and shareable pitch link instantly.

---

## 💻 Local Preview
```powershell
# Quick local preview server
python serve.py 3000
# Open http://localhost:3000
```
