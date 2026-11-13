const collage = document.getElementById("collage");
let filter = "all";

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Wikipedia-style "No image available" picture (uses theme colours, so it works in dark mode)
const NO_IMAGE = `<svg class="default-img" viewBox="0 0 240 170" role="img" aria-label="No image available">
  <rect x="80" y="30" width="80" height="62" rx="4" fill="none" stroke="currentColor" stroke-width="5"/>
  <circle cx="102" cy="50" r="7" fill="currentColor"/>
  <path d="M86 86 L110 62 L124 76 L134 66 L154 86 Z" fill="currentColor"/>
  <text x="120" y="122" text-anchor="middle" font-size="15" fill="currentColor"
        font-family="-apple-system, Segoe UI, Roboto, Lato, Helvetica, Arial, sans-serif">No image available</text>
</svg>`;

// "[citation needed]" -> little superscript like the real thing
const cite = (s) =>
  s.replace(/\[citation needed\]/g, '<sup class="cn">[<a href="#">citation needed</a>]</sup>');

function build(e) {
  const box = document.createElement("aside");
  box.className = "infobox";
  box.dataset.tags = (e.tags || []).join(" ");
  box.dataset.title = e.title;
  box.dataset.p = e.priority ? "1" : "0";

  // random "personality" per box: which width it prefers (priority boxes lean bigger)
  const r = Math.random();
  box.dataset.r = e.priority ? 0.5 + r / 2 : r;
  const imgH = 120 + Math.floor(Math.random() * 140);

  let html = `<h2 class="title${e.italic ? " italic" : ""}">${e.title}</h2>`;

  // caption, plus a little [source] link if the picture has one
  const src = e.source
    ? ` <sup class="ref">[<a href="${e.source}" target="_blank" rel="noopener">source</a>]</sup>`
    : "";
  const cap = e.caption || src ? `<figcaption>${cite(e.caption || "")}${src}</figcaption>` : "";

  if (e.video) {
    // YouTube embed: video: { id, start }  (start in seconds, optional)
    const start = e.video.start ? `?start=${e.video.start}` : "";
    html += `<figure><div class="video"><iframe src="https://www.youtube.com/embed/${e.video.id}${start}"
      title="${e.title}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>${cap}</figure>`;
  } else if (e.image === "default") {
    html += `<figure>${NO_IMAGE}${cap}</figure>`;
  } else if (e.image) {
    const cls = e.logo ? ' class="logo"' : e.cover ? ' class="cover"' : "";
    const bg = e.imageBg ? ` style="background:${e.imageBg}"` : "";
    html += `<figure><img src="${e.image}" alt="${e.title}"${cls}${bg}>${cap}</figure>`;
  } else if (cap) {
    html += `<figure>${cap}</figure>`;
  }

  html += "<table>";
  for (const [k, v] of Object.entries(e.facts || {})) {
    html += `<tr><th>${k}</th><td>${cite(v)}</td></tr>`;
  }
  html += "</table>";

  // optional OpenStreetMap pin: map: { lat, lon }
  if (e.map) {
    const { lat, lon } = e.map;
    const dLon = 0.004, dLat = 0.002;
    const bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].join(",");
    html += `<div class="map">
      <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}"
              loading="lazy" title="Map of ${e.title}"></iframe>
      <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}" target="_blank" rel="noopener">View larger map</a>
    </div>`;
  }
  box.innerHTML = html;

  // broken / missing picture -> grey placeholder of the same height
  const img = box.querySelector("img");
  if (img) {
    img.onerror = () => {
      const ph = document.createElement("div");
      ph.className = "noimg";
      ph.style.height = `${imgH}px`;
      ph.textContent = "Image needed";
      img.replaceWith(ph);
      scheduleLayout();
    };
    img.onload = scheduleLayout;
  }
  return box;
}

// ---------- layout: "fill the lowest gap first" ----------
// The page is 60 units wide. Boxes are 1/3, 1/4 or 1/5 of it (wider on small screens, full width on phones).
// The skyline is the bottom edge of everything placed so far. Each step takes its lowest dip and drops a box
// into it (it may also reach over neighbours that are only slightly higher, so columns keep shifting),
// picking, from the next few boxes, widths and positions, the one that leaves the least whitespace.
const GAP = 16;
const LOOKAHEAD = 4; // how many upcoming boxes may jump the queue to fill a gap
const SPAN_TOL = 60;  // px: a box may reach over neighbours up to this much higher (a small gap under it)

function widthsFor(C) {
  if (C < 560) return [60];       // phone: one column
  if (C < 900) return [20, 30];   // tablet: thirds / halves
  if (C < 1200) return [15, 20, 30]; // small desktop: 1/4, 1/3, 1/2
  return [12, 15, 20];            // desktop: 1/5, 1/4, 1/3
}

