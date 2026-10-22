(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- pixel sprites (decorative) ---------- */
  var SPRITES = {
    pad: {
      p: { h: "#a08bff", a: "#7b5cff", w: "#f3f0ff", r: "#ff4fb0", y: "#ffd23f", g: "#5dff8f", c: "#3ef2ff", k: "#1d1655" },
      r: [
        "...hhhhhhhhhh...",
        ".aaaaaaaaaaaaaa.",
        "aaawaaaaaaaraaaa",
        "aawwwaaaaayagaaa",
        "aaawaaaaaaacaaaa",
        "aaaaaakaakaaaaaa",
        "aaaaaa....aaaaaa",
        ".aaaa......aaaa.",
        "..aa........aa.."
      ]
    },
    python: {
      p: { a: "#4b8bff", b: "#ffd23f", w: "#f3f0ff" },
      r: [
        "...aaaaa....",
        "..aawaaaa...",
        "..aaaaaaa...",
        "......aaa...",
        ".aaaaaaaa.b.",
        "aaaaaaaa.bbb",
        "aaa.bbbbbbbb",
        ".a.bbbbbbbb.",
        "...bbb......",
        "...bbbbbbb..",
        "...bbbbwbb..",
        "....bbbbb..."
      ]
    },
    go: {
      p: { a: "#6ad7e5", w: "#f3f0ff", k: "#0a0720", n: "#e8b67a" },
      r: [
        "..a......a..",
        ".aaaaaaaaaa.",
        "aawwwaawwwaa",
        "aawkwaawkwaa",
        "aawwwaawwwaa",
        "aaaaannaaaaa",
        "aaaaawwaaaaa",
        "aaaaawwaaaaa",
        "aaaaaaaaaaaa",
        ".aaaaaaaaaa.",
        ".aaaaaaaaaa.",
        "..aa....aa.."
      ]
    },
    cloud: {
      p: { a: "#e4f0ff", b: "#8fbaff" },
      r: [
        "............",
        "............",
        "......aaa...",
        "..aa.aaaaa..",
        ".aaaaaaaaaa.",
        ".aaaaaaaaaa.",
        "aaaaaaaaaaaa",
        "aaaaaaaaaaaa",
        "bbbbbbbbbbbb",
        ".bbbbbbbbbb.",
        "............",
        "............"
      ]
    },
    devops: {
      p: { a: "#ff4fb0", b: "#3ef2ff" },
      r: [
        "............",
        "............",
        "............",
        ".aaa....bbb.",
        "a...a..b...b",
        "a....ab....b",
        "a....ba....b",
        "a...a..b...b",
        ".aaa....bbb.",
        "............",
        "............",
        "............"
      ]
    },
    platform: {
      p: { a: "#ffd23f", b: "#ff8a3d", c: "#ff4fb0" },
      r: [
        ".....aa.....",
        "...aaaaaa...",
        ".aaaaaaaaaa.",
        "...aaaaaa...",
        ".b...aa...b.",
        ".bbb....bbb.",
        "...bbbbbb...",
        ".c...bb...c.",
        ".ccc....ccc.",
        "...cccccc...",
        ".....cc.....",
        "............"
      ]
    },
    ai: {
      p: { a: "#f3f0ff", b: "#3ef2ff", c: "#ff4fb0" },
      r: [
        "............",
        "..c.........",
        ".ccc..a.....",
        "..c...a.....",
        ".....aaa....",
        "....aaaaa...",
        "..aaaaaaaaa.",
        "....aaaaa...",
        ".....aaa..b.",
        "......a..bbb",
        "......a...b.",
        "............"
      ]
    },
    terminal: {
      p: { a: "#c6c0f2", k: "#0a0720", g: "#5dff8f", r: "#ff4fb0", y: "#ffd23f" },
      r: [
        "............",
        "aaaaaaaaaaaa",
        "arayagaaaaaa",
        "aaaaaaaaaaaa",
        "akkkkkkkkkka",
        "akgkkkkkkkka",
        "akkgkkkkkkka",
        "akgkkkkkkkka",
        "akkkkggggkka",
        "akkkkkkkkkka",
        "aaaaaaaaaaaa",
        "............"
      ]
    },
    gear: {
      p: { a: "#9feaff" },
      r: [
        ".....aa.....",
        "..a..aa..a..",
        ".aaaaaaaaaa.",
        "..aaaaaaaa..",
        "..aaa..aaa..",
        "aaaa....aaaa",
        "aaaa....aaaa",
        "..aaa..aaa..",
        "..aaaaaaaa..",
        ".aaaaaaaaaa.",
        "..a..aa..a..",
        ".....aa....."
      ]
    },
    cursor: {
      p: { a: "#24105a", w: "#ffd23f" },
      r: [
        "..aaaaa..",
        "..awwwa..",
        "..awwwa..",
        "aaawwwaaa",
        "awwwwwwwa",
        ".awwwwwa.",
        "..awwwa..",
        "...awa...",
        "....a...."
      ]
    }
  };

  function pixelSVG(rows, pal) {
    var w = 0;
    rows.forEach(function (r) { w = Math.max(w, r.length); });
    var out = "";
    rows.forEach(function (row, y) {
      var x = 0;
      while (x < row.length) {
        var c = row[x];
        if (!pal[c]) { x++; continue; }
        var e = x + 1;
        while (e < row.length && row[e] === c) e++;
        out += '<rect x="' + x + '" y="' + y + '" width="' + (e - x) + '" height="1" fill="' + pal[c] + '"/>';
        x = e;
      }
    });
    return '<svg viewBox="0 0 ' + w + " " + rows.length + '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' + out + "</svg>";
  }

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  try {
    /* ---------- title: split into droppable letters ---------- */
    var h1 = $(".title");
    var label = h1.textContent.replace(/\s+/g, " ").trim();
    var idx = 0;
    $$(".title-line", h1).forEach(function (line) {
      var text = line.textContent.trim();
      line.textContent = "";
      line.setAttribute("aria-hidden", "true");
      Array.prototype.forEach.call(text, function (ch) {
        var s = document.createElement("span");
        s.className = "ch";
        s.textContent = ch;
        s.style.setProperty("--i", idx++);
        s.addEventListener("pointerenter", function () {
          if (reduce || !s.animate) return;
          s.animate(
            [{ translate: "0 0" }, { translate: "0 -0.16em" }, { translate: "0 0" }],
            { duration: 320, easing: "steps(4, end)" }
          );
        });
        line.appendChild(s);
      });
    });
    var sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = label;
    h1.insertBefore(sr, h1.firstChild);
    h1.classList.add("split");

    /* ---------- sprites ---------- */
    $$("[data-sprite]").forEach(function (el) {
      var s = SPRITES[el.getAttribute("data-sprite")];
      if (s) el.innerHTML = pixelSVG(s.r, s.p);
    });

    /* ---------- starfield ---------- */
    var cvs = $("#stars");
    var ctx = cvs.getContext("2d");
    var S = 3;
    var W = 0, H = 0, lastW = 0;
    var stars = [];
    var COLORS = ["#ffffff", "#c6c0f2", "#3ef2ff", "#ff4fb0", "#ffd23f"];
    var SPEED = [0, 0.004, 0.009, 0.018];
    var PAR = [0, 0.04, 0.1, 0.22];
    var warp = 1, warpTarget = 1, last = 0, nextShoot = 2600, shoot = null;

    function seedStars() {
      W = Math.ceil(window.innerWidth / S);
      H = Math.ceil(window.innerHeight / S);
      cvs.width = W;
      cvs.height = H;
      lastW = window.innerWidth;
      var n = Math.min(650, Math.round((W * H) / 110));
      stars = [];
      for (var i = 0; i < n; i++) {
        var r = Math.random();
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: r < 0.12 ? 3 : r < 0.45 ? 2 : 1,
          off: 0,
          c: Math.random() < 0.8 ? 0 : 1 + Math.floor(Math.random() * 4),
          tw: Math.random() * 6.283
        });
      }
    }

    function drawStars(t, dt) {
      ctx.clearRect(0, 0, W, H);
      var sy = window.scrollY / S;
      warp += (warpTarget - warp) * 0.06;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.off += dt * SPEED[s.z] * warp;
        var y = (s.y + s.off - sy * PAR[s.z]) % H;
        if (y < 0) y += H;
        var x = s.x | 0, yy = y | 0;
        var a = s.z === 3 ? (Math.sin(t * 0.004 + s.tw) > 0.2 ? 1 : 0.45) : s.z === 2 ? 0.75 : 0.45;
        ctx.fillStyle = COLORS[s.c];
        if (warp > 1.5) {
          ctx.globalAlpha = a;
          ctx.fillRect(x, yy, 1, Math.min(12, 1 + warp * s.z * 0.6) | 0);
          continue;
        }
        if (s.z === 3 && a === 1 && s.c !== 0) {
          ctx.globalAlpha = 0.35;
          ctx.fillRect(x - 1, yy, 3, 1);
          ctx.fillRect(x, yy - 1, 1, 3);
        }
        ctx.globalAlpha = a;
        ctx.fillRect(x, yy, 1, 1);
      }
      if (!reduce) {
        nextShoot -= dt;
        if (!shoot && nextShoot <= 0) {
          shoot = { x: W * 0.25 + Math.random() * W * 0.75, y: Math.random() * H * 0.45, life: 0 };
          nextShoot = 4000 + Math.random() * 5000;
        }
        if (shoot) {
          shoot.life += dt;
          var p = shoot.life / 900;
          if (p >= 1) shoot = null;
          else {
            for (var k = 0; k < 8; k++) {
              ctx.globalAlpha = (1 - k / 8) * (1 - p);
              ctx.fillStyle = k < 2 ? "#ffffff" : "#3ef2ff";
              ctx.fillRect((shoot.x - p * 70 + k) | 0, (shoot.y + p * 35 - k * 0.5) | 0, 1, 1);
            }
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      var dt = Math.min(50, now - (last || now));
      last = now;
      drawStars(now, dt);
      window.requestAnimationFrame(loop);
    }

    seedStars();
    if (reduce) drawStars(0, 0);
    else window.requestAnimationFrame(loop);

    /* ---------- pixel planet ---------- */
    var planet = $(".planet");
    (function drawPlanet(c) {
      var N = 72;
      c.width = N;
      c.height = N;
      var g = c.getContext("2d");
      var cx = 36, cy = 37, r = 21;
      var BANDS = ["#ffe58a", "#ffd23f", "#ff8a3d", "#ff4fb0", "#d13c9e", "#ff8a3d", "#ff4fb0", "#7b5cff"];
      var DARK = "#2a1660";
      var ang = -0.38, ca = Math.cos(ang), sa = Math.sin(ang);
      function ring(front) {
        for (var y = 0; y < N; y++) {
          for (var x = 0; x < N; x++) {
            var dx = x - cx + 0.5, dy = y - cy + 0.5;
            var u = dx * ca + dy * sa, v = -dx * sa + dy * ca;
            var e = (u / 33) * (u / 33) + (v / 7.5) * (v / 7.5);
            if (e < 0.62 || e > 1) continue;
            if (v > 0 !== front) continue;
            if (e > 0.78 && e < 0.84) continue;
            g.fillStyle = e < 0.78 ? "#3ef2ff" : (x + y) % 2 ? "#a7f9ff" : "#3ef2ff";
            if (!front && (x + y) % 2) g.fillStyle = "#1b8fa8";
            g.fillRect(x, y, 1, 1);
          }
        }
      }
      ring(false);
      for (var y = 0; y < N; y++) {
        for (var x = 0; x < N; x++) {
          var dx = x - cx + 0.5, dy = y - cy + 0.5;
          if (dx * dx + dy * dy > r * r) continue;
          var nx = dx / r, ny = dy / r;
          var nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
          var l = -nx * 0.55 - ny * 0.5 + nz * 0.67;
          var bi = Math.floor((((dy + Math.sin(dx * 0.32) * 1.4) / r + 1) / 2) * BANDS.length);
          var col = BANDS[Math.max(0, Math.min(BANDS.length - 1, bi))];
          if (l < 0.05) col = DARK;
          else if (l < 0.3 && (x + y) % 2) col = DARK;
          if (l > 0.93 && (x + y) % 2 === 0) col = "#fff7d6";
          g.fillStyle = col;
          g.fillRect(x, y, 1, 1);
        }
      }
      ring(true);
    })(planet);

    /* ---------- pixel skyline ---------- */
    var skyBox = $(".sky"), far = $(".sky-far"), near = $(".sky-near");
    var skyCtx = null, windows = [], beacons = [], beaconOn = true;

    function rng(seed) {
      return function () {
        seed = (seed + 0x6d2b79f5) | 0;
        var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function drawSky() {
      var cw = skyBox.clientWidth, ch = skyBox.clientHeight;
      if (!cw || !ch) return;
      var SH = 60, scale = ch / SH, SW = Math.ceil(cw / scale);
      far.width = near.width = SW;
      far.height = near.height = SH;
      var rnd = rng(1979);

      var f = far.getContext("2d");
      var glow = f.createLinearGradient(0, SH - 34, 0, SH);
      glow.addColorStop(0, "rgba(255,79,176,0)");
      glow.addColorStop(1, "rgba(255,79,176,0.45)");
      f.fillStyle = glow;
      f.fillRect(0, SH - 34, SW, 34);
      var h = 24;
      for (var x = 0; x < SW; x++) {
        h += (rnd() - 0.5) * 3.2;
        if (rnd() < 0.04) h += 6 * (rnd() - 0.4);
        h = Math.max(12, Math.min(40, h));
        var top = Math.round(SH - h);
        f.fillStyle = "#24196a";
        f.fillRect(x, top, 1, SH - top);
        f.fillStyle = "#4a37b0";
        f.fillRect(x, top, 1, 1);
      }

      var n = near.getContext("2d");
      windows = [];
      beacons = [];
      var bx = 0;
      while (bx < SW) {
        var bw = 5 + Math.floor(rnd() * 10);
        var tall = rnd() < 0.18;
        var bh = 8 + Math.floor(rnd() * (tall ? 34 : 20));
        var bt = SH - bh;
        n.fillStyle = "#0d0930";
        n.fillRect(bx, bt, bw, bh);
        n.fillStyle = "#1e1658";
        n.fillRect(bx, bt, 1, bh);
        if (rnd() < 0.35) {
          var ax = bx + (bw >> 1);
          n.fillRect(ax, bt - 4, 1, 4);
          beacons.push({ x: ax, y: bt - 5 });
        }
        for (var wy = bt + 2; wy < SH - 3; wy += 3) {
          for (var wx = bx + 2; wx < bx + bw - 1; wx += 2) {
            if (rnd() < 0.2) {
              var w = { x: wx, y: wy, c: rnd() < 0.72 ? "#f2c14e" : "#58e6ff", on: true };
              windows.push(w);
              n.fillStyle = w.c;
              n.fillRect(wx, wy, 1, 1);
            }
          }
        }
        bx += bw + (rnd() < 0.25 ? 1 + Math.floor(rnd() * 2) : 0);
      }
      n.fillStyle = "#0a0720";
      n.fillRect(0, SH - 2, SW, 2);
      n.fillStyle = "#ff4fb0";
      beacons.forEach(function (b) { n.fillRect(b.x, b.y, 1, 1); });
      skyCtx = n;
    }

    drawSky();

    if (!reduce) {
      window.setInterval(function () {
        if (!skyCtx || document.hidden) return;
        for (var k = 0; k < 3 && windows.length; k++) {
          var w = windows[(Math.random() * windows.length) | 0];
          w.on = !w.on;
          skyCtx.fillStyle = w.on ? w.c : "#0d0930";
          skyCtx.fillRect(w.x, w.y, 1, 1);
        }
        beaconOn = !beaconOn;
        skyCtx.fillStyle = beaconOn ? "#ff4fb0" : "#3a1446";
        beacons.forEach(function (b) { skyCtx.fillRect(b.x, b.y, 1, 1); });
      }, 650);

      var hero = $(".hero"), ticking = false;
      window.addEventListener(
        "scroll",
        function () {
          if (ticking) return;
          ticking = true;
          window.requestAnimationFrame(function () {
            ticking = false;
            var y = window.scrollY;
            if (y > hero.offsetHeight) return;
            far.style.translate = "0 " + (y * 0.3).toFixed(1) + "px";
            near.style.translate = "0 " + (y * 0.12).toFixed(1) + "px";
            planet.style.translate = "0 " + (y * 0.45).toFixed(1) + "px";
          });
        },
        { passive: true }
      );
    }

    /* ---------- scroll reveals ---------- */
    var revealEls = $$("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    }

    /* ---------- About: dialogue typewriter ---------- */
    var dialog = $(".dialog");
    if (reduce || !("IntersectionObserver" in window)) {
      dialog.classList.add("typed");
    } else {
      var parts = $$("p", dialog).map(function (p) {
        var text = p.textContent.replace(/\s+/g, " ").trim();
        p.textContent = "";
        var full = document.createElement("span");
        full.className = "sr-only";
        full.textContent = text;
        var vis = document.createElement("span");
        vis.setAttribute("aria-hidden", "true");
        var on = document.createElement("span");
        var off = document.createElement("span");
        off.className = "tw-off";
        off.textContent = text;
        vis.appendChild(on);
        vis.appendChild(off);
        p.appendChild(full);
        p.appendChild(vis);
        return { text: text, on: on, off: off };
      });
      var total = parts.reduce(function (s, d) { return s + d.text.length; }, 0);
      var shown = 0, tLast = 0, typing = false, done = false;
      var finish = function () {
        done = true;
        parts.forEach(function (d) { d.on.textContent = d.text; d.off.textContent = ""; });
        dialog.classList.add("typed");
      };
      var tick = function (now) {
        if (done) return;
        if (!tLast) tLast = now;
        shown = Math.min(total, shown + (now - tLast) * 0.14);
        tLast = now;
        var rem = Math.floor(shown);
        parts.forEach(function (d) {
          var k = Math.min(d.text.length, rem);
          d.on.textContent = d.text.slice(0, k);
          d.off.textContent = d.text.slice(k);
          rem -= k;
        });
        if (shown >= total) finish();
        else window.requestAnimationFrame(tick);
      };
      dialog.addEventListener("click", function () { if (!done) finish(); });
      var dio = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting && !typing) {
            typing = true;
            dio.disconnect();
            window.setTimeout(function () { window.requestAnimationFrame(tick); }, 350);
          }
        },
        { threshold: 0.35 }
      );
      dio.observe(dialog);
    }

    /* ---------- Projects: level select cursor ---------- */
    var levelsEl = $(".levels");
    var levels = $$(".level", levelsEl);
    var cursor = document.createElement("div");
    cursor.className = "level-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = pixelSVG(SPRITES.cursor.r, SPRITES.cursor.p);
    levelsEl.appendChild(cursor);
    var sel = -1, projectsVisible = false, attracted = false;

    function placeCursor() {
      if (sel < 0) return;
      var l = levels[sel];
      cursor.style.translate = l.offsetLeft + 20 + "px " + (l.offsetTop - 40) + "px";
      if (!cursor.classList.contains("on")) {
        cursor.classList.add("on");
        window.requestAnimationFrame(function () { cursor.classList.add("anim"); });
      }
    }

    function select(i, focus) {
      sel = i;
      levels.forEach(function (l, k) { l.classList.toggle("is-selected", k === i); });
      placeCursor();
      if (focus) levels[i].querySelector(".cart-link").focus();
    }

    function columns() {
      var top0 = levels[0].offsetTop, n = 0;
      levels.forEach(function (l) { if (l.offsetTop === top0) n++; });
      return Math.max(1, n);
    }

    levels.forEach(function (l, i) {
      l.addEventListener("pointerenter", function () { select(i, false); });
    });
    levelsEl.addEventListener("focusin", function (e) {
      var l = e.target.closest(".level");
      if (l) select(levels.indexOf(l), false);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          projectsVisible = entries[0].isIntersecting;
          if (projectsVisible && !attracted) {
            attracted = true;
            window.setTimeout(function () { if (sel < 0) select(0, false); }, 900);
          }
        },
        { rootMargin: "-35% 0px -35% 0px" }
      ).observe($("#projects"));
    }

    /* ---------- toast + turbo (konami) ---------- */
    var toastEl = $(".toast"), toastT, turboT;
    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(toastT);
      toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
    }
    var KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    var kpos = 0;
    function konami(key) {
      var k = key && key.length === 1 ? key.toLowerCase() : key;
      if (k === KONAMI[kpos]) {
        kpos++;
        if (kpos === KONAMI.length) {
          kpos = 0;
          toast("★ Turbo mode ★");
          root.classList.add("turbo");
          if (!reduce) warpTarget = 7;
          clearTimeout(turboT);
          turboT = setTimeout(function () {
            root.classList.remove("turbo");
            warpTarget = 1;
          }, 5000);
        }
      } else {
        kpos = k === KONAMI[0] ? 1 : 0;
      }
    }

    /* ---------- keyboard ---------- */
    var pressStart = $(".press-start");
    function startGame() {
      pressStart.classList.remove("flash");
      void pressStart.offsetWidth;
      pressStart.classList.add("flash");
      $("#about").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }
    pressStart.addEventListener("click", function () {
      pressStart.classList.remove("flash");
      void pressStart.offsetWidth;
      pressStart.classList.add("flash");
    });

    var ARROWS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    document.addEventListener("keydown", function (e) {
      konami(e.key);
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      var a = document.activeElement;
      var onBody = !a || a === document.body || a === root;
      var inGrid = levelsEl.contains(a);

      if (ARROWS.indexOf(e.key) !== -1) {
        var horizontal = e.key === "ArrowLeft" || e.key === "ArrowRight";
        if (!(inGrid || (onBody && projectsVisible && horizontal))) return;
        e.preventDefault();
        if (!inGrid) {
          select(sel < 0 ? 0 : sel, true);
          return;
        }
        var cols = columns(), n = sel;
        if (e.key === "ArrowLeft") n -= 1;
        else if (e.key === "ArrowRight") n += 1;
        else if (e.key === "ArrowUp") n -= cols;
        else n += cols;
        if (n >= 0 && n < levels.length) select(n, true);
        return;
      }

      if (e.key === "Enter" && onBody) {
        if (projectsVisible && sel >= 0) {
          e.preventDefault();
          levels[sel].querySelector(".cart-link").click();
        } else if (window.scrollY < window.innerHeight * 0.4) {
          e.preventDefault();
          startGame();
        }
      }
    });

    /* ---------- resize ---------- */
    window.addEventListener(
      "resize",
      debounce(function () {
        if (window.innerWidth !== lastW) seedStars();
        else {
          H = Math.ceil(window.innerHeight / S);
          cvs.height = H;
        }
        if (reduce) drawStars(0, 0);
        drawSky();
        placeCursor();
      }, 150)
    );

    /* ---------- power-on overlay cleanup ---------- */
    var power = $(".power");
    if (power) {
      var kill = function () { if (power.parentNode) power.parentNode.removeChild(power); };
      if (reduce) kill();
      else {
        power.addEventListener("animationend", function (e) { if (e.target === power) kill(); });
        setTimeout(kill, 2000);
      }
    }

    window.__arcadeReady = true;
  } catch (err) {
    root.classList.remove("js");
    if (window.console) console.error(err);
  }
})();
