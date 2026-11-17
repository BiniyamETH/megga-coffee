# Megga Coffee website

A plain HTML/CSS/JavaScript site with no build step. It works on GitHub Pages or any static host.

```
index.html      Home: hero, menu cards, a taste of the menu, why Megga, our story, Habesha coffee, photo strip, reviews, quick answers
menu.html       Menu (built from menu-data.js)
about.html      Our Story + Ethiopian coffee roots
gallery.html    Photo gallery (tap a photo to view it full-size)
reviews.html    Google rating, review topics, "write a review"
contact.html    Contact: address, hours, map, getting here
404.html        "Page not found": shown for any address on the site that doesn't exist
styles.css      All styling (colours are at the top, under :root)
script.js       Shared logic (you should not need to edit this)
menu-data.js    <- EDIT THIS: business info, hours, photos and the menu
assets/         Photos, favicon, social-share image
robots.txt      Tells search engines where the sitemap is
print/          The menu QR code for printing (not published)
```

## The menu is the most important page

Customers scan a QR code in the café and land on the menu page (`menu.html`, at `https://meggacoffee.com/menu`) on their phone. Every change to the site should keep that page fast, easy to read and working.

- **QR code:** `print/menu-qr.png` (for most uses) and `print/menu-qr.svg` (for a print shop; stays sharp at any size). It opens `https://meggacoffee.com/menu`. Scan a printed copy with a phone before printing many. Print it at least 3 cm wide and keep the white border around it. The `print` folder is not part of the published site.
- **Food comes first:** on a phone, the first screen shows the section buttons and the first items with prices. Don't add banners, long text or pop-ups above the menu. The "About our menu" text for Google sits at the bottom of the page on purpose.
- **What customers can do:** tap a section name, or the grid button, to jump to it. Tap the search button to search ("benny", "latte") or to show only vegetarian, spicy or gluten-free items. Tap a dish photo to see it larger.
- **After every menu edit**, open the menu on your phone and check that:
  1. the page isn't blank (a blank page means a missing quote or comma in `menu-data.js`),
  2. new prices show correctly,
  3. a search such as "latte" finds items.
