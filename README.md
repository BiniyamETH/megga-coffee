# Megga Coffee website

A plain HTML/CSS/JavaScript site with no build step. It works on GitHub Pages or any static host.

```
index.html      Home: hero, menu cards, our story, photo strip, reviews
menu.html       Menu (built from menu-data.js)
about.html      Our Story + Ethiopian coffee roots
gallery.html    Photo gallery (tap a photo to view it full-size)
reviews.html    Google rating, review topics, "write a review"
contact.html    Contact: address, hours, map, getting here
styles.css      All styling (colours are at the top, under :root)
script.js       Shared logic (you should not need to edit this)
menu-data.js    <- EDIT THIS: business info, hours, photos and the menu
assets/         Photos, favicon, social-share image
```

## Editing info, hours and prices

Everything you'll normally change is in **`menu-data.js`**. Open it in any text editor, or edit it directly on GitHub (click the file, then the pencil icon).

| To change… | Edit this in `menu-data.js` |
|---|---|
| Phone number | `phone: ""` → `phone: "+1 416-555-0123"`. While it is empty, every phone link and "Call" button stays hidden. |
| Hours | `hours:` uses a 24-hour clock, e.g. `mon: ["08:00", "21:00"]`. To close on a day, write `sun: null,`. The "Open now / Closed" badge, the hours table and Google's data all update from this. |
| Instagram | `instagram: "https://www.instagram.com/yourname"`. Leave it `""` to hide it. |
| "Coffee Roastery" line | `tagline:`. Set it to `""` to hide it. Set `roastsInHouse: false` to hide the "Freshly Roasted" badge. |
| Google rating | `rating: { value: 5.0, count: 25 }` |
| Uber Eats link | `orderUrl:` |

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
- **Tags:** `"v"` = vegetarian, `"s"` = spicy, `"gf"` = gluten free. These drive the filter chips and icons.
- **Add a category:** copy a whole `{ id: ..., name: ..., items: [ ... ] },` block. The `id` must be lowercase-with-dashes. It is used in links like `menu.html#benedicts`.

If the menu page goes blank after an edit, you most likely broke a quote or comma. Press F12 and the Console tab will show the line number.

## Swapping photos

**Homepage photos:** `home-hero.jpg` (latte on a window sill) and the four menu-card photos in `assets/cards/` are free Unsplash stock photos. Change the card photos and titles in `highlights` in `menu-data.js`. `hero.jpg` is the interior photo you supplied and is used on the Contact and Our Story pages and in the gallery. The gallery photos in `assets/gallery/` are the café's own, from its Google Maps listing ("By owner").

Photos live in `assets/`. To swap the main photo, replace `assets/hero.jpg` with your own file under the same name; no code changes are needed. Landscape works best, at least 1600px wide.

For the other photos, add the file to `assets/` and put its path in `menu-data.js`:

- About photo: `images.about.src: "assets/latte.jpg"`
- Menu category photos (also used on the homepage cards): `image:` on each category in `MENU`, files in `assets/menu/`
- Gallery: `images.gallery[].src`, with a short `alt` description for screen readers

Any photo left as `""`, or whose file is missing, shows a warm brown placeholder instead. Keep photos under about 300 KB each (export as JPG at about 80% quality) so the site stays fast.

`assets/og-image.jpg` (1200×630) is the preview image shown when someone shares the link.

## Text that is not in menu-data.js

The top menu bar, the "Visit Megga Coffee" band and the footer are repeated in all six HTML files. If you rename a page or add one, update the `<nav>` in each file.

The colours are set once at the top of `styles.css` (`--page`, `--band`, `--caramel`, and so on). Change them there to adjust the whole site.

The meta description on `reviews.html` mentions "25 Google reviews". Update it when the count changes. (The number shown on the page comes from `rating` in `menu-data.js`.)

The page `<title>`, the meta description and the Open Graph tags sit at the top of `index.html` and `menu.html`. Link-preview bots don't run JavaScript, so these have to be written directly in the HTML. If the business name changes, update them there too.

After the site is live, change `og:image` in both files to the full URL, e.g. `https://yourname.github.io/megga-coffee/assets/og-image.jpg`. Facebook and WhatsApp need an absolute URL.

## Publishing on GitHub Pages

1. Create a repository and upload all the files, keeping the `assets` folder.
2. Go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click Save.
3. After a minute the site is live at `https://<username>.github.io/<repo>/`.

To preview on your computer, open `index.html` in a browser. For the map and everything else to behave exactly as it will online, run `python -m http.server` in this folder and visit http://localhost:8000.

## Photo credits

**Every menu item has its own photo** in `assets/menu/items/` (240×240 squares, about 16 KB each). Each item's `image:` line in `menu-data.js` points to its photo. To change one, save a square photo over the same file name. To remove one, delete that item's `image: "..."` part and the row shows text only. `assets/menu/items/CREDITS.txt` lists the Unsplash source for each photo.

The category photos in `assets/menu/` are free stock photos from [Unsplash](https://unsplash.com/license). They are free for commercial use and no credit is required. They show typical versions of each dish, not Megga's own plates, which is why the menu footer says "Food photos are for illustration only." Replace them with photos of your own food when you can, keeping the same file names. To remove a category photo, set its `image: ""` in `menu-data.js`.

| File | Unsplash photo ID |
|---|---|
| specialty-coffees.jpg | photo-1760163178873-7644a924519e |
| drinks.jpg | photo-1600271886742-f049cd451bba |
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

The "Coffee, the Ethiopian Way" section on the homepage uses three free Unsplash photos in `assets/ethiopia/`: `jebena-pour.jpg` (photo-1774529233247-d3f34ed11994), `coffee-ceremony.jpg` (photo-1630861413071-a424a4d6d155) and `coffee-cherries.jpg` (photo-1515694590185-73647ba02c10). Its text is in `index.html`, under the comment `<!-- ETHIOPIAN ROOTS -->`. If the café holds coffee ceremonies or serves Ethiopian beans, add that there.
