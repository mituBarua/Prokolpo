# Prokolpo — Interior Design Studio website

Next.js 15 (App Router) site for Prokolpo, Chattogram. All pages are statically generated.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Vercel → Add New Project → import the repo (framework: Next.js, no settings needed).
3. When you have a domain, set the env var `NEXT_PUBLIC_SITE_URL` (e.g. `https://prokolpo.com.bd`) and redeploy —
   canonical URLs, sitemap and structured data use it.

## Where to edit
- **Projects / photos** → `lib/projects.json` (+ images in `public/projects/`). Each project gets its own page at `/projects/<id>` automatically.
- **Home-page featured 6** → `FEATURED` in `lib/projects.ts`
- **Phone, WhatsApp, address** → `lib/site.ts`
- **FAQ** (also used for Google FAQ rich results) → `lib/faq.ts`
- **3D scenes** → `lib/three/tunnel.js` (hero) and `lib/three/room.js` (3D room)

## SEO / GEO included
- Per-page titles, descriptions, canonical URLs, Open Graph & Twitter cards
- JSON-LD: LocalBusiness (HomeAndConstructionBusiness), FAQPage, CollectionPage, CreativeWork per project, BreadcrumbList
- `/sitemap.xml` (with image entries), `/robots.txt`, `/llms.txt` (summary for AI search engines)
- next/image (AVIF/WebP, responsive sizes), self-hosted fonts, lazy-loaded Three.js

## After going live
- Submit `https://<domain>/sitemap.xml` in Google Search Console.
- Create/claim the Google Business Profile with the **same** name, address and phone as `lib/site.ts`, and add the website link.
- Add the website link to the Facebook page.