- **Keep photos small** (about 20 KB for item photos, under 300 KB for section banners) so the menu loads quickly on mobile data.
- **Google reads the menu too.** `script.js` turns `menu-data.js` into structured data that search engines read: every item, price and vegetarian or gluten-free tag. Editing a price or item in `menu-data.js` updates it automatically. To check it, paste the menu page link into [Google's Rich Results Test](https://search.google.com/test/rich-results).

## Editing info, hours and prices

Everything you'll normally change is in **`menu-data.js`**. Open it in any text editor, or edit it directly on GitHub (click the file, then the pencil icon).

| To change… | Edit this in `menu-data.js` |
|---|---|
| Phone number | `phone: ""` → `phone: "+1 416-555-0123"`. While it is empty, every phone link and "Call" button stays hidden. |
| Hours | `hours:` uses a 24-hour clock, e.g. `mon: ["08:00", "21:00"]`. To close on a day, write `sun: null,`. The "Open now / Closed" badge, the hours table and Google's data all update from this. |
| Instagram | `instagram: "https://www.instagram.com/yourname"`. Leave it `""` to hide it. |
| Price range (for Google) | `priceRange: "$$"`. Use `"$"` for under $10 a person or `"$$$"` for $20–30. |
| Google rating | `rating: { value: 5.0, count: 26 }` |
| Uber Eats link | `orderUrl:`. The link is also written in the HTML files (Visit band, footer, and under the menu), so replace it there too. |
| Google Maps listing link | `reviewsUrl:`. It is also written in the HTML files ("Write a review" links), so replace it there too. |

### Prices and menu items

Scroll down to `const MENU = [`. Each item looks like this:

```js
{ name: "Cafe Latte", price: 3.95 },
{ name: "Spicy Benny", price: 14.95, tags: ["s"] },
{ name: "Build Your Own Meat Lovers", price: 13.95, desc: "4 choices of diner cut" },
```

- **Change a price:** edit the number. Don't add a `$`; the site formats it as `$0.00`.
- **Add an item:** copy a line, paste it below, and edit it. Keep the comma at the end.
- **Remove an item:** delete its whole line.
- **Search words:** `keywords: "benny eggs benedict"` on an item or a whole category lets the menu search find it by words that aren't in its name. They never show on the menu.
- **Tags:** `"v"` = vegetarian, `"s"` = spicy, `"gf"` = gluten free. These drive the filter chips and icons.
- **Add a category:** copy a whole `{ id: ..., name: ..., items: [ ... ] },` block. The `id` must be lowercase-with-dashes. It is used in links like `menu.html#benedicts`.

If the menu page goes blank after an edit, you most likely broke a quote or comma. Press F12 and the Console tab will show the line number.

## Swapping photos

**Where each photo is used:** `hero.jpg` is the interior photo you supplied; it is the big homepage photo and is also used on the Our Story page and in the gallery. `home-interior.jpg` is the big photo on the Contact page. The four menu-card photos in `assets/cards/` are free Unsplash stock photos; change the card photos and titles in `highlights` in `menu-data.js`. The gallery photos in `assets/gallery/` are the café's own, from its Google Maps listing ("By owner"). The `-600` / `-800` / `-900` / `-1000` files are smaller copies that phones download instead; replace them too when you swap a photo (for gallery and card photos, the `small:` line in `menu-data.js` points to the 600px copy).

Photos live in `assets/`. To swap the main photo, replace `assets/hero.jpg` with your own file under the same name; no code changes are needed. Landscape works best, at least 1600px wide.

For the other photos, add the file to `assets/` and put its path in `menu-data.js`:

- Menu category photos: `image:` on each category in `MENU`, files in `assets/menu/` (960×320, a wide strip), plus a 96×96 square copy with the same name in `assets/menu/small/`
- Dish photos: `image:` on each item, 240×240 files in `assets/menu/items/` plus a bigger copy with the same name in `assets/menu/items/large/` (shown when someone taps the photo)
- Gallery: `images.gallery[].src`, with a short `alt` description for screen readers

You only need the `.jpg` files; the lighter `.webp` copies are made for you when the site is published (see "Speed").

**When you replace a photo, give the new file a new name** (e.g. `fata-2.jpg`) and update its `image:` line. Browsers keep photos for up to 10 minutes, so a new photo saved under the old name can take that long to appear; a new name shows straight away.

Any photo left as `""`, or whose file is missing, shows a warm brown placeholder instead. Keep photos under about 300 KB each (export as JPG at about 80% quality) so the site stays fast.

`assets/hero.jpg` (1536×1024) is also the preview image shown when someone shares the link.

## Text that is not in menu-data.js

The top menu bar, Visit band and footer are repeated in all six HTML files. If you rename a page or add one, update the `<nav>` in each file.

The colours are set once at the top of `styles.css` (`--page`, `--band`, `--caramel`, and so on). Change them there to adjust the whole site.

When the café's address, phone or hours change, update the plain HTML in the Visit bands and Contact page along with `menu-data.js`. Check the Contact metadata for address or hours references.

Each page has a title, meta description, canonical URL and Open Graph tags in its HTML head. If the public URL changes, update the canonical and Open Graph URLs, `sitemap.xml` and `robots.txt` together.

## Older phones and animation

The site is built to work on old and new phones alike. Keep these rules when changing it:

- **Animation stays light.** Everything that moves is at the bottom of `styles.css` under "Light motion", and only changes `opacity` and `transform`, which stay smooth on slow phones. Very old phones, and anyone with "reduce motion" switched on, get no animation at all. The menu list itself is not animated, so the QR-code page opens instantly.
- **Older phones get a simpler version, not a broken one.** `styles.css` has an "Older phones" section, and `script.js` has one too: spacing for phones that ignore `gap`, a photo viewer for iPhones that have no `<dialog>` (before iOS 15.4), and icons for iPhones before iOS 12.2.
- **When you use a newer CSS feature, write a plain value first**, e.g. `font-size: 1.8rem; font-size: clamp(1.8rem, 3.6vw, 2.4rem);`. Old phones use the first one and ignore the second.
- **Icons:** `assets/favicon.svg` is the browser-tab icon. `assets/icon-192.png`, `assets/icon-512.png` and `assets/apple-touch-icon.png` (180×180, the iPhone home-screen icon) are PNG copies of it for phones that can't show SVG icons. If the logo changes, replace all four.

## Speed

Tested with Google Lighthouse on a simulated slow phone (November 2026): menu page 92–99, home page 98–99 out of 100 (it varies from run to run). What keeps it fast:

- **Lighter photos (`.webp`).** Every `.jpg` in `assets/` has a `.webp` copy with the same name that is about 40% smaller. Newer phones download the `.webp`; older phones use the `.jpg`. **You only ever add or replace the `.jpg`.** The publish step makes the `.webp` copy for any new or replaced photo. (To make them on your computer instead: `python tools/make-webp.py`.) If a `.webp` is ever missing, the site loads the `.jpg`. The big tap-to-view dish photos in `assets/menu/items/large/` stay `.jpg`.
- **Photos load only when they are near the screen**, except the first one on each page.
- **Page changes start early.** In Chrome, Edge and Samsung Internet the menu page is fetched in the background from every other page, and any page starts loading the moment a finger goes down on its link (`setupSpeculation` in `script.js`).
- **Keep it fast:** keep photos small (see "Swapping photos"), don't add outside scripts, chat widgets, pop-ups or web fonts, and keep `menu.html` free of anything above the menu.
- **To test:** paste a page link into [PageSpeed Insights](https://pagespeed.web.dev/).

## Publishing on GitHub Pages

1. Create a repository and upload all the files, keeping the `assets` and `.github` folders.
2. Go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Push to `main`. About a minute later the site is live at `https://meggacoffee.com/`.

Every push runs `.github/workflows/pages.yml`. It writes a plain-text copy of the menu into `menu.html` from `menu-data.js` (`tools/build-menu.js`), then publishes the site. That copy shows right away on slow connections, on very old phones and with JavaScript off, and the full photo menu replaces it once the page's script runs. You only ever edit `menu-data.js`. Leave the `MENU:START` / `MENU:END` markers in `menu.html` alone. The same step writes the café's name, address, hours and phone into the top of every page for search engines (between the `SCHEMA:START` / `SCHEMA:END` markers), also from `menu-data.js`. It also adds each page's last-changed date to the published `sitemap.xml`, so Google rechecks the menu soon after a price edit. It also gives `menu-data.js`, `script.js` and `styles.css` a new address on each publish (for example `menu-data.js?v=0be6400a`), so browsers never pair a new page with an old saved copy of the menu. That happens only in the published copy, so keep the plain `src="menu-data.js"` in the HTML files.

**If an update doesn't appear:** open the repo's **Actions** tab and read the failed step. For menu data errors such as missing photo files or prices written as strings, the build log names the item or line. To check the menu before pushing, run `node tools/build-menu.js`. It updates the generated menu and photo-credit blocks in `menu.html` while preserving the surrounding page.

To preview on your computer, open `index.html` in a browser. For the map and everything else to behave exactly as it will online, run `python -m http.server` in this folder and visit http://localhost:8000.

## Getting found on Google

The site lives at **`https://meggacoffee.com/`** (bought November 2026). The old `https://biniyameth.github.io/megga-coffee/` address redirects to it, so old links keep working.

1. **Google Search Console:** add `meggacoffee.com` as a property and submit `https://meggacoffee.com/sitemap.xml`.
2. **Google Business Profile:** set the website field to `https://meggacoffee.com/` and the menu link to `https://meggacoffee.com/menu`.
3. **Instagram / Uber Eats:** put `https://meggacoffee.com/` in the bio or store page.

### Danforth East update

| Area | Changes |
| --- | --- |
| Menu photos | If a thumbnail WebP fails, the original JPG gets a chance to load. If both fail, the thumbnail disappears and the dish name and price stay visible. Dish photos also have descriptive alt text. |
| Page and gallery photos | Responsive photos retry their JPG sources. The gallery viewer uses the optimized photo when available and keeps the thumbnail visible until the larger photo loads. |
| Menu links | Malformed URL fragments such as `#%zz` no longer interrupt section highlighting. |
| Opening hours | One timer refreshes the badge and Contact FAQ using Toronto time. They also refresh when returning to the page. The Contact page has plain HTML hours for visitors with JavaScript disabled. |
| Homepage and menu | Page titles describe the café and its Danforth breakfast and brunch menu. The page copy names Danforth East and the address, links to hours and directions, and describes the Habesha dishes in the context of Ethiopian and Eritrean food traditions. |
| Contact and Our Story | The Contact page explains how to walk from the Strathmore Boulevard entrance at Coxwell Station and answers neighbourhood, takeout and delivery questions. Our Story names the Habesha coffee ceremony directly. |
| Structured data | The business description and `CafeOrCoffeeShop` and `Restaurant` types identify the café. The business record links to the menu with item names, prices and CAD currency. |

The business address and ordering options are listed on [Uber Eats](https://www.ubereats.com/ca/store/megga-morning-grace-coffee/lcxvV_vkUyulXjWnfndXcA). The walking directions use the [TTC's Coxwell Station entrance information](https://www.ttc.ca/subway-stations/coxwell-station).

Google's local results depend on relevance, distance and prominence. Keep the Business Profile address, hours, photos and menu link current. [Google Business Profile local ranking guidance](https://support.google.com/business/answer/7091)

**Homepage (November 2026):** the dishes under "A Taste of the Menu" are chosen in `featured` in `menu-data.js`. `tools/build-menu.js` writes their names and prices into `index.html` (between the `FEATURED` markers) and adds the site-name details for Google to the homepage `<head>`, so search engines read both without running scripts.

### Verification for this update

- `node --check script.js`, `node --check menu-data.js` and `node tools/build-menu.js` passed. The generated HTML has 126 menu items with prices across 14 sections.
- Checked all seven HTML pages for local link and image targets, fragment links and duplicate IDs. The six indexable pages have canonical URLs matching the sitemap. The 404 page has `noindex`.
- Targeted JavaScript checks passed for WebP-to-JPG recovery, missing thumbnails, gallery photo switching, Toronto closing time, badge and FAQ refresh, and the generated business and menu structured data.
- Browser access to the local preview was blocked. Mobile layout, search and touch interactions still need a browser pass for this update. To verify on a phone, open the menu from the QR code, jump to a section, search for “benny” and tap a dish photo.

### How the domain is set up

- The domain's DNS (at the domain seller) points to GitHub Pages: four `A` records for `meggacoffee.com` and a `CNAME` for `www`. `www.meggacoffee.com` redirects to `meggacoffee.com`.
- The domain is set in the repo under **Settings → Pages → Custom domain**, with **Enforce HTTPS** ticked. No `CNAME` file is needed, because the site is published by GitHub Actions.
- **Short links:** pages are at `meggacoffee.com/menu`, `/about`, `/gallery`, `/reviews` and `/contact`, without `.html`. The files keep their `.html` names and the links inside them keep `.html`, so the site still opens from the folder on a computer; the publish step takes `.html` off the links, and old `.html` links still open. Use the short form in anything you print or post.
- **Renew the domain every year.** If it lapses, the site and every printed QR code stop working.
- The full address is written in each page's canonical, `og:url` and `og:image` tags, and in `sitemap.xml` and `robots.txt`. `404.html` writes its links starting with `/`.

### Optional: remove the 10-minute delay after updates

GitHub tells browsers to keep each page for 10 minutes, so someone who opened the menu just before an update can see the old menu for up to 10 minutes. GitHub doesn't let you change that. With the domain you can:

- Add the domain to [Cloudflare](https://www.cloudflare.com/) (free plan) and use Cloudflare's nameservers at the domain seller.
- In Cloudflare, set **SSL/TLS** to **Full**.
- Add a **Rules → Transform Rules → Modify Response Header** rule: when the URL path has no dot in it (`/`, `/menu`) or ends in `.html`, **set** `Cache-Control` to `no-cache`. Pages are then checked for updates on every visit. Photos and scripts are still cached, so the site stays fast.
- Test: change a price, push, wait for the Actions run to finish, then reopen the menu on your phone. The new price should show right away.

## To-do list (not done yet)

Things decided or suggested but not finished. Tick them off here as you go.

**Ask the owner** (then fix the descriptions in `menu-data.js`, Habesha Dishes section):
- [ ] What is on **Ful Special** and **Fata Special**? (They say "extra toppings" for now.)
- [ ] What does **"(with 2)"** mean on Fata?
- [ ] Which meat is in **Dulot Tbsi** and **Keyih Tbsi**? (They say "meat" for now.)
- [ ] Is **ga'at** served with yogurt? (The menu says it is.)
- [ ] Which dishes are **spicy** (`tags: ["s"]`) or **vegetarian** (`tags: ["v"]`)?

**Google and other listings** (no code, but the biggest help for being found):
- [ ] Google Business Profile: use the same name as the website, "Megga Coffee".
- [ ] Google Business Profile categories: **Coffee shop** (main), plus **Ethiopian restaurant**, **Eritrean restaurant**, **Breakfast restaurant**.
- [ ] Google Business Profile: **Menu link** = `https://meggacoffee.com/menu`, **Order link** = Uber Eats, and add real photos of the Habesha dishes.
- [ ] Ask happy customers for Google reviews. Then update `rating:` in `menu-data.js`.
- [ ] Same name, address and phone on Yelp, TripAdvisor, Apple Maps ([Apple Business Connect](https://businessconnect.apple.com/)) and [Bing Places](https://www.bingplaces.com/) (it can import from Google).
- [ ] Search Console: submit the sitemap, and use **URL Inspection → Request indexing** on `https://meggacoffee.com/menu` after big menu changes.

**Website ideas, not built yet:**
- [ ] Replace stock and illustrated dish photos with photos of Megga's own plates, starting with the Habesha dishes (new file names, see "Swapping photos").
- [ ] Old pages refresh themselves: the publish step writes a small `version.txt`, and a page that is older than it reloads once. This fixes the 10-minute delay without Cloudflare.
- [ ] Use a Habesha dish photo as the menu page's share picture (`og:image` in `menu.html`), for links shared on WhatsApp and Facebook.
- [x] Buy the domain and switch the site to it, with the QR code (done November 2026: `meggacoffee.com`).
- [ ] Update the website link on Google Business Profile, Search Console, Instagram and Uber Eats to `https://meggacoffee.com/`.

## Photo credits

**Every menu item has its own photo** in `assets/menu/items/` (200×200 squares). Each item's `image:` line in `menu-data.js` points to its photo. To change one, save a square photo over the same file name. To remove one, delete that item's `image: "..."` part and the row shows text only. `assets/menu/items/CREDITS.txt` lists the source for each photo (Unsplash, or Wikimedia Commons for the Habesha dishes). **Every menu item must have a photo**: publishing stops with a message if an item has no `image:` or its file is missing. A photo whose licence asks for credit (Wikimedia Commons CC BY-SA) also needs `credit:` and `creditUrl:` on the item; the site then shows the credit under the photo and at the bottom of the menu page.

The category photos in `assets/menu/` are free stock photos from [Unsplash](https://unsplash.com/license). They are free for commercial use and no credit is required. They show typical versions of each dish, not Megga's own plates, which is why the menu footer says "Food photos are for illustration only." Replace them with photos of your own food when you can, keeping the same file names. To remove a category photo, set its `image: ""` in `menu-data.js`.

| File | Unsplash photo ID |
|---|---|
| specialty-coffees.jpg | photo-1760163178873-7644a924519e |
| drinks.jpg | photo-1600271886742-f049cd451bba |
| iced-coffee.jpg | Not Unsplash: made from the iced latte, iced coffee and iced americano dish photos |
| tea-and-hot-drinks.jpg | Not Unsplash: made from the chai tea, hot chocolate and green tea dish photos |
| habesha-dishes.jpg | Not Unsplash: made from the fata, kicha fitfit and keyih tbsi dish photos |
| breakfast-sandwiches.jpg | photo-1786490034626-1b8482bdf211 |
| breakfast-dishes.jpg | photo-1768634003098-9d5848d3b93f |
| benedicts.jpg | photo-1785697249208-749c906b69b0 |
| omelettes.jpg | photo-1766146431872-a4472ccd3889 |
| pancakes.jpg | photo-1757635964104-67218db55bca |
| burgers.jpg | photo-1572802419224-296b0aeee0d9 |
| lunch-dishes.jpg | photo-1769481614068-47cfb4d1f125 |
| vegetarian.jpg | photo-1788795567489-22430aa94402 |
| home-fries-and-sides.jpg | photo-1633959639799-6d3f66e05710 |

### Ethiopian roots section

The "Coffee, the Habesha Way" section on the Our Story page uses three free Unsplash photos in `assets/ethiopia/`: `jebena-pour.jpg` (photo-1774529233247-d3f34ed11994), `coffee-ceremony.jpg` (photo-1630861413071-a424a4d6d155) and `coffee-cherries.jpg` (photo-1515694590185-73647ba02c10). Its text is in `about.html`, under the comment `<!-- HABESHA ROOTS -->`. If the café holds coffee ceremonies or serves Ethiopian beans, add that there.
