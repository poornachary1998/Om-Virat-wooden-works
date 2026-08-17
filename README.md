# Om Sri Virat — Next.js website + Strapi CMS

A two-part setup:

- **`frontend/`** — the website, built with Next.js. This is what customers see.
- **`cms/`** — the Strapi content manager. This is where *you* add doors, beds and photos, with no code.
- **`images/`** — the 60 web-sized photos, ready to be uploaded into Strapi by the seed script.

Once running, adding a new door to the website means: log in to Strapi, click **Create new entry**, type a name, drop in a photo, hit Save. The website picks it up within a minute. You never touch code again.

---

## What you need first

Install **Node.js 20 or newer** from nodejs.org. Everything below runs in a terminal (Command Prompt on Windows, Terminal on Mac).

Check it worked:

```bash
node -v      # should print v20.x or higher
```

---

## Part 1 — Start Strapi (the CMS)

Strapi isn't bundled here, because it generates its own project. Create it once:

```bash
cd om-virat-nextjs
npx create-strapi-app@latest strapi --quickstart
```

That downloads Strapi, sets up a local SQLite database, and opens `http://localhost:1337/admin` in your browser. Create your admin account there — email and password of your choice. **Write these down**; this is your CMS login.

Stop the server with `Ctrl + C` when you need to.

### Add the content types

"Content types" are the shapes of your data — Product, Category, Site Settings. Copy the ready-made schemas in:

```bash
cp -r cms/schemas/api/* strapi/src/api/
```

(On Windows, just copy the folders inside `cms/schemas/api/` into `strapi/src/api/` in File Explorer.)

Restart Strapi:

```bash
cd strapi
npm run develop
```

In the admin panel you'll now see **Product**, **Category** and **Site Settings** in the left sidebar.

### Open up the API so the website can read it

Strapi hides everything by default. Go to:

**Settings → Users & Permissions → Roles → Public**

Tick `find` and `findOne` for **Product**, **Category** and **Site-setting**. Save.

---

## Part 2 — Upload all the photos automatically

You don't have to upload 60 photos by hand. The seed script does it.

First make a token: **Settings → API Tokens → Create new API Token**. Name it `seed`, token type **Full access**, duration **Unlimited**. Copy the token — Strapi shows it only once.

```bash
cd cms/seed
cp .env.example .env
```

Open `.env` in any text editor and paste the token after `STRAPI_TOKEN=`. Then:

```bash
npm run seed
```

You'll see it work through the list:

```
+ category: Main doors
+ product: Carved main door with pediment
+ product: Sunburst carved main door
...
+ hero slideshow: 7 images
Done. 40 new products.
```

It uploads every image, creates all 7 categories and 40 products with their English and Telugu names, and fills the home page slideshow. Re-running it is safe — it skips anything already there.

---

## Part 3 — Start the website

```bash
cd ../../frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`. The site is live, pulling everything from Strapi.

Keep **two terminals** open while working: one running Strapi (port 1337), one running Next.js (port 3000).

---

## Part 4 — Using the CMS day to day

See **[CMS-GUIDE.md](./CMS-GUIDE.md)** — that's the one to keep open. It covers adding a door, changing the slideshow, editing Telugu text, and what to do when a photo looks wrong.

---

## Going live

| Piece | Where it goes | Cost |
|---|---|---|
| Next.js website | Vercel (vercel.com) | Free tier is enough |
| Strapi CMS | Railway, Render, or a small VPS | ~₹400–800/month |
| Photos | Strapi's media library, or Cloudinary | Free tier is enough |
| Domain | e.g. omsriviratteakworks.in | ~₹700/year |

Set `NEXT_PUBLIC_STRAPI_URL` on Vercel to your live Strapi address and it works the same.

**Deploying Strapi to Render** — this repo already has a `render.yaml`
Blueprint and a `strapi/Dockerfile` ready to go. See
**[DEPLOY-RENDER.md](./DEPLOY-RENDER.md)** for the step-by-step.

**For Google ranking** — the site now targets "teak wood work in Karimnagar" in its title, headings, alt text and structured data, but ranking #1 in the local map pack is driven mostly by signals outside the website. Do these, roughly in order of impact:

1. Create a **Google Business Profile** for Om Sri Virat — free, and it drives local map results more than the website does. Name it exactly `Om Sri Virat Wooden Furniture, Building Works & Aluminium Works`, category "Furniture manufacturer" + "Carpenter" + "Door supplier", add hours, phone, service area (Karimnagar), and real photos of finished work. Keep the business name, address and phone (NAP) **identical** everywhere it appears online.
2. Ask every customer for a **Google review**, and reply to each one — review count and recency is the single biggest lever in local search, more than anything on the website.
3. Get listed on local directories (JustDial, IndiaMART, Sulekha, Facebook) with the same NAP, and try to get a few backlinks from Karimnagar/Telangana business or news sites.
4. Point your domain at the site and submit it, plus the sitemap (`/sitemap.xml`), in **Google Search Console**. Request indexing after launch.
5. Post photos of new work to the Business Profile regularly — Google treats an active profile as a stronger local signal than a static one.

---

## Project structure

```
om-virat-nextjs/
├── frontend/                  Next.js website
│   ├── src/app/
│   │   ├── layout.js          SEO metadata + business schema for Google
│   │   ├── page.js            Home page
│   │   └── catalog/page.js    Catalog page
│   ├── src/components/        Header, Hero, Carousel, CatalogGrid, Contact…
│   ├── src/lib/strapi.js      All CMS reads happen here
│   └── src/lib/i18n.js        English / Telugu text and the toggle
├── cms/
│   ├── schemas/api/           Content types to copy into Strapi
│   └── seed/upload.mjs        Uploads all photos and creates entries
└── images/                    60 web-sized jpgs
```
