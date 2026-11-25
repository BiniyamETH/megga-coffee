/* Writes a plain-HTML copy of the menu (names, prices, descriptions) into menu.html,
   between the MENU:START and MENU:END markers, from MENU in menu-data.js.

   Why: the menu shows instantly on slow connections and works on very old phones and with
   JavaScript off. When script.js runs, it replaces this copy with the full menu (photos, tabs, search).

   GitHub runs this automatically on every push (.github/workflows/pages.yml), so you only ever
   edit menu-data.js. To try it on your computer:  node tools/build-menu.js
   It also stops with an error if menu-data.js is broken, so a typo never reaches the live site. */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.join(__dirname, "..");
var dataFile = path.join(root, "menu-data.js");
var pageFile = path.join(root, "menu.html");
var START = "<!-- MENU:START (built by tools/build-menu.js from menu-data.js; do not edit by hand) -->";
var END = "<!-- MENU:END -->";
var CREDITS_START = "<!-- CREDITS:START (built by tools/build-menu.js from menu-data.js; do not edit by hand) -->";
var CREDITS_END = "<!-- CREDITS:END -->";

var TAGS = {
  v: { label: "Vegetarian", icon: "i-leaf" },
  s: { label: "Spicy", icon: "i-chili" },
  gf: { label: "Gluten Free", icon: "i-gf" }
};

function fail(msg) {
  console.error("build-menu: " + msg);
  process.exit(1);
}

function esc(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Load menu-data.js the way a browser would and read MENU from it.
var context = {};
try {
  vm.runInNewContext(fs.readFileSync(dataFile, "utf8") + "\n;this.MENU = MENU; this.SITE = SITE;", context, { filename: "menu-data.js" });
} catch (err) {
  fail("menu-data.js has an error, so the site was not updated.\n" + (err.stack || err));
}
var MENU = context.MENU;
if (!Array.isArray(MENU) || !MENU.length) fail("MENU in menu-data.js is empty or missing.");

var ids = {};
MENU.forEach(function (cat, ci) {
  if (!cat.id || !cat.name || !Array.isArray(cat.items)) fail("category " + (ci + 1) + " needs id, name and items.");
  if (ids[cat.id]) fail('two categories share the id "' + cat.id + '".');
  ids[cat.id] = true;
  cat.items.forEach(function (item, ii) {
    var where = cat.name + " item " + (ii + 1);
    if (!item.name) fail(where + " has no name.");
    if (typeof item.price !== "number" || !isFinite(item.price)) fail(where + ' ("' + item.name + '") needs a plain number price, like 3.95.');
    (item.tags || []).forEach(function (t) { if (!TAGS[t]) fail(where + ' ("' + item.name + '") has an unknown tag "' + t + '".'); });
    // Every dish needs a photo: a 200x200 thumbnail and a 600x600 copy in items/large/.
    if (!item.image) fail(where + ' ("' + item.name + '") has no image. Every menu item needs a photo.');
    [item.image, item.image.replace("/items/", "/items/large/")].forEach(function (p) {
      if (!fs.existsSync(path.join(root, p))) fail(where + ' ("' + item.name + '"): photo file ' + p + " is missing.");
    });
  });
});

var html = MENU.map(function (cat) {
  var items = cat.items.map(function (item) {
    var tags = (item.tags || []).map(function (t) {
      return '<li class="tag-pill tag-pill-' + t + '"><svg class="tag-icon" aria-hidden="true"><use href="#' + TAGS[t].icon + '"/></svg>' +
        TAGS[t].label + "</li>";
    }).join("");
    return '        <li class="menu-item"><div class="item-body"><div class="item-top">' +
      '<h3 class="item-name">' + esc(item.name) + '</h3><span class="item-price">$' + item.price.toFixed(2) + "</span></div>" +
      (item.desc ? '<p class="item-desc">' + esc(item.desc) + "</p>" : "") +
      (tags ? '<ul class="item-tags" role="list">' + tags + "</ul>" : "") +
      "</div></li>";
  }).join("\n");
  return '      <section class="menu-cat" id="' + esc(cat.id) + '" aria-labelledby="h-' + esc(cat.id) + '">\n' +
    '        <div class="cat-heading"><h2 class="menu-cat-title" id="h-' + esc(cat.id) + '">' + esc(cat.name) + "</h2></div>\n" +
    '        <ul class="menu-list" role="list">\n' + items + "\n        </ul>\n      </section>";
}).join("\n");

// Photo credits for pictures whose licence asks for them (one line per photo).
var seenCredit = {};
var credits = [];
MENU.forEach(function (cat) {
  cat.items.forEach(function (item) {
    if (!item.credit || seenCredit[item.image]) return;
    seenCredit[item.image] = true;
    credits.push(esc(item.name) + ": " + (item.creditUrl
      ? '<a href="' + esc(item.creditUrl) + '" target="_blank" rel="noopener">' + esc(item.credit) + "</a>"
      : esc(item.credit)));
  });
});
var creditsHTML = credits.length
  ? '      <p class="photo-credits">Photo credits (Wikimedia Commons, cropped and resized): ' + credits.join("; ") + ".</p>"
  : "";

// Replace whatever is between a pair of markers.
function between(text, start, end, inner, what) {
  var a = text.indexOf(start), b = text.indexOf(end);
  if (a === -1 || b === -1 || b < a) fail("menu.html is missing the " + what + " markers.");
  return text.slice(0, a + start.length) + "\n" + (inner ? inner + "\n" : "") + "      " + text.slice(b);
}
var page = fs.readFileSync(pageFile, "utf8");
page = between(page, START, END, html, "MENU:START / MENU:END");
page = between(page, CREDITS_START, CREDITS_END, creditsHTML, "CREDITS:START / CREDITS:END");
fs.writeFileSync(pageFile, page);

/* The café's details for search engines (name, address, hours, phone), written into the <head>
   of every page from SITE in menu-data.js. script.js builds the same block in the browser; having
   it in the HTML means search engines that don't run scripts read it too. */
var SITE = context.SITE;
var DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
var DAY_LONG = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
var SCHEMA_START = "<!-- SCHEMA:START (built by tools/build-menu.js from menu-data.js; do not edit by hand) -->";
var SCHEMA_END = "<!-- SCHEMA:END -->";

function cafeSchema(base) {
  var groups = [];
  DAY_KEYS.forEach(function (k) {
    var r = SITE.hours[k], last = groups[groups.length - 1];
    if (last && String(last.range) === String(r)) last.days.push(DAY_LONG[k]);
    else groups.push({ days: [DAY_LONG[k]], range: r });
  });
  var digits = String(SITE.phone || "").replace(/[^0-9]/g, "");
  if (digits.length === 10) digits = "1" + digits;
  var payments = (SITE.payments || []).filter(Boolean);
  var photos = ((SITE.images && SITE.images.gallery) || []).filter(function (g) { return g.src && g.src !== "assets/hero.jpg"; });
  var sameAs = [SITE.reviewsUrl, SITE.orderUrl, SITE.instagram].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["CafeOrCoffeeShop", "Restaurant"],
    "@id": base + "#cafe",
    name: SITE.name,
    description: SITE.description || undefined,
    url: base,
    image: [base + "assets/hero.jpg"].concat(photos.slice(0, 4).map(function (g) { return base + g.src; })),
    logo: base + "assets/icon-512.png",
    menu: base + "menu",
    currenciesAccepted: "CAD",
    servesCuisine: ["Coffee", "Breakfast", "Brunch", "Sandwiches", "Burgers", "Vegetarian", "Greek", "Habesha", "Ethiopian", "Eritrean"],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.reviewsUrl,
    openingHoursSpecification: groups.filter(function (g) { return g.range; }).map(function (g) {
      return { "@type": "OpeningHoursSpecification", dayOfWeek: g.days, opens: g.range[0], closes: g.range[1] };
    }),
    potentialAction: { "@type": "OrderAction", target: SITE.orderUrl },
    telephone: digits ? "+" + digits : undefined,
    paymentAccepted: payments.length ? payments.join(", ") : undefined,
    priceRange: SITE.priceRange || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    hasMenu: { "@id": base + "menu#menu" }
  };
}