// seeded random numbers: the same seed always gives the same arrangement, so a late-loading image,
// a resize or a filter click nudges boxes instead of reshuffling the whole page. New seed per render().
let layoutSeed = 1;
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function layout() {
  const random = rng(layoutSeed);
  const queue = visibleBoxes();
  const C = collage.clientWidth;
  const unit = (C + GAP) / 60;  // each box owns its width + one gap
  const widths = widthsFor(C);
  const minW = widths[0];

  // natural height of a box at a given width (cached; offsetHeight ignores hover transforms)
  const cache = new Map();
  const heightAt = (b, w) => {
    let m = cache.get(b);
    if (!m) cache.set(b, (m = {}));
    if (m[w] == null) {
      b.style.height = "";
      b.style.width = `${w * unit - GAP}px`;
      m[w] = b.offsetHeight;
    }
    return m[w];
  };

  // skyline segments, x and w in units, y in px; neighbours at the same height are merged
  let sky = [{ x: 0, w: 60, y: 0 }];
  const merge = () => {
    sky = sky.reduce((out, s) => {
      const p = out[out.length - 1];
      if (p && Math.abs(p.y - s.y) < 1) p.w += s.w;
      else out.push({ ...s });
      return out;
    }, []);
  };

  // segments under [a, a+w)
  const under = (a, w) => sky.filter((s) => s.x < a + w && s.x + s.w > a);
  const heightLeftOf = (x) => { const s = sky.find((s) => s.x < x && s.x + s.w >= x); return s ? s.y : null; };
  const heightRightOf = (x) => { const s = sky.find((s) => s.x <= x && s.x + s.w > x); return s ? s.y : null; };
  const setSky = (a, w, y) => {
    const segs = under(a, w), first = segs[0], last = segs[segs.length - 1];
    const parts = [];
    if (first.x < a) parts.push({ x: first.x, w: a - first.x, y: first.y });
    parts.push({ x: a, w, y });
    if (last.x + last.w > a + w) parts.push({ x: a + w, w: last.x + last.w - (a + w), y: last.y });
    sky.splice(sky.indexOf(first), segs.length, ...parts);
    merge();
  };

  while (queue.length) {
    // the lowest dip (leftmost if tied)
    let i = 0;
    sky.forEach((s, j) => { if (s.y < sky[i].y - 0.5) i = j; });
    const seg = sky[i];

    // a box may also reach over neighbours that are only a little higher (this is what stops the page
    // from settling into fixed columns); grow the region outwards while that holds
    let lo = i, hi = i;
    while (lo > 0 && sky[lo - 1].y - seg.y <= SPAN_TOL) lo--;
    while (hi < sky.length - 1 && sky[hi + 1].y - seg.y <= SPAN_TOL) hi++;
    const rx = sky[lo].x, rw = sky[hi].x + sky[hi].w - rx;

    // too narrow for any box: fill it up to its lower neighbour and look again
    if (rw < minW) {
      const l = sky[i - 1], r = sky[i + 1];
      seg.y = Math.min(l ? l.y : Infinity, r ? r.y : Infinity);
      merge();
      continue;
    }

    let best = null;
    queue.slice(0, LOOKAHEAD).forEach((b, qi) => {
      const r = +b.dataset.r; // the box's random "personality": which width it likes
      widths.forEach((w, k) => {
        if (w > rw) return;
        // where in the region to try it: flush with the dip's edges or the region's edges
        const xs = new Set([seg.x, seg.x + seg.w - w, rx, rx + rw - w]);
        for (const x of xs) {
          if (x < rx || x + w > rx + rw || x >= seg.x + seg.w || x + w <= seg.x) continue; // must sit in the dip
          const segs = under(x, w);
          const top = Math.max(...segs.map((s) => s.y));
          const hole = segs.reduce((sum, s) => sum + (top - s.y) * (Math.min(x + w, s.x + s.w) - Math.max(x, s.x)), 0) / w;
          // leftover slivers of a covered segment that nothing could ever fill
          const lw = x - segs[0].x, last = segs[segs.length - 1], rwLeft = last.x + last.w - (x + w);
          const slivers = (lw > 0 && lw < minW ? 1 : 0) + (rwLeft > 0 && rwLeft < minW ? 1 : 0);
          const bottom = top + heightAt(b, w) + GAP;
          // how far the new bottom edge misses the neighbours it touches (lined-up edges = fewer dips later)
          const touching = [lw === 0 && heightLeftOf(x), rwLeft === 0 && heightRightOf(x + w)].filter((v) => typeof v === "number");
          const miss = touching.length ? Math.min(...touching.map((y) => Math.abs(bottom - y))) : 0;
          const score =
            hole * 1.5 +                                         // whitespace left under the box
            (top - seg.y) * 0.5 +                                // prefer filling low
            slivers * 120 +
            Math.min(miss, 200) * 0.5 +
            Math.abs(k - r * (widths.length - 1)) * 35 +         // personality
            qi * 40 +                                            // keep roughly to the original order
            random() * 40;                                       // a little variety
          if (!best || score < best.score) best = { b, x, w, top, bottom, score };
        }
      });
    });

    const { b, x, w, top, bottom } = best;
    queue.splice(queue.indexOf(b), 1);
    b.style.left = `${x * unit}px`;
    b.style.top = `${top}px`;
    b.style.width = `${w * unit - GAP}px`;
    setSky(x, w, bottom);
  }

  collage.style.height = `${Math.max(0, Math.max(...sky.map((s) => s.y)) - GAP)}px`;
}

