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
  vm.runInNewContext(fs.readFileSync(dataFile, "utf8") + "\n;this.MENU = MENU;", context, { filename: "menu-data.js" });
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

var count = MENU.reduce(function (n, c) { return n + c.items.length; }, 0);
console.log("build-menu: wrote " + count + " items in " + MENU.length + " sections to menu.html");
