/* Megga Coffee — shared site script.
   Reads SITE and MENU from menu-data.js. You should not need to edit this file. */
(function () {
  "use strict";

  if (typeof SITE === "undefined") return;

  var DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  var DAY_SHORT = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
  var DAY_LONG = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
  var TAGS = {
    v: { label: "Vegetarian", icon: "i-leaf" },
    s: { label: "Spicy", icon: "i-chili" },
    gf: { label: "Gluten Free", icon: "i-gf" }
  };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  /* ---------- helpers ---------- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1] || "0", 10);
  }

  // "21:00" -> "9:00 p.m." (or "9 p.m." when short)
  function formatTime(hhmm, short) {
    var mins = toMinutes(hhmm) % 1440;
    var h = Math.floor(mins / 60), m = mins % 60;
    var suffix = h < 12 ? "a.m." : "p.m.";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    if (short && m === 0) return h12 + " " + suffix;
    return h12 + ":" + (m < 10 ? "0" : "") + m + " " + suffix;
  }

  function formatRange(range) {
    return formatTime(range[0]) + " – " + formatTime(range[1]);
  }

  function formatPrice(n) {
    return "$" + Number(n).toFixed(2);
  }

  function sameHours(a, b) {
    if (!a || !b) return a === b;
    return a[0] === b[0] && a[1] === b[1];
  }

  /* ---------- hours & open status (Toronto time) ---------- */

  function torontoNow() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: SITE.timezone || "America/Toronto",
      weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    var out = {};
    parts.forEach(function (p) { out[p.type] = p.value; });
    var key = out.weekday.slice(0, 3).toLowerCase();
    return { dayIndex: DAY_KEYS.indexOf(key), minutes: (parseInt(out.hour, 10) % 24) * 60 + parseInt(out.minute, 10) };
  }

  // Returns [open, close] in minutes; close may exceed 1440 for past-midnight hours.
  function dayWindow(key) {
    var r = SITE.hours[key];
    if (!r) return null;
    var o = toMinutes(r[0]), c = toMinutes(r[1]);
    if (c <= o) c += 1440;
    return [o, c];
  }

  function openStatus() {
    var now = torontoNow();
    if (now.dayIndex < 0) return null;
    var todayKey = DAY_KEYS[now.dayIndex];
    var yesterdayKey = DAY_KEYS[(now.dayIndex + 6) % 7];
    var today = dayWindow(todayKey);
    var yesterday = dayWindow(yesterdayKey);

    if (yesterday && yesterday[1] > 1440 && now.minutes < yesterday[1] - 1440) {
      return { open: true, text: "Closes " + formatTime(SITE.hours[yesterdayKey][1], true) };
    }
    if (today && now.minutes >= today[0] && now.minutes < today[1]) {
      return { open: true, text: "Closes " + formatTime(SITE.hours[todayKey][1], true) };
    }
    if (today && now.minutes < today[0]) {
      return { open: false, text: "Opens " + formatTime(SITE.hours[todayKey][0], true) };
    }
    for (var i = 1; i <= 7; i++) {
      var k = DAY_KEYS[(now.dayIndex + i) % 7];
      if (SITE.hours[k]) {
        var when = i === 1 ? "tomorrow" : DAY_SHORT[k];
        return { open: false, text: "Opens " + when + " " + formatTime(SITE.hours[k][0], true) };
      }
    }
    return { open: false, text: "" };
  }

  function renderOpenStatus() {
    var st = openStatus();
    $$("[data-open-status]").forEach(function (el) {
      if (!st) { el.hidden = true; return; }
      el.classList.toggle("is-open", st.open);
      el.classList.toggle("is-closed", !st.open);
      el.innerHTML = '<span class="status-dot" aria-hidden="true"></span>' +
        (st.open ? "Open now" : "Closed") +
        (st.text ? '<span class="status-detail"> · ' + esc(st.text) + "</span>" : "");
    });
  }

  // Groups consecutive days with identical hours: "Mon–Fri 8:00 a.m. – 9:00 p.m. · Sat closed"
  function hoursGroups() {
    var groups = [];
    DAY_KEYS.forEach(function (k) {
      var last = groups[groups.length - 1];
      if (last && sameHours(last.range, SITE.hours[k])) last.end = k;
      else groups.push({ start: k, end: k, range: SITE.hours[k] });
    });
    return groups;
  }

  function hoursSummary() {
    var groups = hoursGroups();
    if (groups.length === 1 && groups[0].range) return "Open daily · " + formatRange(groups[0].range);
    return groups.map(function (g) {
      var days = g.start === g.end ? DAY_SHORT[g.start] : DAY_SHORT[g.start] + "–" + DAY_SHORT[g.end];
      return days + " " + (g.range ? formatRange(g.range) : "closed");
    }).join(" · ");
  }

  // Two short lines for the info strip: ["Open Daily", "8:00 a.m. – 9:00 p.m."]
  function hoursLines() {
    var groups = hoursGroups();
    if (groups.length === 1 && groups[0].range) return ["Open Daily", formatRange(groups[0].range)];
    return [hoursSummary(), ""];
  }

  // Short hours list for the Visit band: "Mon – Sun  8:00 a.m. – 9:00 p.m."
  function renderHoursGroups() {
    $$("[data-hours-groups]").forEach(function (dl) {
      dl.innerHTML = hoursGroups().map(function (g) {
        var days = g.start === g.end ? DAY_SHORT[g.start] : DAY_SHORT[g.start] + " – " + DAY_SHORT[g.end];
        return "<div><dt>" + days + "</dt><dd>" + (g.range ? formatRange(g.range) : "Closed") + "</dd></div>";
      }).join("");
    });
  }

  function renderHoursTable() {
    var table = $("[data-hours-table]");
    if (!table) return;
    var todayIdx = torontoNow().dayIndex;
    var rows = DAY_KEYS.map(function (k, i) {
      var isToday = i === todayIdx;
      var r = SITE.hours[k];
      return '<tr' + (isToday ? ' class="is-today"' : "") + '><th scope="row">' + DAY_LONG[k] +
        (isToday ? ' <span class="visually-hidden">(today)</span>' : "") + "</th><td>" +
        (r ? formatRange(r) : "Closed") + "</td></tr>";
    }).join("");
    table.insertAdjacentHTML("beforeend", "<tbody>" + rows + "</tbody>");
  }

  /* ---------- config binding ---------- */

  // "(647) 575-9431" -> "+16475759431" for tel: links and schema.
  function phoneE164(phone) {
    var digits = String(phone || "").replace(/\D/g, "");
    if (digits.length === 10) digits = "1" + digits;
    return digits ? "+" + digits : "";
  }
  var payments = (SITE.payments || []).filter(Boolean);

  // "a, b and c"
  function listJoin(arr) {
    if (arr.length < 2) return arr.join("");
    return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
  }

  // Menu items carrying a tag ("v", "s", "gf"), for the FAQ answers.
  function taggedItems(tag) {
    if (typeof MENU === "undefined") return [];
    var out = [];
    MENU.forEach(function (cat) {
      cat.items.forEach(function (item) {
        if ((item.tags || []).indexOf(tag) !== -1) out.push(item.name);
      });
    });
    return out;
  }

  // "We're open right now until 9 p.m." / "We're closed right now and open again tomorrow at 8 a.m."
  function openNowSentence() {
    var st = openStatus();
    if (!st) return "";
    if (st.open) return st.text ? "We're open right now until " + st.text.replace(/^Closes /, "") : "We're open right now.";
    var m = st.text.replace(/^Opens /, "").match(/^(.*?)(\d.*)$/);
    if (!m) return "We're closed right now.";
    return "We're closed right now and open again " + (m[1] ? m[1] + "at " : "at ") + m[2];
  }

  // "We're open daily from 8:00 a.m. to 9:00 p.m."
  function hoursSentence() {
    var g = hoursGroups();
    // Times already end in "a.m." / "p.m.", so no extra full stop.
    if (g.length === 1 && g[0].range) return "We're open daily from " + formatTime(g[0].range[0]) + " to " + formatTime(g[0].range[1]);
    return "Our hours: " + hoursSummary();
  }

  var vegItems = taggedItems("v");
  var gfItems = taggedItems("gf");
  var spicyItems = taggedItems("s");

  var a = SITE.address;
  var values = {
    name: SITE.name,
    fullName: SITE.fullName || SITE.name,
    menuCount: typeof MENU === "undefined" ? "" : MENU.reduce(function (n, c) { return n + c.items.length; }, 0),
    daysOpen: DAY_KEYS.filter(function (k) { return SITE.hours[k]; }).length + " days",
    logoTop: SITE.logoTop || SITE.name,
    logoBottom: SITE.logoBottom || "",
    city: SITE.city,
    tagline: SITE.tagline,
    street: a.street,
    addressLine1: a.street,
    addressLine2: a.city + ", " + a.region + " " + a.postalCode,
    phone: SITE.phone,
    hoursSummary: hoursSummary(),
    ratingValue: Number(SITE.rating.value).toFixed(1),
    ratingCount: SITE.rating.count,
    addressLine1Comma: a.street + ",",
    hoursLine1: hoursLines()[0],
    hoursLine2: hoursLines()[1],
    payments: payments.join(" · "),
    paymentsLower: listJoin(payments.map(function (p) { return p.toLowerCase(); })),
    openNowSentence: openNowSentence(),
    hoursSentence: hoursSentence(),
    vegCount: vegItems.length,
    vegList: listJoin(vegItems.slice(0, 4).map(function (n) { return n.toLowerCase(); })),
    gfList: gfItems.length ? listJoin(gfItems.map(function (n) { return n.toLowerCase(); })) : "a few gluten-free choices",
    spicyList: listJoin(spicyItems.map(function (n) { return "the " + n; }))
  };
  var links = {
    orderUrl: SITE.orderUrl,
    directionsUrl: SITE.directionsUrl,
    reviewsUrl: SITE.reviewsUrl,
    instagram: SITE.instagram,
    phoneHref: SITE.phone ? "tel:" + phoneE164(SITE.phone) : ""
  };
  var flags = {
    tagline: !!SITE.tagline,
    phone: !!SITE.phone,
    instagram: !!SITE.instagram,
    payments: payments.length > 0
  };

  function bindConfig() {
    $$("[data-bind]").forEach(function (el) {
      var v = values[el.getAttribute("data-bind")];
      if (v !== undefined) el.textContent = v;
    });
    $$("[data-href]").forEach(function (el) {
      var v = links[el.getAttribute("data-href")];
      if (v) el.setAttribute("href", v);
      else el.hidden = true;
    });
    $$("[data-requires]").forEach(function (el) {
      if (!flags[el.getAttribute("data-requires")]) el.hidden = true;
    });
    $$("[data-src-config]").forEach(function (el) {
      var v = SITE[el.getAttribute("data-src-config")];
      if (v) el.src = v;
    });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- JSON-LD (LocalBusiness) ---------- */

  function injectSchema() {
    var spec = hoursGroups().filter(function (g) { return g.range; }).map(function (g) {
      var days = DAY_KEYS.slice(DAY_KEYS.indexOf(g.start), DAY_KEYS.indexOf(g.end) + 1);
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days.map(function (k) { return DAY_LONG[k]; }),
        opens: g.range[0],
        closes: g.range[1]
      };
    });
    var base = location.href.split("#")[0].replace(/[^/]*$/, "");
    var data = {
      "@context": "https://schema.org",
      "@type": "CafeOrCoffeeShop",
      name: SITE.name,
      alternateName: SITE.fullName,
      url: base,
      image: base + "assets/og-image.jpg",
      menu: base + "menu.html",
      servesCuisine: ["Coffee", "Ethiopian", "Breakfast", "Brunch", "Greek", "Vegetarian"],
      address: {
        "@type": "PostalAddress",
        streetAddress: a.street,
        addressLocality: a.city,
        addressRegion: a.region,
        postalCode: a.postalCode,
        addressCountry: a.country
      },
      geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
      hasMap: SITE.reviewsUrl,
      openingHoursSpecification: spec,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: SITE.rating.value,
        reviewCount: SITE.rating.count,
        bestRating: 5
      },
      potentialAction: {
        "@type": "OrderAction",
        target: SITE.orderUrl
      }
    };
    if (SITE.phone) data.telephone = phoneE164(SITE.phone);
    if (payments.length) data.paymentAccepted = payments.join(", ");
    if (SITE.instagram) data.sameAs = [SITE.instagram];

    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  // FAQPage structured data built from the FAQ on the page (after config values are filled in).
  function injectFaqSchema() {
    var items = $$("[data-faq] details").filter(function (d) { return !d.hidden; });
    if (!items.length) return;
    var data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map(function (d) {
        return {
          "@type": "Question",
          name: $("summary", d).textContent.trim(),
          acceptedAnswer: { "@type": "Answer", text: $(".faq-answer", d).textContent.replace(/\s+/g, " ").trim() }
        };
      })
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ---------- images & placeholders ---------- */

  function placeholderHTML(label) {
    return '<div class="placeholder" aria-hidden="true">' +
      '<svg class="placeholder-icon"><use href="#i-cup"/></svg>' +
      (label ? '<span class="placeholder-label">' + esc(label) + "</span>" : "") +
      "</div>";
  }

  // If a photo file is missing, swap in the warm placeholder.
  function watchImages(root) {
    $$("img[data-fallback]", root).forEach(function (img) {
      img.addEventListener("error", function () {
        img.insertAdjacentHTML("afterend", placeholderHTML(img.getAttribute("data-fallback")));
        img.remove();
      }, { once: true });
    });
  }

  function imgHTML(src, alt, w, h, fallbackLabel) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" width="' + w + '" height="' + h +
      '" loading="lazy" decoding="async" data-fallback="' + esc(fallbackLabel || "") + '">';
  }

  function categoryImage(id) {
    if (typeof MENU === "undefined") return "";
    for (var i = 0; i < MENU.length; i++) {
      if (MENU[i].id === id) return MENU[i].image || "";
    }
    return "";
  }

  function renderHighlights() {
    var list = $("[data-highlights]");
    if (!list) return;
    list.innerHTML = (SITE.highlights || []).map(function (h) {
      var src = h.image || categoryImage(h.category);
      var media = src ? imgHTML(src, "", 480, 340, "") : placeholderHTML("");
      return '<li class="reveal"><a class="menu-card" href="menu.html#' + esc(h.category) + '">' +
        '<span class="mc-media">' + media + "</span>" +
        '<span class="mc-body"><span class="mc-text"><span class="mc-title">' + esc(h.label) + "</span>" +
        (h.sub ? '<span class="mc-sub">' + esc(h.sub) + "</span>" : "") + "</span>" +
        '<span class="mc-arrow" aria-hidden="true"><svg class="icon"><use href="#i-arrow"/></svg></span></span></a></li>';
    }).join("");
    watchImages(list);
  }

  function galleryItems() {
    return (SITE.images && SITE.images.gallery) || [];
  }

  // Row of photos on the homepage; each links to the Gallery page.
  function renderGalleryStrip() {
    var strip = $("[data-gallery-strip]");
    if (!strip) return;
    strip.innerHTML = galleryItems().filter(function (g) { return g.src; }).slice(0, 6).map(function (g) {
      return '<li><a class="strip-photo" href="gallery.html">' + imgHTML(g.src, g.alt || g.caption, 400, 300, g.caption) + "</a></li>";
    }).join("");
    watchImages(strip);
  }

  // Small 3-photo preview on the homepage; each links to the Gallery page.
  function renderGalleryPreview() {
    var preview = $("[data-gallery-preview]");
    if (!preview) return;
    var picks = galleryItems().filter(function (g) { return g.preview && g.src; }).slice(0, 3);
    preview.innerHTML = picks.map(function (g) {
      return '<li><a class="mini-photo" href="gallery.html">' + imgHTML(g.src, g.alt || g.caption, 400, 400, g.caption) + "</a></li>";
    }).join("");
    watchImages(preview);
  }

  function renderGallery() {
    var list = $("[data-gallery]");
    if (!list) return;
    var items = galleryItems();
    if (!items.length) { $("#gallery").hidden = true; return; }
    var zoomable = !!$("[data-lightbox]");
    list.innerHTML = items.map(function (g, i) {
      var media = g.src ? imgHTML(g.src, g.alt || g.caption, 600, 600, g.caption) : placeholderHTML(g.caption);
      if (zoomable && g.src) {
        media = '<button class="gallery-open" type="button" data-index="' + i + '" aria-label="View photo: ' +
          esc(g.caption || g.alt || "photo") + '">' + media + "</button>";
      }
      return '<li class="reveal"><figure class="gallery-item">' + media +
        (g.src && g.caption ? '<figcaption>' + esc(g.caption) + "</figcaption>" : "") +
        "</figure></li>";
    }).join("");
    watchImages(list);
  }

  /* Full-size photo viewer on the Gallery page (native <dialog>, arrow keys, Esc to close). */
  function setupLightbox() {
    var box = $("[data-lightbox]");
    var list = $("[data-gallery]");
    if (!box || !list || typeof box.showModal !== "function") return;
    var photos = galleryItems().filter(function (g) { return g.src; });
    var img = $("[data-lightbox-img]", box);
    var cap = $("[data-lightbox-caption]", box);
    var current = 0;

    function show(i) {
      current = (i + photos.length) % photos.length;
      var g = photos[current];
      img.src = g.src;
      img.alt = g.alt || g.caption || "";
      cap.textContent = g.caption || "";
    }

    list.addEventListener("click", function (e) {
      var btn = e.target.closest(".gallery-open");
      if (!btn) return;
      var src = galleryItems()[+btn.getAttribute("data-index")].src;
      show(photos.findIndex(function (g) { return g.src === src; }));
      box.showModal();
    });
    $("[data-lightbox-close]", box).addEventListener("click", function () { box.close(); });
    $("[data-lightbox-prev]", box).addEventListener("click", function () { show(current - 1); });
    $("[data-lightbox-next]", box).addEventListener("click", function () { show(current + 1); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    // Click on the dark backdrop closes the viewer.
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
  }

  function renderStars() {
    $$("[data-stars]").forEach(function (el) {
      var v = Number(SITE.rating.value);
      var html = "";
      for (var i = 1; i <= 5; i++) {
        html += '<svg class="star' + (i <= Math.round(v) ? " is-full" : "") + '" aria-hidden="true"><use href="#i-star"/></svg>';
      }
      el.innerHTML = html;
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", "Rated " + v.toFixed(1) + " out of 5");
    });
  }

  /* ---------- header & nav ---------- */

  function setupHeader() {
    var header = $("[data-header]");
    var toggle = $("[data-nav-toggle]");
    var nav = $("[data-nav]");
    if (!header) return;

    function setHeaderVar() {
      document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    }
    setHeaderVar();
    window.addEventListener("resize", setHeaderVar);

    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!toggle || !nav) return;
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1020px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- reveal on scroll ---------- */

  function setupReveal() {
    var els = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  // How much of the top of the screen is covered by sticky bars on the menu page,
  // so jumping to a section lands just below them.
  var menuOffsetPx = 0;
  function setMenuOffset() {
    var header = $("[data-header]");
    var tools = $("[data-menu-tools]");
    if (!tools) return;
    var headerSticky = header && getComputedStyle(header).position === "sticky";
    var offset = (headerSticky ? header.offsetHeight : 0) + tools.offsetHeight;
    menuOffsetPx = offset;
    document.documentElement.style.setProperty("--menu-offset", offset + "px");
    document.documentElement.style.scrollPaddingTop = (offset + 10) + "px";
  }

  // "Sections" button: a panel with every menu section.
  function setupSectionsPanel() {
    var btn = $("[data-sections-toggle]");
    var panel = $("[data-sections-panel]");
    if (!btn || !panel) return;
    function setOpen(open) {
      btn.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      setMenuOffset();
    }
    btn.addEventListener("click", function () { setOpen(panel.hidden); });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        setOpen(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) { setOpen(false); btn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !e.target.closest("[data-sections-panel], [data-sections-toggle]")) setOpen(false);
    });
  }

  // Magnifier button in the category bar: shows the search box and filters only when wanted.
  function setupSearchPanel(input, isFiltering) {
    var btn = $("[data-search-toggle]");
    var panel = $("[data-search-panel]");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      setMenuOffset();
      if (open) input.focus();
      btn.classList.toggle("is-filtering", isFiltering());
    });
  }

  // Tap a dish photo to see it large, with its name and price.
  function setupDishViewer(root) {
    var box = $("[data-dish-viewer]");
    if (!box || typeof box.showModal !== "function") return;
    var img = $("[data-dish-img]", box);
    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-dish]");
      if (!btn) return;
      var idx = btn.getAttribute("data-dish").split("-");
      var item = MENU[+idx[0]].items[+idx[1]];
      var thumb = item.image;
      img.onerror = function () { img.onerror = null; img.src = thumb; };
      img.src = thumb.replace("/items/", "/items/large/");
      img.alt = item.name;
      $("[data-dish-name]", box).textContent = item.name;
      $("[data-dish-price]", box).textContent = formatPrice(item.price);
      $("[data-dish-desc]", box).textContent = item.desc || "";
      box.showModal();
    });
    $("[data-dish-close]", box).addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
  }

  // Round "back to top" button that appears after scrolling down.
  function setupToTop() {
    var btn = $("[data-to-top]");
    if (!btn) return;
    function onScroll() { btn.classList.toggle("is-visible", window.scrollY > 900); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- menu page ---------- */

  function renderMenu() {
    var root = $("[data-menu-root]");
    if (!root || typeof MENU === "undefined") return;

    var tabsList = $("[data-menu-tabs]");
    var search = $("[data-menu-search]");
    var countEl = $("[data-menu-count]");
    var emptyEl = $("[data-menu-empty]");
    var activeFilters = {};

    tabsList.innerHTML = MENU.map(function (cat) {
      return '<li><a class="tab" href="#' + esc(cat.id) + '" data-tab="' + esc(cat.id) + '">' + esc(cat.name) + "</a></li>";
    }).join("");

    var tabsBar = tabsList.parentNode;
    function markTabsScrolled() { tabsBar.classList.toggle("is-scrolled", tabsBar.scrollLeft > 4); }
    tabsBar.addEventListener("scroll", markTabsScrolled, { passive: true });

    var sectionsGrid = $("[data-sections-grid]");
    if (sectionsGrid) {
      sectionsGrid.innerHTML = MENU.map(function (cat) {
        return '<li><a class="section-link" href="#' + esc(cat.id) + '" data-section="' + esc(cat.id) + '">' +
          (cat.image ? '<img src="' + esc(cat.image) + '" alt="" width="96" height="64" loading="lazy" decoding="async">' : "") +
          '<span class="section-name">' + esc(cat.name) + '</span><span class="section-count" data-section-count>' +
          cat.items.length + "</span></a></li>";
      }).join("");
    }

    root.innerHTML = MENU.map(function (cat, ci) {
      var items = cat.items.map(function (item, ii) {
        var tags = item.tags || [];
        var tagHTML = tags.filter(function (t) { return TAGS[t]; }).map(function (t) {
          return '<span class="tag" role="img" aria-label="' + TAGS[t].label + '" title="' + TAGS[t].label + '">' +
            '<svg class="tag-icon tag-' + t + '" aria-hidden="true"><use href="#' + TAGS[t].icon + '"/></svg></span>';
        }).join("");
        var haystack = (item.name + " " + (item.desc || "") + " " + cat.name).toLowerCase();
        var thumb = item.image
          ? '<button class="thumb-btn" type="button" data-dish="' + ci + "-" + ii + '" aria-label="View photo: ' + esc(item.name) + '">' +
            '<img class="item-thumb" src="' + esc(item.image) + '" alt="" width="240" height="240" loading="lazy" decoding="async"></button>'
          : "";
        return '<li class="menu-item' + (thumb ? " has-photo" : "") + '" data-tags="' + esc(tags.join(" ")) + '" data-search="' + esc(haystack) + '">' +
          thumb +
          '<div class="item-body">' +
            '<div class="item-line">' +
              '<h3 class="item-name">' + esc(item.name) + (tagHTML ? '<span class="item-tags">' + tagHTML + "</span>" : "") + "</h3>" +
              '<span class="item-dots" aria-hidden="true"></span>' +
              '<span class="item-price">' + formatPrice(item.price) + "</span>" +
            "</div>" +
            (item.desc ? '<p class="item-desc">' + esc(item.desc) + "</p>" : "") +
          "</div>" +
          "</li>";
      }).join("");
      var head = '<div class="cat-heading">' +
        (cat.image ? '<img class="cat-icon" src="' + esc(cat.image) + '" alt="" width="96" height="96" loading="lazy" decoding="async">' : "") +
        '<h2 class="menu-cat-title" id="h-' + esc(cat.id) + '">' + esc(cat.name) + "</h2>" +
        '<span class="cat-count" data-cat-count>' + cat.items.length + " items</span></div>";
      return '<section class="menu-cat" id="' + esc(cat.id) + '" aria-labelledby="h-' + esc(cat.id) + '">' +
        head +
        '<ul class="menu-list" role="list">' + items + "</ul></section>";
    }).join("");

    watchImages(root);
    // A missing item photo just drops the thumbnail; the row stays text-only.
    $$(".item-thumb", root).forEach(function (img) {
      img.addEventListener("error", function () {
        var btn = img.closest(".thumb-btn");
        btn.parentNode.classList.remove("has-photo");
        btn.remove();
      }, { once: true });
    });
    var total = $$(".menu-item", root).length;

    function applyFilters() {
      var q = search.value.trim().toLowerCase();
      var filters = Object.keys(activeFilters).filter(function (k) { return activeFilters[k]; });
      var shown = 0;
      $$(".menu-cat", root).forEach(function (sec) {
        var visibleInCat = 0;
        $$(".menu-item", sec).forEach(function (li) {
          var tags = li.getAttribute("data-tags").split(" ");
          var ok = (!q || li.getAttribute("data-search").indexOf(q) !== -1) &&
            filters.every(function (f) { return tags.indexOf(f) !== -1; });
          li.hidden = !ok;
          if (ok) visibleInCat++;
        });
        sec.hidden = visibleInCat === 0;
        var catCount = $("[data-cat-count]", sec);
        if (catCount) catCount.textContent = visibleInCat + (visibleInCat === 1 ? " item" : " items");
        var tab = $('[data-tab="' + sec.id + '"]', tabsList);
        if (tab) tab.parentNode.hidden = visibleInCat === 0;
        var link = sectionsGrid && $('[data-section="' + sec.id + '"]', sectionsGrid);
        if (link) {
          link.parentNode.hidden = visibleInCat === 0;
          $("[data-section-count]", link).textContent = visibleInCat;
        }
        shown += visibleInCat;
      });
      emptyEl.hidden = shown !== 0;
      var sBtn = $("[data-search-toggle]");
      if (sBtn) sBtn.classList.toggle("is-filtering", !!q || filters.length > 0);
      countEl.textContent = (q || filters.length) ? "Showing " + shown + " of " + total + " items" : "";
    }

    search.addEventListener("input", applyFilters);
    var resetBtn = $("[data-menu-reset]");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        search.value = "";
        activeFilters = {};
        $$("[data-filter]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        applyFilters();
        search.focus();
      });
    }
    $$("[data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-filter");
        var on = btn.getAttribute("aria-pressed") !== "true";
        btn.setAttribute("aria-pressed", String(on));
        activeFilters[key] = on;
        applyFilters();
      });
    });

    // Highlight the tab for the section on screen and keep that tab centred in the bar.
    var activeId = null;
    function setActive(id) {
      if (!id || id === activeId) return;
      activeId = id;
      $$(".tab", tabsList).forEach(function (t) {
        var active = t.getAttribute("data-tab") === id;
        t.classList.toggle("is-active", active);
        if (active) {
          t.setAttribute("aria-current", "true");
          var bar = tabsList.parentNode;
          // Position of the tab inside the scrolling bar (not the page), centred in view.
          var inBar = t.getBoundingClientRect().left - bar.getBoundingClientRect().left + bar.scrollLeft;
          // Set directly: a sliding animation here gets cancelled when the page itself jumps.
          bar.scrollLeft = Math.max(0, inBar - (bar.clientWidth - t.offsetWidth) / 2);
          bar.classList.toggle("is-scrolled", bar.scrollLeft > 4);
        } else {
          t.removeAttribute("aria-current");
        }
      });
    }

    // The section on screen is the last one whose heading has reached the bottom of the sticky bar.
    function sectionOnScreen() {
      var secs = $$(".menu-cat", root).filter(function (sec) { return !sec.hidden; });
      if (!secs.length) return null;
      var line = menuOffsetPx + 24;
      var current = secs[0];
      secs.forEach(function (sec) { if (sec.getBoundingClientRect().top <= line) current = sec; });
      // At the very bottom of the page the last section wins, even if it is short.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = secs[secs.length - 1];
      return current.id;
    }

    var jumping = false, jumpTimer = 0, ticking = false;
    window.addEventListener("scroll", function () {
      if (jumping || ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; setActive(sectionOnScreen()); });
    }, { passive: true });

    // Scroll so the section heading sits just below the sticky bar, and highlight its tab right away.
    function jumpTo(id, smooth) {
      var el = document.getElementById(id);
      if (!el || el.hidden) return;
      setMenuOffset();
      var y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - menuOffsetPx - 8);
      // Slide to nearby sections; jump straight to far ones (a long slide is slow and dizzying).
      var glide = smooth && !reduceMotion && Math.abs(y - window.scrollY) < 1400;
      jumping = true;
      setActive(id);
      window.scrollTo({ top: y, behavior: glide ? "smooth" : "instant" });
      clearTimeout(jumpTimer);
      jumpTimer = setTimeout(function () { jumping = false; setActive(sectionOnScreen()); }, glide ? 700 : 80);
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    }

    // Tabs and the Sections panel both jump with the exact position above.
    document.addEventListener("click", function (e) {
      var link = e.target.closest(".tab, .section-link");
      if (!link) return;
      e.preventDefault();
      var id = link.getAttribute("href").slice(1);
      var panel = $("[data-sections-panel]");
      if (panel && !panel.hidden) {
        panel.hidden = true;
        var btn = $("[data-sections-toggle]");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
      jumpTo(id, true);
    });

    setupSectionsPanel();
    setupSearchPanel(search, function () {
      return !!search.value.trim() || Object.keys(activeFilters).some(function (k) { return activeFilters[k]; });
    });
    setupDishViewer(root);
    setupToTop();
    setMenuOffset();
    window.addEventListener("resize", setMenuOffset);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setMenuOffset);

    // Content is rendered by JS, so jump to #category (e.g. from the homepage cards) once it exists.
    var startId = location.hash ? decodeURIComponent(location.hash.slice(1)) : "";
    requestAnimationFrame(function () {
      if (startId && document.getElementById(startId)) jumpTo(startId, false);
      else setActive(sectionOnScreen());
    });
    // Re-check once photos and fonts have settled the layout.
    window.addEventListener("load", function () {
      if (startId && document.getElementById(startId)) jumpTo(startId, false);
    });
  }

  /* ---------- init ---------- */

  bindConfig();
  renderOpenStatus();
  renderHoursTable();
  renderStars();
  renderHighlights();
  renderGallery();
  renderGalleryPreview();
  renderGalleryStrip();
  renderHoursGroups();
  setupLightbox();
  renderMenu();
  setupHeader();
  setupReveal();
  injectSchema();
  injectFaqSchema();
  setInterval(renderOpenStatus, 60 * 1000);
})();