// images that finish loading late change a box's height -> redo the layout (once per frame)
let pending = false;
function scheduleLayout() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => { pending = false; layout(); });
}

// wait (briefly) for pictures so boxes land in their final spots
function imagesReady(timeout = 2000) {
  const imgs = [...collage.querySelectorAll("img")].filter((img) => !img.complete);
  const all = Promise.all(imgs.map((img) => new Promise((res) => {
    img.addEventListener("load", res, { once: true });
    img.addEventListener("error", res, { once: true });
  })));
  return Promise.race([all, new Promise((res) => setTimeout(res, timeout))]);
}

async function render() {
  const pinned = shuffle(ENTRIES.filter((e) => e.priority));
  const rest = shuffle(ENTRIES.filter((e) => !e.priority));
  layoutSeed = Math.floor(Math.random() * 2 ** 32);
  collage.classList.remove("ready");
  collage.replaceChildren(...[...pinned, ...rest].map(build));
  applyFilter();
  await imagesReady();
  layout();
  collage.classList.add("ready");
}

function applyFilter() {
  collage.querySelectorAll(".infobox").forEach((b) => {
    b.classList.toggle("hidden", filter !== "all" && !b.dataset.tags.split(" ").includes(filter));
  });
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter && filter !== "all");
  });
  layout();
}

document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    const f = btn.dataset.filter;
    filter = filter === f ? "all" : f; // click again to clear
    applyFilter();
  });
});

// ---------- "Random article": suck everything into the middle, reshuffle, throw it back out ----------
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const rand = (a, b) => a + Math.random() * (b - a);
const visibleBoxes = () => [...collage.querySelectorAll(".infobox:not(.hidden)")];

// how far a box is from the centre of the screen
function toCenter(box) {
  const r = box.getBoundingClientRect();
  return [innerWidth / 2 - (r.left + r.width / 2), innerHeight / 2 - (r.top + r.height / 2)];
}

function gather() {
  return Promise.all(visibleBoxes().map((b) => {
    const [dx, dy] = toCenter(b);
    return b.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(.2)`, opacity: 0 },
      ],
      { duration: 300, easing: "cubic-bezier(.55, 0, .75, .35)", fill: "forwards" }
    ).finished;
  }));
}

function throwOut() {
  // ripple outward from the centre: nearest boxes land first, and the whole thing is over in < 1s
  const boxes = visibleBoxes().map((b) => {
    const [dx, dy] = toCenter(b);
    return { b, dx, dy, d: Math.hypot(dx, dy) };
  });
  const maxD = Math.max(1, ...boxes.map((x) => x.d));
  boxes.forEach(({ b, dx, dy, d }) => {
    b.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(.2)`, opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { transform: "none", opacity: 1 },
      ],
      { duration: rand(560, 680), delay: (d / maxD) * 260, easing: "cubic-bezier(.2, .8, .3, 1.02)", fill: "backwards" }
    );
  });
}

let busy = false;
document.getElementById("shuffle").addEventListener("click", async () => {
  if (busy) return;
  if (reduceMotion.matches) return render();
  busy = true;
  window.scrollTo({ top: 0 });
  await gather();
  await render();
  throwOut();
  busy = false;
});

// in-box links like <a data-goto="New York University"> jump to that box
collage.addEventListener("click", (ev) => {
  const a = ev.target.closest("a[data-goto], sup.cn a");
  if (!a) return;
  ev.preventDefault();
  if (!a.dataset.goto) return;
  filter = "all";
  applyFilter();
  const target = [...collage.children].find((b) => b.dataset.title === a.dataset.goto);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("flash");
    setTimeout(() => target.classList.remove("flash"), 1200);
  }
});

// light/dark toggle (remembered per browser; falls back to the OS setting)
const themeBtn = document.getElementById("theme");
const isDark = () =>
  document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
const setTheme = (mode) => {
  document.documentElement.dataset.theme = mode;
  themeBtn.textContent = mode === "dark" ? "Light" : "Dark";
};
try {
  const saved = localStorage.getItem("wiki-theme");
  if (saved) setTheme(saved);
} catch {}
themeBtn.textContent = isDark() ? "Light" : "Dark";
themeBtn.addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  setTheme(next);
  try { localStorage.setItem("wiki-theme", next); } catch {}
});

let t;
window.addEventListener("resize", () => {
  clearTimeout(t);
  t = setTimeout(layout, 100);
});

render().then(() => { if (!reduceMotion.matches) throwOut(); });
