/* AutoCoolParts — country picker: USA · Canada · India · Australia
   - First visit to the home page: asks the visitor to pick a country.
   - The choice is remembered on that device (localStorage), and the
     header button lets them change it any time.
   - Order is always USA, Canada, India, Australia. */
(function () {
  "use strict";

  var KEY = "acp_region";
  var store = {
    get: function () { try { return window.localStorage.getItem(KEY); } catch (e) { return null; } },
    set: function (v) { try { window.localStorage.setItem(KEY, v); } catch (e) {} }
  };

  var FLAGS = {
    in: '<svg class="rg-flag" viewBox="0 0 36 24" aria-hidden="true"><rect width="36" height="8" fill="#FF9933"/><rect y="8" width="36" height="8" fill="#fff"/><rect y="16" width="36" height="8" fill="#138808"/><circle cx="18" cy="12" r="3.1" fill="none" stroke="#000080" stroke-width=".8"/><circle cx="18" cy="12" r=".8" fill="#000080"/><path d="M18 8.9v6.2M14.9 12h6.2M15.8 9.8l4.4 4.4M20.2 9.8l-4.4 4.4" stroke="#000080" stroke-width=".35"/></svg>',
    ca: '<svg class="rg-flag" viewBox="0 0 36 24" aria-hidden="true"><rect width="36" height="24" fill="#fff"/><rect width="9" height="24" fill="#D80621"/><rect x="27" width="9" height="24" fill="#D80621"/><path transform="translate(18 12) scale(.78) translate(-24 -12)" fill="#D80621" d="M24 3.6l1.6 3.2 1.8-.8-.6 4.2 2.8-2.2.6 1.4 2.2-.4-.8 2.6 1.2.6-4.2 3.2.6 1.4-4.6-.6V20h-1.2v-3.4l-4.6.6.6-1.4-4.2-3.2 1.2-.6-.8-2.6 2.2.4.6-1.4 2.8 2.2-.6-4.2 1.8.8z"/></svg>',
    us: '<svg class="rg-flag" viewBox="0 0 36 24" aria-hidden="true"><rect width="36" height="24" fill="#fff"/><g fill="#B22234"><rect width="36" height="1.85"/><rect y="3.69" width="36" height="1.85"/><rect y="7.38" width="36" height="1.85"/><rect y="11.08" width="36" height="1.85"/><rect y="14.77" width="36" height="1.85"/><rect y="18.46" width="36" height="1.85"/><rect y="22.15" width="36" height="1.85"/></g><rect width="15" height="12.92" fill="#3C3B6E"/><g fill="#fff"><circle cx="2.5" cy="2.2" r=".6"/><circle cx="6" cy="2.2" r=".6"/><circle cx="9.5" cy="2.2" r=".6"/><circle cx="13" cy="2.2" r=".6"/><circle cx="4.2" cy="4.8" r=".6"/><circle cx="7.7" cy="4.8" r=".6"/><circle cx="11.2" cy="4.8" r=".6"/><circle cx="2.5" cy="7.4" r=".6"/><circle cx="6" cy="7.4" r=".6"/><circle cx="9.5" cy="7.4" r=".6"/><circle cx="13" cy="7.4" r=".6"/><circle cx="4.2" cy="10" r=".6"/><circle cx="7.7" cy="10" r=".6"/><circle cx="11.2" cy="10" r=".6"/></g></svg>',
    au: '<svg class="rg-flag" viewBox="0 0 36 24" aria-hidden="true"><rect width="36" height="24" fill="#012169"/><svg width="18" height="12" viewBox="0 0 18 12"><path d="M0 0L18 12M18 0L0 12" stroke="#fff" stroke-width="2.4"/><path d="M0 0L18 12M18 0L0 12" stroke="#C8102E" stroke-width=".8"/><path d="M9 0v12M0 6h18" stroke="#fff" stroke-width="4"/><path d="M9 0v12M0 6h18" stroke="#C8102E" stroke-width="2.4"/></svg><polygon points="9.00,15.60 9.50,17.16 11.03,16.58 10.12,17.94 11.53,18.78 9.90,18.92 10.13,20.54 9.00,19.35 7.87,20.54 8.10,18.92 6.47,18.78 7.88,17.94 6.97,16.58 8.50,17.16" fill="#fff"/><polygon points="27.00,18.00 27.28,18.91 28.17,18.56 27.63,19.36 28.46,19.83 27.51,19.91 27.65,20.85 27.00,20.15 26.35,20.85 26.49,19.91 25.54,19.83 26.37,19.36 25.83,18.56 26.72,18.91" fill="#fff"/><polygon points="23.00,10.00 23.24,10.80 24.02,10.49 23.54,11.18 24.27,11.59 23.43,11.64 23.56,12.47 23.00,11.85 22.44,12.47 22.57,11.64 21.73,11.59 22.46,11.18 21.98,10.49 22.76,10.80" fill="#fff"/><polygon points="27.00,3.70 27.24,4.50 28.02,4.19 27.54,4.88 28.27,5.29 27.43,5.34 27.56,6.17 27.00,5.55 26.44,6.17 26.57,5.34 25.73,5.29 26.46,4.88 25.98,4.19 26.76,4.50" fill="#fff"/><polygon points="31.00,8.50 31.24,9.30 32.02,8.99 31.54,9.68 32.27,10.09 31.43,10.14 31.56,10.97 31.00,10.35 30.44,10.97 30.57,10.14 29.73,10.09 30.46,9.68 29.98,8.99 30.76,9.30" fill="#fff"/><polygon points="29.20,12.80 29.41,13.32 29.96,13.35 29.53,13.71 29.67,14.25 29.20,13.95 28.73,14.25 28.87,13.71 28.44,13.35 28.99,13.32" fill="#fff"/></svg>'
  };

  // USA, Canada, India, then Australia
  var REGIONS = [
    { id: "us", name: "USA", url: "usa.html", sub: "Electric AC · Truck heaters" },
    { id: "ca", name: "Canada", url: "index.html", sub: "Truck heaters &amp; cooling · Across Canada" },
    { id: "in", name: "India", url: "india.html", sub: "Electric AC · Heaters · AC parts" },
    { id: "au", name: "Australia", url: "australia.html", sub: "Electric AC for trucks" }
  ];
  var byId = {};
  REGIONS.forEach(function (r) { byId[r.id] = r; });

  var here = document.documentElement.getAttribute("data-region") || "ca";
  var ARR = '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ── Build the picker ── */
  var dlg = document.createElement("dialog");
  dlg.className = "rg-gate";
  dlg.setAttribute("aria-labelledby", "rgTitle");
  dlg.innerHTML =
    '<div class="rg-in" tabindex="-1">' +
      '<div class="rg-logo"><img src="images/logo_transparent.png" alt="" width="40" height="42"><span>AutoCool<b>Parts</b><small class="tld">.com</small></span></div>' +
      '<p class="rg-tag">A global brand</p>' +
      '<h2 id="rgTitle">Choose your country</h2>' +
      '<ul class="rg-list">' +
        REGIONS.map(function (r) {
          return '<li><button type="button" class="rg-opt" data-region="' + r.id + '"' + (r.id === here ? ' aria-current="true"' : "") + ">" +
            FLAGS[r.id] + "<span><strong>" + r.name + "</strong><small>" + r.sub + "</small></span>" + ARR + "</button></li>";
        }).join("") +
      "</ul>" +
      '<p class="rg-note">You can change this any time from the top of the page.</p>' +
    "</div>";
  document.body.appendChild(dlg);

  var open = function () {
    if (typeof dlg.showModal === "function") { if (!dlg.open) dlg.showModal(); }
    else dlg.setAttribute("open", "");
    // Focus the visitor's saved country, or the panel itself on a first visit (so nothing looks pre-selected)
    var cur = dlg.querySelector('.rg-opt[data-region="' + (store.get() || "") + '"]') || dlg.querySelector(".rg-in");
    cur.focus();
  };
  var close = function () { if (typeof dlg.close === "function" && dlg.open) dlg.close(); else dlg.removeAttribute("open"); };

  Array.prototype.forEach.call(dlg.querySelectorAll(".rg-opt"), function (b) {
    b.addEventListener("click", function () {
      var r = byId[b.getAttribute("data-region")];
      store.set(r.id);
      if (r.id === here) {
        close();
        if (/[?&]region=/.test(location.search) && window.history && history.replaceState) history.replaceState(null, "", location.pathname + location.hash);
      } else {
        location.href = r.url;
      }
    });
  });
  // Click on the dark backdrop closes it (stays on this page)
  dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });

  /* ── Header switch buttons ── */
  Array.prototype.forEach.call(document.querySelectorAll(".rg-switch"), function (btn) {
    btn.innerHTML = FLAGS[here] + '<span class="rg-name">' + byId[here].name + "</span>" +
      '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    btn.setAttribute("aria-label", "Country: " + byId[here].name + ". Change country");
    btn.addEventListener("click", function (e) { e.preventDefault(); open(); });
  });

  /* ── When to show it automatically ── */
  var askParam = /[?&]region=pick/.test(location.search);
  if (askParam || (here === "ca" && !store.get())) open();
})();
