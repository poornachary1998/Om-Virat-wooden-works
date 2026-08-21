# Om Sri Virat — Site Audit & Business Growth Strategy

*Prepared by reviewing the om-virat-nextjs repo (frontend, Strapi CMS, and design reference) through five lenses: technical SEO, AI-engine discoverability, brand/UI design, and business strategy, with paid media considered but scaled down for a business this size.*

## The headline

This site is in noticeably better shape than most local-business websites its age. It has real structured data, bilingual English/Telugu support, a working sitemap and robots file, and a genuinely coherent visual identity — the teak-and-brass palette with Marcellus serif headings reads as intentional, not templated. The gap isn't technical foundation; it's content depth and one real bug in the catalog navigation. Combined with the Search Console data from earlier (indexed August 17, three impressions, verified Google Business Profile already live), the picture is: infrastructure is ready, the business now needs volume — more indexable pages, more reviews, more backlinks — for Google to have enough to rank on.

## What's already working (keep doing this)

The homepage layout metadata is doing real work: a specific, keyword-rich title and description, Open Graph tags, a self-referencing canonical, and a `HomeAndConstructionBusiness` JSON-LD block with phone, map link, service area, and hours. That JSON-LD is exactly what the AEO Foundations Architect lens looks for first, and it's already there. `robots.js` allows all crawlers with no accidental blocks, which also means AI crawlers (GPTBot, ClaudeBot, PerplexityBot) aren't blocked — nothing to fix on that front.

The rendering model is also better than it looked from the outside. Earlier, working only from the live URL, there was a note that the site "appears to depend on JavaScript for rendering" because of the Next.js/Strapi footer credit. Having now read the actual code: `page.js` and `catalog/page.js` are async Server Components that fetch from Strapi and render server-side before any client JavaScript runs. The interactive pieces (language toggle, carousel, lightbox) are client components layered on top, but the content itself is in the initial HTML. That earlier concern doesn't hold up against the real code — this is not a JS-dependent parsability problem.

The brand system in `globals.css` is coherent enough that the Brand Guardian lens doesn't have much to push back on: a defined teak/brass/cream palette, Marcellus for headings against Karla for body text, consistent spacing, visible focus states, and a `prefers-reduced-motion` guard. The UI Designer lens likewise found real accessibility care — skip-to-content link, `aria-pressed` on toggles, alt text generated per-image from product and category names rather than left blank. For a two-person dev effort on a trade business site, this is above the typical bar.

## The one real bug worth fixing first

The home page's category cards (`CategoryGrid.jsx`) link to `/catalog?category=main-doors`, `/catalog?category=beds`, and so on. But `CatalogGrid.jsx` initializes its filter with `useState('all')` and never reads the URL's `category` query parameter. So every one of those links lands on the full, unfiltered catalog — the deep link silently does nothing. This is both a small UX papercut (a visitor clicking "Main doors" from the homepage expects to see main doors, not everything) and a missed SEO structural opportunity: because the filter state never touches the URL, there's no way for `/catalog?category=main-doors` to become a distinct, shareable, indexable landing page that could rank for "teak main doors Karimnagar" separately from "teak beds Karimnagar." Fixing this is a small change — read `searchParams.category` in `catalog/page.js` and pass it as the initial filter — but it closes a real gap between what the site's own links promise and what they deliver, and it's a prerequisite for the sitemap/content expansion below.

## Technical SEO: what would move the needle next

The sitemap (`sitemap.js`) currently lists exactly two URLs — the homepage and `/catalog` — both with the same `lastModified: new Date()` on every request, which tells Google nothing useful about what actually changed. There are 7 categories and roughly 40 products in the CMS seed data, none of which have their own indexable URL. Every one of those is a page Google could rank independently for a specific long-tail search ("carved main door with pediment Karimnagar," "CNC pooja door Karimnagar") that the current one-big-grid structure can't capture on its own. This is the single highest-leverage content change available: turning categories into real routed pages (once the query-param bug above is fixed, `/catalog/main-doors` as a proper route rather than a query string would be even stronger) and, if feasible later, giving each product a dedicated page with its own title, description, and image.

Related to that: with roughly 60 product photos already shot and captioned in two languages, an image sitemap or at minimum keeping the descriptive alt text (already present) consistent across any new per-product pages would help Google Images traffic, which matters more for a furniture business than most categories — people search "main door design" in Google Images constantly before calling a carpenter.

The site is currently thin in a different sense too: there's no supporting content beyond the catalog itself — no page answering "how to choose teak vs. other wood," "what does CNC pooja door carving involve," or similar. This is the kind of content Search Console's Queries report would likely show as missing opportunity once you check it: informational searches that a Karimnagar customer runs before they're ready to call, which the site currently has no page to catch.

