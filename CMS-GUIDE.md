# Using the CMS — a plain guide

Open **http://localhost:1337/admin** (or your live Strapi address) and log in.

---

## The three things in your CMS

| What | What it holds |
|---|---|
| **Product** | One door, bed, sofa, window. Name, description, photo, category. |
| **Category** | The seven groups: Beds, Chairs & sofas, Dining tables, Main doors, Pooja doors (CNC), Veneer doors, Windows. |
| **Site Settings** | The home page slideshow images and your contact details. |

---

## Add a new door (the most common job)

1. Left sidebar → **Content Manager** → **Product**
2. Top right → **Create new entry**
3. Fill in:
   - **name_en** — English name, e.g. `Carved teak main door with jali`
   - **slug** — click the *Regenerate* button next to it; it fills itself from the name
   - **name_te** — the Telugu name. Leave blank and the site shows English.
   - **description_en / description_te** — one or two plain sentences. Say what the wood is, what the finish is, what's included.
   - **image** — click **Click to add an asset** → **Add more assets** → drag your photo in
   - **category** — pick from the dropdown
   - **order** — a number. Lower numbers show first. Leave 0 if you don't care.
4. **Save**, then **Publish** if you see that button.

Reload the website after about a minute. The door appears in the catalog, in the right filter, and in that category's carousel on the home page.

### What makes a good photo

- Shoot the door straight on, whole thing in frame, in daylight
- No people, no bags, no tools on the floor
- Portrait orientation works best — the cards are tall
- Keep files under about 1 MB. If your phone photos are huge, run them through [squoosh.app](https://squoosh.app) first (resize longest side to 1200px)

---

## Change the home page slideshow

**Content Manager → Site Settings → heroImages**

Drag images in, drag to reorder, click the bin to remove. The slideshow moves every 5 seconds and follows the order you set here. Seven is a good number; more than ten makes the page heavy.

---

## Edit an existing door

**Content Manager → Product** → click its row → change what you need → **Save**.

To swap the photo: click the image, then **Replace media**.

---

## Delete something

Open the entry → **Delete this entry** at the bottom. It disappears from the website on the next reload. Deleting a Category does *not* delete its products; they just lose their group, so reassign them first.

---

## Add a whole new category

**Content Manager → Category → Create new entry.** Fill `name_en`, `name_te`, regenerate the slug, set `order`. It shows up on the home page as soon as it has at least one product.

---

## Telugu text

Every text field has an `_en` and a `_te` twin. The visitor's language toggle picks between them. If `_te` is empty, the English shows instead — nothing breaks, but the Telugu experience is better when they're filled.

The fixed labels (buttons, menus, headings like "Two trades, one team") are **not** in the CMS — they live in `frontend/src/lib/i18n.js`. Ask a developer to change those, or edit that one file.

---

## Common problems

**Photos don't show on the website.**
The API is probably still private. Strapi → **Settings → Users & Permissions → Roles → Public** → tick `find` and `findOne` for Product, Category and Site-setting → Save.

**A change doesn't appear.**
The site caches for 60 seconds. Wait a minute and hard-refresh (Ctrl+Shift+R). If it's live on Vercel, redeploy.

**The website shows nothing at all.**
Strapi isn't running, or `NEXT_PUBLIC_STRAPI_URL` in `frontend/.env.local` points at the wrong address. The site is built not to crash when Strapi is down — it renders empty instead.

**The seed script says "401 Unauthorized".**
The token in `cms/seed/.env` is wrong or expired. Make a new full-access token in Strapi and paste it again.

---

## A rule worth keeping

Only publish photos of **your own work**, or images you have the right to use. A few of the reference images in this bundle came from Pinterest — they're marked in the catalog as reference designs. Never publish an image carrying another business's watermark or phone number; customers notice, and it costs you the sale.
