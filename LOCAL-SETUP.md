# Local setup in VS Code — step by step

Follow these in order. Every command goes in the VS Code terminal (**Terminal → New Terminal**, or `Ctrl + \``).

By the end you will have two servers running and the full site working on your own machine, with no internet needed except for the initial installs.

---

## Step 0 — Install what you need (once)

1. **Node.js 20 or newer** — download the LTS installer from [nodejs.org](https://nodejs.org) and run it.
2. **VS Code** — from [code.visualstudio.com](https://code.visualstudio.com).

Check both worked. Open VS Code → **Terminal → New Terminal** → type:

```bash
node -v
npm -v
```

You should see something like `v20.11.0` and `10.2.4`. If you see "command not found", close VS Code completely and reopen it — the installer needs a restart to register.

**Useful VS Code extensions** (click the Extensions icon in the left bar, search, Install):
- *ESLint*
- *Prettier — Code formatter*
- *Simple React Snippets*

---

## Step 1 — Open the project

1. Unzip `om-virat-nextjs.zip` somewhere easy, e.g. `Documents/om-virat-nextjs`.
2. VS Code → **File → Open Folder…** → select the `om-virat-nextjs` folder → **Open**.
3. In the Explorer panel on the left you should see `frontend`, `cms`, `images`, `README.md`.

---

## Step 2 — Create the Strapi CMS

Open a terminal in VS Code and make sure you are in the project root. The terminal prompt should end with `om-virat-nextjs`. If not:

```bash
cd path/to/om-virat-nextjs
```

Now create Strapi:

```bash
npx create-strapi-app@latest strapi --quickstart
```

- If it asks *"Ok to proceed?"* → type `y` and Enter.
- If it asks about a template or database → choose the defaults (Quickstart / SQLite).
- If it asks to log in or sign up to Strapi Cloud → choose **Skip**.

This takes 3–8 minutes. When it finishes, your browser opens at **http://localhost:1337/admin**.

### Create your admin account

Fill in first name, last name, email, password → **Let's start**.

> Write the email and password down. This is your CMS login from now on.

Leave that browser tab open.

---

## Step 3 — Add the content types

Content types are the shapes of your data: Product, Category, Site Settings.

**Stop Strapi first**: click into the terminal running it and press `Ctrl + C`.

Then copy the schemas in. In the VS Code terminal, from the project root:

**Mac / Linux:**
```bash
cp -r cms/schemas/api/. strapi/src/api/
```

**Windows (PowerShell):**
```powershell
Copy-Item -Recurse -Force cms\schemas\api\* strapi\src\api\
```

Or just do it in the VS Code Explorer: open `cms/schemas/api/`, select the three folders (`category`, `product`, `site-setting`), drag them into `strapi/src/api/`.

Check it looks like this:

```
strapi/src/api/
├── category/content-types/category/schema.json
├── product/content-types/product/schema.json
└── site-setting/content-types/site-setting/schema.json
```

### Start Strapi again

```bash
cd strapi
npm run develop
```

Refresh **http://localhost:1337/admin**. In the left sidebar under **Content Manager** you should now see **Category**, **Product** and **Site Setting**. If you don't, the folders went to the wrong place — check the paths above.

> **Leave this terminal running.** Strapi must stay up. Open a *second* terminal for everything below: click the **+** icon in the terminal panel.

---

## Step 4 — Open up the API

Strapi keeps everything private until you say otherwise. This is the step people miss.

In the admin panel:

1. **Settings** (bottom left) → **Users & Permissions Plugin → Roles**
2. Click **Public**
3. Scroll to **Permissions**. Expand **Category** → tick `find` and `findOne`
4. Expand **Product** → tick `find` and `findOne`
5. Expand **Site-setting** → tick `find`
6. Also expand **Upload** → tick `find` and `findOne` (so photos load)
7. **Save** (top right)

---

## Step 5 — Make an API token for the seed script

1. **Settings → API Tokens → Create new API Token**
2. Name: `seed`
3. Token duration: **Unlimited**
4. Token type: **Full access**
5. **Save**

Strapi shows the token **once**, in a green box at the top. Copy it now.

---

## Step 6 — Upload all 60 photos automatically

In your **second** terminal, from the project root:

```bash
cd cms/seed
cp .env.example .env
```

*(Windows PowerShell: `Copy-Item .env.example .env`)*

In the VS Code Explorer open `cms/seed/.env` and paste your token:

```
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=paste-the-long-token-here
IMAGE_DIR=../../images
```

Save the file (`Ctrl + S`), then run:

```bash
node upload.mjs
```

You should see:

```
Seeding 7 categories and 40 products into http://localhost:1337
+ category: Beds
+ category: Chairs & sofas
...
+ product: Box storage bed
+ product: Carved cot, king size
...
+ hero slideshow: 7 images

Done. 40 new products.
```

Go to the Strapi admin → **Content Manager → Product**. All 40 should be listed with photos.

---

## Step 7 — Start the website

Still in the second terminal:

```bash
cd ../../frontend
npm install
```

That takes a minute or two. Then:

**Mac / Linux:** `cp .env.local.example .env.local`
**Windows:** `Copy-Item .env.local.example .env.local`

The defaults are already correct for local work. Now:

```bash
npm run dev
```

Open **http://localhost:3000**.

You should see the home page: hero slideshow rotating through seven doors, the stats row, the seven category carousels, and the contact block. Click **Catalog** in the menu — 40 products with working filter chips. Click **తెలుగు** in the top bar — everything switches language.

---

## Your daily routine from now on

Two terminals, every time:

| Terminal | Command | Address |
|---|---|---|
| 1 | `cd strapi && npm run develop` | http://localhost:1337/admin |
| 2 | `cd frontend && npm run dev` | http://localhost:3000 |

Stop either with `Ctrl + C`.

Add a door in Strapi → wait up to 60 seconds → refresh the website → it's there. See **CMS-GUIDE.md**.

---

## When something goes wrong

**`npx: command not found`**
Node didn't install properly. Reinstall from nodejs.org, then fully quit and reopen VS Code.

**`Error: listen EADDRINUSE :::1337`**
Strapi is already running in another terminal. Either use that one, or press `Ctrl + C` in it first.

**Website loads but is empty — no products, no photos**
Step 4 wasn't completed. Go back and tick the Public role permissions, including **Upload**.

**Seed script: `401 Unauthorized`**
The token in `cms/seed/.env` is wrong. Make a fresh full-access token (Step 5) and paste it again. Make sure there are no quotes or spaces around it.

**Seed script: `fetch failed` or `ECONNREFUSED`**
Strapi isn't running. Start it in terminal 1 first.

**Photos show as broken squares**
`Upload → find` permission missing in Step 4. Also check `NEXT_PUBLIC_STRAPI_URL` in `frontend/.env.local` reads exactly `http://localhost:1337` with no trailing slash.

**I changed something in Strapi but the site looks the same**
The site caches for 60 seconds. Wait, then hard-refresh with `Ctrl + Shift + R`.

**`Module not found: Can't resolve '@/lib/strapi'`**
You ran `npm run dev` from the wrong folder. It must be run inside `frontend`.

---

## Resetting everything

To wipe the CMS and start clean: stop Strapi, delete `strapi/.tmp/data.db`, start Strapi, recreate your admin account, redo Steps 4–6. Your photos in `images/` are never touched.