## AI-engine discoverability (AEO)

Given the site's actual scale, a full `llms.txt` / `AGENTS.md` buildout isn't a priority — that infrastructure earns its keep on content-heavy sites with dozens of documentation pages, not a single-location trade business's catalog. The one AEO-relevant fact worth knowing: robots.js already defaults to allowing everything, which is the correct posture and means ChatGPT, Perplexity, and Claude's own crawlers aren't blocked from citing the business if they ever crawl it. Nothing to build here yet; revisit only if the content footprint grows substantially (a blog, a multi-location expansion, etc.).

## Brand and UI: refinements, not an overhaul

The existing identity is worth protecting rather than replacing. If anything, the Brand Guardian lens would flag that there's no written style guide anywhere in the repo — if a second developer or designer ever touches this, the color tokens and type choices live only in `globals.css` with no documented rationale. A one-page brand reference (the existing CSS custom properties, the two typefaces and why, the tone of the English and Telugu copy) would be a cheap insurance policy, not urgent.

On the UI side beyond the catalog-filter bug: there's no `loading.js` for the catalog or home route, and the Strapi fetch helper (`lib/strapi.js`) silently swallows errors and returns an empty array on failure. That's a reasonable fallback for resilience, but it means if the Strapi backend has an outage, a visitor sees a mostly-empty homepage with no explanation rather than a friendly "check back shortly" state. Worth a small empty-state message given the whole business depends on this page working.

## Business strategy: positioning and priorities

The business itself is not a startup finding its footing — 25+ years, 1,200+ projects, 30 workers, and an already-verified Google Business Profile is a genuinely strong base that most local competitors on a `.netlify.app` subdomain would not have. The strategic question worth sitting with deliberately, rather than assuming: the business (and the site's own title tag) spans three distinct trades — wooden furniture, building works, and aluminium works. That breadth is a real strength for wallet-share with existing customers who need more than one service, but it can also dilute who thinks of Om Sri Virat *first* for any single one of those three things. The CNC pooja door line in particular stands out as a specific, lower-competition niche ("CNC pooja door Karimnagar" is a much easier search to own than "furniture Karimnagar") — worth considering whether it deserves its own emphasis (a dedicated page, its own photos-forward treatment) rather than being one category among seven.

The README already correctly identifies the highest-leverage off-site moves — Google Business Profile (done), review velocity, local directory listings with consistent NAP, and Search Console submission (done). That guidance lines up with what came out of the earlier Search Console check in this conversation: the site is indexed but barely visible yet (3 impressions in one day), which is normal for a domain this new and is fixed by exactly those off-site signals compounding over weeks, not by further website changes.

On paid media: not yet. A PPC test only makes sense once there's a stable organic and GBP baseline to compare against, and $10K–$10M-scale account architecture (that persona's default frame) is irrelevant at this stage. If a paid test happens at all in the next few months, keep it small and local — a few hundred rupees a day on Google Search ads targeting "teak main door Karimnagar" or "CNC pooja door Karimnagar," measured against calls and WhatsApp enquiries, is enough to learn whether paid is worth expanding.

## Prioritized action plan

**Do now (site-side, cheap, high leverage):**
Fix the category-filter bug so `/catalog?category=X` actually filters. Expand `sitemap.js` to include a URL per category (and per product once/if individual pages exist) with real `lastModified` values tied to CMS updates rather than `new Date()` on every build.

**Next 4–6 weeks:**
Turn categories into real routed, indexable pages. Write 3–5 short informational pages or sections (teak vs. other wood, what CNC pooja door carving means, how measurements/ordering works) to give Google more to index beyond the catalog grid. Add a friendly empty-state message for when the Strapi backend is unreachable.

**Ongoing, off-site (matches the README's own plan — keep executing it):**
Push review velocity on the already-verified Google Business Profile — this is still the single biggest lever available, bigger than anything on the site itself. Get NAP-consistent listings on JustDial, IndiaMART, Sulekha, and Facebook. Post new work photos to the Business Profile regularly.

**Later, only once the above is showing traction:**
Consider individual product pages for the strongest sellers. Consider a small, tightly-measured local PPC test. Write a one-page internal brand/style reference so the visual system survives a change in who maintains the site.

---
*Personas referenced: SEO Specialist, AEO Foundations Architect, Brand Guardian, UI Designer, Business Strategist, and PPC Campaign Strategist (scaled to local-business size) — from the msitarzewski/agency-agents collection.*