if (!SITE || !SITE.address || !SITE.hours) fail("SITE in menu-data.js is missing its address or hours.");
["index", "about", "menu", "gallery", "reviews", "contact"].forEach(function (name) {
  var file = path.join(root, name + ".html");
  var text = fs.readFileSync(file, "utf8");
  var canonical = /<link rel="canonical" href="([^"]+)"/.exec(text);
  if (!canonical) fail(name + ".html has no canonical link.");
  var base = new URL("./", canonical[1]).href;
  // Written with "<" escaped so nothing in the data can close the script tag early.
  var json = JSON.stringify(cafeSchema(base)).split("<").join("\\u003c");
  var a = text.indexOf(SCHEMA_START), b = text.indexOf(SCHEMA_END);
  if (a === -1 || b === -1 || b < a) fail(name + ".html is missing the SCHEMA:START / SCHEMA:END markers.");
  // Homepage only: the site's name for search results (shown above the link).
  var site = name !== "index" ? "" : '  <script type="application/ld+json" data-schema="website">' + JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": base + "#website",
    name: SITE.name,
    url: base,
    inLanguage: "en-CA",
    publisher: { "@id": base + "#cafe" }
  }).split("<").join("\\u003c") + "</script>\n";
  fs.writeFileSync(file, text.slice(0, a + SCHEMA_START.length) + "\n" +
    '  <script type="application/ld+json" data-schema="cafe">' + json + "</script>\n" + site + "  " + text.slice(b));
});

/* Homepage "A Taste of the Menu": a plain-HTML copy of the dishes in SITE.featured (name and
   section, no prices), so search engines and phones without JavaScript read them too. script.js swaps in the
   version with photos. */
