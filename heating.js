/* AutoCoolParts — Heating page */
(function () {
  "use strict";

  /* ── Settings: the number every "Text" button messages ── */
  var PHONE = "+15062381661";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  /* ── Mobile nav ── */
  var burger = $("#burger"), nav = $("#nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); });
    });
  }

  /* ── Snow in hero ── */
  var cv = $("#snow");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d"), flakes = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = function () {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(140, W * H / 9000));
      flakes = [];
      for (var i = 0; i < n; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + 0.4, v: Math.random() * 0.6 + 0.25, d: Math.random() * 0.6 - 0.3, a: Math.random() * 0.5 + 0.2 });
    };
    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283);
        ctx.fillStyle = "rgba(234,242,248," + f.a + ")"; ctx.fill();
      }
    };
    var tick = function () {
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i]; f.y += f.v; f.x += f.d + Math.sin(f.y / 40) * 0.2;
        if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; }
        if (f.x > W + 4) f.x = -4; if (f.x < -4) f.x = W + 4;
      }
      draw(); requestAnimationFrame(tick);
    };
    size(); draw();
    window.addEventListener("resize", function () { size(); draw(); });
    if (!reduced) requestAnimationFrame(tick);
  }

  /* ── Truck diagrams ── */
  var NS = "http://www.w3.org/2000/svg";
  var truckBase =
    '<line class="dg-ground" x1="6" y1="173" x2="434" y2="173"/>' +
    '<circle class="dg-snow" cx="300" cy="22" r="1.6"/><circle class="dg-snow" cx="352" cy="40" r="1.2"/><circle class="dg-snow" cx="394" cy="18" r="1.6"/><circle class="dg-snow" cx="40" cy="30" r="1.3"/><circle class="dg-snow" cx="84" cy="52" r="1.6"/><circle class="dg-snow" cx="238" cy="14" r="1.2"/>' +
    '<rect class="dg-fill" x="28" y="128" width="370" height="10" rx="2"/>' +
    '<path class="dg-fill" d="M20 130 L24 96 Q26 88 36 86 L112 78 L116 130 Z"/>' +
    '<rect class="dg-fill" x="10" y="116" width="16" height="20" rx="3"/>' +
    '<path class="dg-fill" d="M112 130 L120 46 Q121 40 128 40 L190 36 L190 130 Z"/>' +
    '<path class="dg-glass" d="M127 50 L180 47 L180 84 L123 86 Z"/>' +
    '<line class="dg-line" x1="150" y1="90" x2="150" y2="126"/>' +
    '<path class="dg-fill" d="M190 36 Q190 28 198 28 L262 28 Q270 28 270 36 L270 130 L190 130 Z"/>' +
    '<rect class="dg-glass" x="226" y="44" width="30" height="14" rx="3"/>' +
    '<rect class="dg-fill" x="192" y="6" width="7" height="30" rx="2"/>' +
    '<rect class="dg-fill" x="150" y="134" width="56" height="20" rx="9"/>' +
    '<rect class="dg-fill" x="300" y="120" width="56" height="8" rx="2"/>' +
    '<circle class="dg-wheel" cx="72" cy="153" r="19"/><circle class="dg-hub" cx="72" cy="153" r="7"/>' +
    '<circle class="dg-wheel" cx="300" cy="153" r="19"/><circle class="dg-hub" cx="300" cy="153" r="7"/>' +
    '<circle class="dg-wheel" cx="348" cy="153" r="19"/><circle class="dg-hub" cx="348" cy="153" r="7"/>';

  var waves = function (xs, y) {
    return xs.map(function (x) { return '<path class="dg-wave" d="M' + x + ' ' + y + ' q-4 -6 0 -12 q4 -6 0 -12"/>'; }).join("");
  };
  var label = function (fromX, fromY, title, sub) {
    return '<polyline class="dg-line" points="' + fromX + "," + fromY + " 284," + 70 + ' 296,70"/>' +
      '<circle class="dg-hot" cx="' + fromX + '" cy="' + fromY + '" r="3"/>' +
      '<text class="dg-lbl" x="300" y="68">' + title + "</text>" +
      '<text class="dg-sub" x="300" y="86">' + sub + "</text>";
  };
  var zones = {
    bunk:
      '<rect x="200" y="106" width="50" height="18" rx="3" fill="rgba(255,107,44,0.18)" stroke="#ff6b2c" stroke-width="1.6"/>' +
      '<rect class="dg-hot" x="206" y="112" width="18" height="8" rx="2"/>' +
      waves([212, 228, 244], 100) +
      '<path class="dg-hot-line" d="M215 124 L215 140 L204 144" stroke-dasharray="3 3"/>' +
      label(250, 110, "BUNK HEATER", "under bunk · 2 kW"),
    coolant:
      '<rect x="44" y="98" width="58" height="26" rx="3" fill="rgba(255,107,44,0.10)" stroke="#ff8a52" stroke-width="1.2" stroke-dasharray="3 3"/>' +
      '<text class="dg-sub" x="52" y="115">ENGINE</text>' +
      '<rect class="dg-hot" x="100" y="138" width="36" height="14" rx="3"/>' +
      '<path class="dg-hot-line" d="M104 138 C104 128 96 128 92 124"/>' +
      '<path class="dg-hot-line" d="M132 138 C132 110 140 96 150 90"/>' +
      waves([136, 154, 172], 80) +
      label(136, 145, "COOLANT HEATER", "on frame · 5 kW"),
    air:
      '<rect x="158" y="100" width="28" height="22" rx="3" fill="rgba(255,107,44,0.18)" stroke="#ff6b2c" stroke-width="1.6"/>' +
      '<rect class="dg-hot" x="163" y="106" width="18" height="10" rx="2"/>' +
      waves([160, 176], 96) +
      '<path class="dg-hot-line" d="M172 122 L172 134 L178 134" stroke-dasharray="3 3"/>' +
      label(186, 108, "DIESEL AIR HEATER", "in cab · 5–8 kW")
  };
  $$(".diagram").forEach(function (el) {
    var z = el.getAttribute("data-zone");
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 440 180");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = truckBase + (zones[z] || "");
    el.appendChild(svg);
  });

  /* ── Cold check ── */
  var range = $("#tRange"), tNum = $("#tNum"), tF = $("#tF"), recTemp = $("#recTemp");
  var recList = $("#recList"), recNote = $("#recNote"), recCta = $("#recCta");
  var fmt = function (n) { return (n < 0 ? "−" : "") + Math.abs(n); };
  var HEATERS = {
    sleep: { id: "bunk", name: "Bunk Diesel Heater", why: function (t) { return t <= -30 ? "4–5 kW unit for the coldest nights. Engine off all break." : "2 kW keeps the sleeper at your set temperature, engine off."; } },
    start: { id: "coolant", name: "Coolant Heater", why: function (t) { return t <= -25 ? "Set the timer. Engine starts easily and the windshield is clear." : "Easier starts and a warm cab without a plug-in."; } },
    cab: { id: "diesel-air", name: "Diesel Air Heater", why: function (t) { return t <= -30 ? "8 kW for big or drafty spaces at this temperature." : "5 kW heats a day cab or cargo space fast."; } },
    port: { id: "portable", name: "Portable Diesel Heater", why: function () { return "No drilling. Its own tank. Move it wherever you need heat."; } }
  };
  var comboLabel = "";

  var update = function () {
    if (!range) return;
    var t = parseInt(range.value, 10);
    tNum.textContent = fmt(t);
    tF.textContent = "(" + fmt(Math.round(t * 9 / 5 + 32)) + "°F)";
    recTemp.textContent = fmt(t) + "°C";
    $$("#ladder li").forEach(function (li) { li.classList.toggle("hit", t <= parseInt(li.getAttribute("data-at"), 10)); });
    $$(".route").forEach(function (b) { b.setAttribute("aria-pressed", String(parseInt(b.getAttribute("data-t"), 10) === t)); });

    var picks = $$(".park input:checked").map(function (i) { return i.value; });
    recList.innerHTML = "";
    var names = [];
    picks.forEach(function (k) {
      var h = HEATERS[k]; names.push(h.name);
      var li = document.createElement("li");
      li.innerHTML = '<a href="#' + h.id + '">' + h.name + "</a><small>" + h.why(t) + "</small>";
      recList.appendChild(li);
    });
    if (!picks.length) {
      recList.innerHTML = '<li><small>Pick how you park and we’ll match a heater.</small></li>';
    }
    var note = "";
    if (picks.indexOf("sleep") > -1 && picks.indexOf("start") < 0 && t <= -25) note = "At " + fmt(t) + "°C most drivers also add a coolant heater for the morning start.";
    else if (picks.indexOf("start") > -1 && t > -10) note = "Above −10°C a coolant heater is optional. It pays off on the days you can't plug in.";
    else if (picks.length) note = "We'll confirm output and voltage for your truck before you buy.";
    recNote.textContent = note;
    comboLabel = names.join(" + ");
    if (recCta && typeof smsHref === "function") {
      recCta.href = smsHref("Hi AutoCoolParts, I used the cold check on your site.\nColdest temp on my route: " + fmt(t) + "°C" +
        (comboLabel ? "\nLooking at: " + comboLabel : "") + "\nMy truck: ");
    }
  };
  if (range) {
    range.addEventListener("input", update);
    $$(".route").forEach(function (b) { b.addEventListener("click", function () { range.value = b.getAttribute("data-t"); update(); }); });
    $$(".park input").forEach(function (i) { i.addEventListener("change", update); });
    update();
  }


  /* ── Photo viewers ── */
  $$(".pgal").forEach(function (g) {
    var main = $(".pgal-main", g), btns = $$(".pgal-thumbs button", g);
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        main.src = b.getAttribute("data-src"); main.alt = b.getAttribute("data-alt") || "";
        btns.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      });
    });
  });

  /* ── Lineup tabs: highlight current heater ── */
  var tabs = $$(".lineup-tabs a");
  if ("IntersectionObserver" in window && tabs.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) tabs.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$(".heater").forEach(function (h) { io.observe(h); });
  }

  /* ── Text message links ── */
  var smsHref = function (body) { return "sms:" + PHONE + (body ? "?&body=" + encodeURIComponent(body) : ""); };
  $$("a.sms").forEach(function (a) { a.href = smsHref(a.getAttribute("data-body") || ""); });
  update();
})();