var FEAT_START = "<!-- FEATURED:START (built by tools/build-menu.js from menu-data.js; do not edit by hand) -->";
var FEAT_END = "<!-- FEATURED:END -->";
var featured = (SITE.featured || []).map(function (f) {
  var cat = MENU.filter(function (c) { return c.id === f.category; })[0];
  var item = cat && cat.items.filter(function (i) { return i.name === f.name; })[0];
  if (!item) { console.warn('build-menu: featured dish "' + f.name + '" (' + f.category + ") is not on the menu, so the homepage leaves it out."); return ""; }
  return '          <li><a class="feat-card" href="menu.html#' + esc(cat.id) + '"><span class="feat-text"><span class="feat-name">' +
    esc(f.label || item.name) + '</span><span class="feat-cat">' + esc(cat.name) + "</span></span></a></li>";
}).filter(Boolean).join("\n");
var homeFile = path.join(root, "index.html");
var home = fs.readFileSync(homeFile, "utf8");
var fa = home.indexOf(FEAT_START), fb = home.indexOf(FEAT_END);
if (fa === -1 || fb === -1 || fb < fa) fail("index.html is missing the FEATURED:START / FEATURED:END markers.");
fs.writeFileSync(homeFile, home.slice(0, fa + FEAT_START.length) + "\n" + (featured ? featured + "\n" : "") + "          " + home.slice(fb));

/* llms.txt: a plain-text summary of the café (details, hours and the full menu with prices) for
   AI assistants and AI search (ChatGPT, Gemini, Perplexity, Copilot). They can read it in one go
   instead of piecing the facts together from the pages. Built from menu-data.js, so it never goes stale. */
function to12h(t) {
  var p = t.split(":"), h = +p[0], m = p[1];
  return (h % 12 || 12) + (m === "00" ? "" : ":" + m) + (h < 12 ? " a.m." : " p.m.");
}
var DAY_SHORT = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
var hourGroups = [];
DAY_KEYS.forEach(function (k) {
  var r = SITE.hours[k], last = hourGroups[hourGroups.length - 1];
  if (last && String(last.range) === String(r)) last.days.push(k);
  else hourGroups.push({ days: [k], range: r });
});
var hoursLines = hourGroups.map(function (g) {
  var days = g.days.length === 7 ? "Every day"
    : g.days.length === 1 ? DAY_SHORT[g.days[0]]
    : DAY_SHORT[g.days[0]] + " to " + DAY_SHORT[g.days[g.days.length - 1]];
  return "- " + days + ": " + (g.range ? to12h(g.range[0]) + " to " + to12h(g.range[1]) : "Closed");
});
var homeUrl = /<link rel="canonical" href="([^"]+)"/.exec(fs.readFileSync(homeFile, "utf8"))[1];
var a = SITE.address;
var llms = [
  "# " + SITE.name,
  "",
  "> " + SITE.description,
  "",
  "## Visit",
  "",
  "- Address: " + a.street + ", " + a.city + ", " + a.region + " " + a.postalCode + ", Canada",
  "- Neighbourhood: Danforth East, Toronto, a short walk from Coxwell subway station (Line 2)",
  SITE.phone ? "- Phone: " + SITE.phone : "",
  (SITE.payments || []).length ? "- Payment: " + SITE.payments.join(", ") : "",
  SITE.rating ? "- Google rating: " + SITE.rating.value.toFixed(1) + " stars from " + SITE.rating.count + " reviews" : "",
  "- Order delivery or pickup: " + SITE.orderUrl,
  "- Directions: " + SITE.directionsUrl,
  "",
  "## Hours (Toronto time)",
  "",
  hoursLines.join("\n"),
  "",
  "## Pages",
  "",
  "- [Menu](" + homeUrl + "menu): full menu with prices and photos",
  "- [About](" + homeUrl + "about): the café's story and its Habesha (Ethiopian and Eritrean) roots",
  "- [Contact](" + homeUrl + "contact): hours, map and directions",
  "- [Reviews](" + homeUrl + "reviews): what guests say on Google",
  "- [Gallery](" + homeUrl + "gallery): photos of the café",
  "",
  "## Menu (prices in Canadian dollars)"
].filter(function (line, i, all) { return line !== "" || all[i - 1] !== ""; }).join("\n") + "\n" +
  MENU.map(function (cat) {
    return "\n### " + cat.name + "\n\n" + cat.items.map(function (item) {
      var tags = (item.tags || []).map(function (t) { return TAGS[t].label.toLowerCase(); });
      return "- " + item.name + ": $" + item.price.toFixed(2) +
        (item.desc ? ". " + item.desc.replace(/^[^\x00-ɏ]+ · /, "") : "") +
        (tags.length ? " (" + tags.join(", ") + ")" : "");
    }).join("\n") + "\n";
  }).join("");
fs.writeFileSync(path.join(root, "llms.txt"), llms);

var count = MENU.reduce(function (n, c) { return n + c.items.length; }, 0);
console.log("build-menu: wrote " + count + " items in " + MENU.length + " sections to menu.html");
