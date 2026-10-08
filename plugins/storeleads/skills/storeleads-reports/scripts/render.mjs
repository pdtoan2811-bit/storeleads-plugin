#!/usr/bin/env node
// StoreLeads report renderer — a report document (JSON) → ONE self-contained HTML file (inline CSS + SVG, no network).
//   node render.mjs <report.json> [out.html]        (default out: ~/Downloads/storeleads-<slug>.html)
//   node render.mjs --blocks                         list every block type and its fields
// Zero dependencies (Node ≥ 18). The look is the approved StoreLeads report kit (references/blocks.md shows every block).
// Data rules live HERE so a report can't forget them: robust 12-month growth (3-month medians), ⚠ on series that double or
// halve in a month (crawl / attribution jumps), outlier months flagged in monthly bars, Vietnamese or English number format.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
let LOC = "vi", T0 = [2024, 10]; // locale + month 0 (Oct 2024)
const L = (vi, en) => (LOC === "vi" ? vi : en);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const loc = () => (LOC === "vi" ? "de-DE" : "en-US");
const nf = (n) => (n == null || Number.isNaN(n) ? "—" : Math.round(n).toLocaleString(loc()));
const df = (n, d = 1) => (n == null ? "—" : Number(n).toLocaleString(loc(), { maximumFractionDigits: d }));
const pf = (n, sign = false) => (n == null || Number.isNaN(n) ? "—" : n > 0 && n < 0.1 ? "<" + df(0.1) + "%" : `${sign && n > 0 ? "+" : ""}${df(n)}%`);
const usd = (n) => (n == null ? "—" : `$${df(n, 2)}`);
const FMT = { int: nf, num: (n) => df(n, 1), pct: (n) => pf(n), "pct+": (n) => pf(n, true), usd, x: (n) => `${df(n, 1)}×`, star: (n) => `${df(n, 1)}★`, bool: (n) => (n ? L("Có", "Yes") : L("Chưa", "No")), "int+": (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + nf(Math.abs(n)), raw: (n) => esc(n) };
/** A value: a string as given, or { n, fmt } formatted here (int | num | pct | pct+ | usd | x | star | int+). */
const val = (v, fmt = "int") => (v != null && typeof v === "object" && "n" in v ? (FMT[v.fmt ?? fmt] ?? nf)(v.n) : typeof v === "number" ? (FMT[fmt] ?? nf)(v) : esc(v ?? "—"));
const month = (m) => { const d = new Date(Date.UTC(T0[0], T0[1] - 1 + m, 1)); return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCFullYear()).slice(2)}`; };
const tone = (n) => (n == null ? "n" : n < 0 ? "dn" : "up");
const sum = (xs) => xs.reduce((t, x) => t + (x ?? 0), 0);

// ── data rules ────────────────────────────────────────────────────────────────────────────────────
const med3 = (v, m) => [v[m - 2], v[m - 1], v[m]].sort((a, b) => a - b)[1];
const swings = (v, m) => { const w = [v[m - 2], v[m - 1], v[m]]; return Math.max(...w) > 1.5 * Math.max(1, Math.min(...w)); };
/** Robust 12-month growth: median of the last 3 months vs the same 3 months a year before. warn = an end window swings. */
export function growth(v) {
  if (!Array.isArray(v) || v.length < 24) return { g: null, warn: false };
  const e = v.length - 1, a = med3(v, e - 12), b = med3(v, e);
  return a ? { g: Math.round((1000 * (b - a)) / a) / 10, warn: swings(v, e - 12) || swings(v, e) || shifted(v) } : { g: null, warn: false };
}
/** A jump that never came back: the level before the first jump month vs now differs by more than 1,5× → can't measure. */
function shifted(v) {
  const j = jumpMonths([v]).indexOf(true);
  if (j < 3) return false;
  const before = med3(v, j - 1), now = med3(v, v.length - 1);
  return before > 0 && (now / before > 1.5 || now / before < 1 / 1.5);
}
/** Months where any series doubles or halves (and is ≥ 200): crawl or attribution jumps, not customers. */
export const jumpMonths = (vs) => Array.from({ length: vs[0]?.length ?? 0 }, (_, m) => m > 0 && vs.some((v) => Math.max(v[m], v[m - 1]) >= 200 && (v[m] > 2 * v[m - 1] || v[m] < v[m - 1] / 2)));
const jumpy = (v) => Array.isArray(v) && jumpMonths([v]).some(Boolean);
const pill = (t, s) => `<span class="pill ${t}">${s}</span>`;
const growthPill = (r) => { const { g, warn } = r.series ? growth(r.series) : { g: r.growth ?? null, warn: !!r.warn }; return warn || r.warn ? pill("warn", L("⚠ chưa chắc", "⚠ unsure")) : pill(tone(g), pf(g, true)); };

// ── blocks ────────────────────────────────────────────────────────────────────────────────────────
const B = {};
const doc = { fields: {} };
const def = (name, fields, fn) => { B[name] = fn; doc.fields[name] = fields; };

def("lede", "text (markdown **bold**)", (b) => `<p class="lede">${md(b.text)}</p>`);
def("how", "text — the one-line 'how to read' under every visual", (b) => `<p class="how">${md(b.text)}</p>`);
def("ask", "text, n? — a numbered question that opens a section", (b) => `<h3 class="ask">${b.n ? `<span>${esc(b.n)}</span>` : ""}${md(b.text)}</h3>`);
def("verdict", "tone up|dn|warn|n, label, line, proof", (b) => `<div class="verdict ${b.tone}">${pill(b.tone, esc(b.label))}<div><b>${md(b.line)}</b><span>${md(b.proof)}</span></div></div>`);
def("kpis", "items: [{k, v (string or {n,fmt}), s}]", (b) => `<div class="kpis">${b.items.map((i) => `<div><div class="k">${esc(i.k)}</div><div class="v num">${val(i.v)}</div><div class="s">${md(i.s)}</div></div>`).join("")}</div>`);
def("legend", "items: [{label, tone, means}]", (b) => `<div class="legend">${b.items.map((l) => `<span>${pill(l.tone, esc(l.label))} ${esc(l.means)}</span>`).join("")}</div>`);
def("bigNumber", "n, text", (b) => `<div><div class="big num">${val(b.n)}</div><p class="lede">${md(b.text)}</p></div>`);
def("details", "summary, text", (b) => `<details style="margin-top:14px"><summary>${esc(b.summary)} ›</summary><p style="font-size:13.5px">${md(b.text)}</p></details>`);
def("card", "blocks: [...] — a white card around other blocks", (b) => `<div class="card">${renderBlocks(b.blocks)}</div>`);
def("grid", "cols: [[blocks], [blocks]] — side by side, stacks on phones", (b) => `<div class="grid2">${b.cols.map((c) => `<div>${renderBlocks(c)}</div>`).join("")}</div>`);
def("twoCards", "lose: {title, text}, win: {title, text}", (b) => `<div class="two"><div class="card lose"><div class="eyebrow">⚔ ${esc(b.lose.title)}</div><p>${md(b.lose.text)}</p></div><div class="card win"><div class="eyebrow">🎯 ${esc(b.win.title)}</div><p>${md(b.win.text)}</p></div></div>`);
def("moves", "groups: [{group, icon?, items: [{do, why}]}]", (b) => `<div class="moves">${b.groups.map((g) => `<div><div class="eyebrow" style="margin-bottom:8px">${esc(g.icon ?? "")} ${esc(g.group)}</div>${g.items.map((m) => `<div class="move"><b>${md(m.do)}</b><span>${L("vì", "because")} ${md(m.why)}</span></div>`).join("")}</div>`).join("")}</div>`);

def("barList", "rows: [{label, v, note?, hi?, warn?, color?}], fmt?, mark?, markLabel?, color?", (b) => {
  const M = Math.max(1, ...b.rows.map((r) => r.v ?? 0), b.mark ?? 0), f = (n) => (FMT[b.fmt ?? "int"] ?? nf)(n);
  return `<div class="barlist">${b.rows.map((r) => `<div class="bl ${r.hi ? "hi" : ""}"><span class="bl-l">${esc(r.label)}</span><div class="bl-t"><i style="width:${(100 * Math.max(0, r.v ?? 0)) / M}%;background:${r.hi ? "var(--q)" : r.color ?? b.color ?? "#c3c7cd"}"></i>${b.mark != null ? `<b style="left:${(100 * b.mark) / M}%"></b>` : ""}</div><span class="bl-v num">${f(r.v)}</span>${r.warn ? `<span class="bl-n">${pill("warn", "⚠")}</span>` : r.note != null ? `<span class="bl-n">${md(r.note)}</span>` : ""}</div>`).join("")}${b.mark != null && b.markLabel ? `<div class="bl-mk">│ ${esc(b.markLabel)}</div>` : ""}</div>`;
});

def("areaTrend", "name, vals: [24 monthly values]", (b) => {
  const v = b.vals, W = 760, h = 260, Lp = 16, R = 16, T = 40, Bt = 30, max = Math.max(...v) * 1.12, n = v.length - 1;
  const x = (m) => Lp + (m * (W - Lp - R)) / n, y = (q) => T + (h - T - Bt) * (1 - q / max), bad = jumpMonths([v]);
  let jm = 1; for (let m = 1; m <= n; m++) if (Math.abs(v[m] - v[m - 1]) > Math.abs(v[jm] - v[jm - 1])) jm = m;
  const jd = v[jm] - v[jm - 1], pts = v.map((q, m) => `${x(m)},${y(q)}`).join(" "), cx = (x(jm - 1) + x(jm)) / 2, cy = Math.min(y(v[jm - 1]), y(v[jm])) - 14;
  const showJump = Math.abs(jd) > 0.15 * Math.max(1, v[jm - 1]);
  return `<svg viewBox="0 0 ${W} ${h}" class="trend" role="img" aria-label="${esc(b.name)}"><defs><linearGradient id="ar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a78d6" stop-opacity=".28"/><stop offset="1" stop-color="#2a78d6" stop-opacity="0"/></linearGradient></defs>
${bad.map((q, m) => (q ? `<rect x="${x(m - 1)}" y="${T - 8}" width="${x(m) - x(m - 1)}" height="${h - T - Bt + 8}" fill="#fdf3dc"/>` : "")).join("")}
<line x1="${Lp}" x2="${W - R}" y1="${h - Bt}" y2="${h - Bt}" stroke="#e6e3dc"/><polygon points="${x(0)},${h - Bt} ${pts} ${x(n)},${h - Bt}" fill="url(#ar)"/><polyline points="${pts}" fill="none" stroke="#2a78d6" stroke-width="2.5" stroke-linejoin="round"/>
${[0, n].map((m) => `<circle cx="${x(m)}" cy="${y(v[m])}" r="4.5" fill="#2a78d6" stroke="#fff" stroke-width="2"/><text x="${x(m) + (m ? -8 : 8)}" y="${y(v[m]) - 12}" text-anchor="${m ? "end" : "start"}" font-size="13" font-weight="700" fill="#1b1f27">${nf(v[m])}</text>`).join("")}
${showJump ? `<line x1="${cx}" x2="${cx}" y1="${cy + 4}" y2="${Math.max(y(v[jm - 1]), y(v[jm]))}" stroke="#b45309" stroke-dasharray="3 3"/><rect x="${cx - 100}" y="${cy - 26}" width="200" height="24" rx="12" fill="#fff" stroke="#f2e2b8"/><text x="${cx}" y="${cy - 10}" text-anchor="middle" font-size="12" fill="#b45309">${jd < 0 ? "−" : "+"}${nf(Math.abs(jd))} ${L("store trong 1 tháng", "stores in one month")} (${month(jm)})</text>` : ""}
${[0, 6, 12, 18, n].map((m) => `<text x="${x(m)}" y="${h - 10}" font-size="11" text-anchor="${m === 0 ? "start" : m === n ? "end" : "middle"}" fill="#8a8f98">${month(m)}</text>`).join("")}</svg>`;
});

def("trend", "lines: [{name, vals: [24], q?}] — several series, Qikify/subject q:true", (b) => {
  const W = 680, h = 230, Lp = 52, R = 140, T = 10, Bt = 24, n = b.lines[0].vals.length - 1, max = Math.max(1, ...b.lines.flatMap((l) => l.vals)) * 1.05;
  const x = (m) => Lp + (m * (W - Lp - R)) / n, y = (q) => T + (h - T - Bt) * (1 - q / max), bad = jumpMonths(b.lines.map((l) => l.vals));
  const lab = b.lines.map((l) => ({ l, y: y(l.vals[n]) })).sort((a, c) => a.y - c.y);
  for (let i = 1; i < lab.length; i++) if (lab[i].y - lab[i - 1].y < 14) lab[i].y = lab[i - 1].y + 14;
  return `<svg viewBox="0 0 ${W} ${h}" class="trend">${bad.map((q, m) => (q ? `<rect x="${x(m - 1)}" y="${T}" width="${x(m) - x(m - 1)}" height="${h - T - Bt}" fill="#fdf3dc"/>` : "")).join("")}
${[0, 0.5, 1].map((f) => `<line x1="${Lp}" x2="${W - R}" y1="${y((max * f) / 1.05)}" y2="${y((max * f) / 1.05)}" stroke="#eceae4"/><text x="${Lp - 6}" y="${y((max * f) / 1.05) + 4}" font-size="11" text-anchor="end" fill="#8a8f98">${nf((max * f) / 1.05)}</text>`).join("")}
${[0, Math.round(n / 2), n].map((m) => `<text x="${x(m)}" y="${h - 6}" font-size="11" text-anchor="middle" fill="#8a8f98">${month(m)}</text>`).join("")}
${b.lines.map((l) => `<polyline fill="none" stroke="${l.q ? "#2a78d6" : "#b9bec7"}" stroke-width="${l.q ? 3 : 1.5}" points="${l.vals.map((q, m) => `${x(m)},${y(q)}`).join(" ")}"/>`).join("")}
${lab.map(({ l, y: yy }) => `<text x="${W - R + 6}" y="${yy + 4}" font-size="12" fill="${l.q ? "#2a78d6" : "#5d6470"}" font-weight="${l.q ? 700 : 400}">${esc(l.name.length > 20 ? l.name.slice(0, 19) + "…" : l.name)}</text>`).join("")}</svg>`;
});

def("monthBars", "a: [monthly], b: [monthly], la, lb, months? (how many recent, default 12), startMonth? (index of a[0], default 1)", (b) => {
  const k = b.months ?? 12, s0 = b.startMonth ?? 1, idx = b.a.map((_, i) => i).slice(-k), tot = idx.map((i) => (b.a[i] ?? 0) + (b.b[i] ?? 0));
  const max = Math.max(1, ...tot), mid = tot.slice().sort((p, q) => p - q)[Math.floor(tot.length / 2)], odd = (t) => t > 3 * Math.max(1, mid);
  return `<div><div class="mbars tall">${idx.map((i, j) => `<div class="mb ${odd(tot[j]) ? "odd" : ""}"><div class="mb-c">${odd(tot[j]) ? "<em>⚠</em>" : ""}<i class="b" style="height:${(100 * (b.b[i] ?? 0)) / max}%"></i><i class="a" style="height:${(100 * (b.a[i] ?? 0)) / max}%"></i></div><span>${month(s0 + i).slice(0, 2)}</span></div>`).join("")}</div>
<div class="mb-key"><span><i class="a"></i>${esc(b.la)}</span><span><i class="b"></i>${esc(b.lb)}</span>${tot.some(odd) ? `<span class="warn">⚠ ${L("tháng gấp hơn 3 lần bình thường: nhiều khả năng lỗi dữ liệu", "month over 3× the usual: likely a data error")}</span>` : ""}</div></div>`;
});

def("shareStack", "parts: [{label, v, hi?}] — include a 'rest' part so it sums to the whole", (b) => {
  const tot = sum(b.parts.map((p) => p.v)) || 1, pal = ["#1b1f27", "#4a505a", "#7c818b", "#a5aab2", "#c9ccd2"];
  const col = (p, i) => (p.hi ? "var(--q)" : p.rest ? "#ecebe6" : pal[i % pal.length]);
  return `<div><div class="stack">${b.parts.map((p, i) => `<i style="width:${(100 * p.v) / tot}%;background:${col(p, i)}" title="${esc(p.label)}"></i>`).join("")}</div><div class="stack-key">${b.parts.map((p, i) => `<span><i style="background:${col(p, i)}"></i>${esc(p.label)} <b class="num">${pf((100 * p.v) / tot)}</b></span>`).join("")}</div></div>`;
});

def("scoreHead", "tone, label, line, proof, pass?, of? — score ring + verdict (pass/of default to the next meters block)", (b) => {
  const r = 34, c = 2 * Math.PI * r, k = b.pass / b.of, col = k >= 0.67 ? "#067a55" : k >= 0.4 ? "#eda100" : "#c2410c";
  return `<div class="vhead"><div class="ring"><svg viewBox="0 0 84 84" width="84" height="84"><circle cx="42" cy="42" r="${r}" fill="none" stroke="#f1efea" stroke-width="9"/><circle cx="42" cy="42" r="${r}" fill="none" stroke="${col}" stroke-width="9" stroke-dasharray="${(c * b.pass) / b.of} ${c}" stroke-linecap="round" transform="rotate(-90 42 42)"/><text x="42" y="47" text-anchor="middle" font-size="20" font-weight="700" fill="#1b1f27">${b.pass}/${b.of}</text></svg><span>${L("tiêu chí đạt", "criteria met")}</span></div><div>${pill(b.tone ?? "warn", esc(b.label))}<b style="margin-top:6px">${md(b.line)}</b><span>${md(b.proof)}</span></div></div>`;
});

def("meters", "items: [{k, value, threshold, fmt, lowerWins?, note}] — pass/fail is computed", (b) => `<div class="meters">${b.items.map((m) => {
  const ok = m.lowerWins ? m.value < m.threshold : m.value >= m.threshold, max = Math.max(m.value, m.threshold) * 1.3, f = (n) => (FMT[m.fmt ?? "int"] ?? nf)(n);
  return `<div class="meter ${ok ? "ok" : "no"}"><div class="mt-h"><b>${esc(m.k)}</b>${pill(ok ? "up" : "dn", ok ? L("✓ Đạt", "✓ Pass") : L("✕ Chưa đạt", "✕ Fail"))}</div><div class="mt-v num">${f(m.value)}</div><div class="mt-t"><i style="width:${(100 * m.value) / max}%"></i><b style="left:${(100 * m.threshold) / max}%"><em>${m.lowerWins ? L("tốt nếu dưới", "good below") : L("cần từ", "needs")} ${f(m.threshold)}</em></b></div><div class="mt-n">${md(m.note)}</div></div>`;
}).join("")}</div>`);

def("fanOut", "source, total, rows: [{label, v, note?}] — where stores went (Sankey-style)", (b) => {
  const W = 760, gap = 10, minH = 22, sx = 190, dx = 470, s = sum(b.rows.map((r) => r.v)) || 1, sc = 200 / s;
  const hs = b.rows.map((r) => Math.max(3, r.v * sc)), slot = hs.map((q) => Math.max(minH, q)), H = sum(slot) + gap * (b.rows.length - 1) + 40;
  let sy = (H - s * sc) / 2, ty = 20;
  const paths = b.rows.map((r, i) => {
    const q = hs[i], y0 = sy, t0 = ty + (slot[i] - q) / 2, mid = ty + slot[i] / 2, cx = (sx + dx) / 2; sy += q; ty += slot[i] + gap;
    return `<path d="M${sx},${y0} C${cx},${y0} ${cx},${t0} ${dx},${t0} L${dx},${t0 + q} C${cx},${t0 + q} ${cx},${y0 + q} ${sx},${y0 + q} Z" fill="#ee9a72" fill-opacity="${0.3 + 0.45 * (1 - i / b.rows.length)}"/><rect x="${dx}" y="${t0}" width="6" height="${q}" fill="#c2410c" rx="2"/><text x="${dx + 16}" y="${mid + 5}" font-size="13" fill="#1b1f27"><tspan font-weight="700">${nf(r.v)}</tspan> ${esc(r.label)}</text>${r.note ? `<text x="${W - 6}" y="${mid + 5}" text-anchor="end" font-size="11.5" fill="#6b717c">${esc(r.note)}</text>` : ""}`;
  }).join("");
  return `<svg viewBox="0 0 ${W} ${H}" class="trend" role="img"><rect x="${sx - 12}" y="${(H - s * sc) / 2}" width="12" height="${s * sc}" rx="4" fill="#c2410c"/><text x="${sx - 22}" y="${H / 2 - 6}" text-anchor="end" font-size="14" font-weight="700" fill="#1b1f27">${esc(b.source)}</text><text x="${sx - 22}" y="${H / 2 + 12}" text-anchor="end" font-size="12" fill="#6b717c">${nf(b.total)} ${L("store đã gỡ", "stores dropped it")}</text>${paths}</svg>`;
});

def("netBars", "rows: [{label, lost, won}], a? (subject name) — stores lost to vs won from each rival", (b) => {
  const max = Math.max(1, ...b.rows.flatMap((r) => [r.lost, r.won]));
  return `<div class="netb"><div class="nb-h"><span class="dn">← ${L("mất về họ", "lost to them")}</span><span></span><span class="up">${L("lấy được từ họ", "won from them")} →</span><span>${L("Chênh lệch", "Net")}</span></div>${b.rows.map((r) => { const n = r.won - r.lost; return `<div class="nb"><div class="l"><span class="num">${nf(r.lost)}</span><i style="width:${(100 * r.lost) / max}%"></i></div><b>${esc(r.label)}</b><div class="r"><i style="width:${(100 * r.won) / max}%"></i><span class="num">${nf(r.won)}</span></div>${pill(n >= 0 ? "up" : "dn", (n >= 0 ? "+" : "−") + nf(Math.abs(n)))}</div>`; }).join("")}</div>`;
});

def("flowPair", "out, in, a, b — two numbers facing each other with the net", (b) => {
  const n = b.in - b.out;
  return `<div class="flow card"><div><div class="serif num dn">${nf(b.out)}</div><span>${L(`store gỡ ${esc(b.a)} rồi cài ${esc(b.b)}`, `stores left ${esc(b.a)} for ${esc(b.b)}`)}</span></div><div class="arrows"><span>${esc(b.a)} → ${esc(b.b)}</span><span>${esc(b.a)} ← ${esc(b.b)}</span></div><div><div class="serif num up">${nf(b.in)}</div><span>${L(`store gỡ ${esc(b.b)} rồi cài ${esc(b.a)}`, `stores left ${esc(b.b)} for ${esc(b.a)}`)}</span></div><div class="net ${n >= 0 ? "up" : "dn"}"><b>${n >= 0 ? "+" : "−"}${nf(Math.abs(n))}</b><span>${n >= 0 ? L(`${esc(b.a)} đang hút khách`, `${esc(b.a)} is winning`) : L(`${esc(b.b)} đang hút khách`, `${esc(b.b)} is winning`)}</span></div></div>`;
});

def("indexBars", "rows: [{label, idx, note?}] — around 1,0 = the platform average", (b) => {
  const max = Math.max(2, ...b.rows.map((r) => r.idx));
  return `<div class="idx">${b.rows.map((r) => `<div class="ix"><span class="bl-l">${esc(r.label)}</span><div class="ix-t"><b style="left:${100 / max}%"></b><i style="left:${r.idx >= 1 ? 100 / max : (100 * r.idx) / max}%;width:${(100 * Math.abs(r.idx - 1)) / max}%;background:${r.idx >= 1 ? "var(--up)" : "var(--dn)"}"></i></div><span class="bl-v num ${r.idx >= 1 ? "up" : "dn"}">${df(r.idx)}×</span>${r.note != null ? `<span class="bl-n">${md(r.note)}</span>` : ""}</div>`).join("")}<div class="bl-mk">│ ${L("1,0 = ngang mặt bằng chung", "1.0 = platform average")}</div></div>`;
});

def("segmentCompare", "rows: [{label, a, b}] (percent shares), la, lb — subject vs baseline mirror bars", (b) => {
  const max = Math.max(...b.rows.flatMap((r) => [r.a, r.b]));
  return `<div class="seg"><div class="seg-h"><span>${esc(b.la)}</span><span></span><span>${esc(b.lb)}</span></div>${b.rows.map((r) => `<div class="sg"><div class="l"><span class="num">${pf(r.a)}</span><i style="width:${(100 * r.a) / max}%"></i></div><b>${esc(r.label)}</b><div class="r"><i style="width:${(100 * r.b) / max}%"></i><span class="num">${pf(r.b)}</span></div></div>`).join("")}</div>`;
});

def("mixBars", "tiers: [4 labels, small→big], rows: [{label, parts: [4 counts], hi?, note?}] — sorted by top-2 share", (b) => {
  const pal = ["#e6e3dc", "#c3c7cd", "#7c818b", "#1b1f27"], top = (r) => (r.parts[2] + r.parts[3]) / (sum(r.parts) || 1);
  return `<div class="mix"><div class="mx-key">${b.tiers.map((t, i) => `<span><i style="background:${pal[i]}"></i>${esc(t)}</span>`).join("")}</div>${b.rows.slice().sort((p, q) => top(q) - top(p)).map((r) => { const t = sum(r.parts) || 1; return `<div class="mx ${r.hi ? "hi" : ""}"><span class="bl-l">${esc(r.label)}</span><div class="mx-t">${r.parts.map((p, i) => `<i style="width:${(100 * p) / t}%;background:${r.hi && i === 3 ? "#2a78d6" : r.hi && i === 2 ? "#8db6ea" : pal[i]}"></i>`).join("")}</div><span class="bl-v num">${pf(100 * top(r))}</span>${r.note ? `<span class="bl-n">${esc(r.note)}</span>` : ""}</div>`; }).join("")}</div>`;
});

def("appCards", "cards: [{name, big, unit, sub?, tags?: [], badge?, hi?}]", (b) => `<div class="grid-cards">${b.cards.map((c) => `<div class="rc nc ${c.hi ? "hi" : ""}">${c.badge ? `<span class="age">${esc(c.badge)}</span>` : ""}<div class="top"><span class="mono sm">${esc(String(c.name).slice(0, 1))}</span><b>${esc(c.name)}</b></div><div class="v num">${val(c.big)} <small>${esc(c.unit)}</small></div>${c.sub ? `<span class="mut" style="font-size:12px">${md(c.sub)}</span>` : ""}${c.tags?.length ? `<div class="tags">${c.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}</div>`).join("")}</div>`);

def("table", "cols: [{label, align?: r|c}], rows: [{cells: [...], hi?}] — a cell is text, a number, {n,fmt}, {pill:[tone,text]}, {bar:[v,max]} or {growth:{series}|{growth,warn}}", (b) => {
  const cell = (c) => (c && typeof c === "object" ? (c.pill ? pill(c.pill[0], esc(c.pill[1])) : c.bar ? `<div class="sz"><i style="width:${(100 * c.bar[0]) / c.bar[1]}%;${c.hi ? "background:var(--q)" : ""}"></i><span>${nf(c.bar[0])}</span></div>` : c.growth ? growthPill(c.growth) : val(c)) : typeof c === "number" ? nf(c) : md(c ?? "—"));
  return `<div class="scroll"><table style="min-width:640px"><thead><tr>${b.cols.map((c) => `<th class="${c.align ?? ""}">${esc(c.label)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr class="${r.hi ? "sel" : ""}">${r.cells.map((c, i) => `<td class="${b.cols[i]?.align ?? ""}">${cell(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
});

// Scorecard overview (competitor report): status + Qikify-vs-category gap bar are computed from the numbers.
const STATUS = () => [
  { label: L("Vượt category", "Ahead of category"), tone: "up", means: L("tăng nhanh hơn cả category (hơn 5 điểm %)", "grows over 5 pts faster than its category") },
  { label: L("Giữ nhịp", "Keeping pace"), tone: "n", means: L("tăng ngang category (chênh dưới 5 điểm %)", "within 5 pts of its category") },
  { label: L("Tụt lại", "Falling behind"), tone: "dn", means: L("category tăng nhanh hơn (hơn 5 điểm %)", "category grows over 5 pts faster") },
  { label: L("Số chưa chắc", "Unsure numbers"), tone: "warn", means: L("chuỗi số nhảy vì lỗi crawl/gán nhầm, chưa đo được", "series jumps (crawl/attribution), can't measure") },
  { label: L("Còn nhỏ", "Too small"), tone: "n", means: L("dưới 150 store, % tăng chưa có ý nghĩa", "under 150 stores, % growth is noise") },
];
function status(r) {
  const S = STATUS(), g = r.series ? growth(r.series) : { g: r.growth, warn: false };
  if (g.warn || r.warn) return { ...S[3], g: g.g };
  if ((r.stores ?? 0) < 150 || g.g == null) return { ...S[4], g: g.g };
  const gap = g.g - r.catGrowth;
  return { ...(gap < -5 ? S[2] : gap > 5 ? S[0] : S[1]), g: g.g };
}
def("scoreTable", "subject (e.g. Qikify), rows: [{area, stores, series? (24) | growth, catGrowth (12-month %), share (%), leader, leaderStores, hi?}]", (b) => {
  const gapCell = (r, st) => {
    if (st.tone === "warn") return `<div class="gap"><span class="warn" style="font-size:12.5px">⚠ ${L("chưa đo được", "can't measure")}</span></div>`;
    if (st.label === STATUS()[4].label) return `<div class="gap"><span class="mut" style="font-size:12.5px">${L("còn nhỏ, chưa so", "too small to compare")}</span></div>`;
    const d = st.g - r.catGrowth, g = Math.max(-60, Math.min(60, d));
    return `<div class="gap"><div class="gapbar"><i style="${g < 0 ? `right:50%;width:${(-g / 60) * 50}%;background:var(--dn)` : `left:50%;width:${(g / 60) * 50}%;background:var(--up)`}"></i><b></b></div><div class="${g < 0 ? "dn" : "up"}" style="font-size:12px">${g < 0 ? L("chậm hơn", "slower by") : L("nhanh hơn", "faster by")} ${nf(Math.abs(d))} ${L("điểm", "pts")}</div><div class="mut" style="font-size:11px">${esc(b.subject ?? L("App", "App"))} ${pf(st.g, true)} · category ${pf(r.catGrowth, true)}</div></div>`;
  };
  return `${B.legend({ items: STATUS() })}<div class="card scroll" style="padding:0"><table style="min-width:760px"><thead><tr><th>${L("App", "App")}</th><th>${L("Trạng thái", "Status")}</th><th class="r">${L("Store đang dùng", "Stores")}</th><th style="width:210px">${L("So với category, 12 tháng", "vs category, 12 months")}</th><th class="r">${L("Thị phần", "Share")}</th><th>${L("Đối thủ lớn nhất", "Biggest rival")}</th></tr></thead><tbody>${b.rows.slice().sort((p, q) => q.stores - p.stores).map((r) => { const st = status(r); return `<tr class="${r.hi ? "sel" : ""}"><td><b>${r.href ? `<a href="#${esc(r.href)}">${esc(r.area)}</a>` : esc(r.area)}</b></td><td>${pill(st.tone, esc(st.label))}</td><td class="num r">${nf(r.stores)}</td><td>${gapCell(r, st)}</td><td class="num r">${pf(r.share)}</td><td style="font-size:12.5px">${esc(r.leader ?? "—")} <span class="mut">${r.leaderStores ? `· ${nf(r.leaderStores)} store` : ""}</span></td></tr>`; }).join("")}</tbody></table></div>`;
});

// Battlecard: the subject vs one rival at a time; tabs switch rivals (tiny inline script, works offline).
let bcId = 0;
def("battlecard", "a: {name, sub}, criteria: [{k, hint, fmt (int|pct|usd|star|bool|growth — growth takes 24-month series), lowerWins?}], rivals: [{name, sub?, stores, a: [values per criterion], b: [values], warn?: [criterion indexes], lost, won, strength, weakness}]", (b) => {
  const id = `bc${++bcId}`;
  const panel = (rv, j) => {
    const rows = b.criteria.map((c, i) => {
      let A = rv.a[i], Bv = rv.b[i], w = rv.warn?.includes(i);
      if (c.fmt === "growth") { const ga = Array.isArray(A) ? growth(A) : { g: A, warn: false }, gb = Array.isArray(Bv) ? growth(Bv) : { g: Bv, warn: false }; A = ga.g; Bv = gb.g; w = w || ga.warn || gb.warn; }
      const known = A != null && Bv != null && !w, hide = w || A < 0 || Bv < 0;
      const win = !known || A === Bv ? 0 : (c.lowerWins ? A < Bv : A > Bv) ? 1 : -1, max = Math.max(Math.abs(A ?? 0), Math.abs(Bv ?? 0)) || 1, f = (n) => (n == null ? "—" : typeof n === "string" ? esc(n) : c.fmt === "growth" ? pf(n, true) : (FMT[c.fmt ?? "int"] ?? nf)(n));
      return { win, html: `<div class="tug"><div class="tk"><b>${esc(c.k)}</b><span>${esc(c.hint)}</span></div><div class="ts a ${win > 0 ? "won" : ""}"><span class="num">${f(A)}</span><i style="width:${hide ? 0 : (100 * (A ?? 0)) / max}%;${hide ? "visibility:hidden" : ""}"></i></div><div class="ts b ${win < 0 ? "won" : ""}"><i style="width:${hide ? 0 : (100 * (Bv ?? 0)) / max}%;${hide ? "visibility:hidden" : ""}"></i><span class="num">${f(Bv)}</span></div><div class="tw">${w ? `<span class="warn">⚠ ${L("chưa chắc", "unsure")}</span>` : win > 0 ? `<span class="up">${esc(b.a.name)} ${L("hơn", "ahead")}</span>` : win < 0 ? `<span class="dn">${esc(rv.name)} ${L("hơn", "ahead")}</span>` : `<span class="mut">${L("ngang", "even")}</span>`}</div></div>` };
    });
    const sq = rows.filter((r) => r.win > 0).length, sc = rows.filter((r) => r.win < 0).length;
    return `<div class="bc-p" data-p="${j}" ${j ? "hidden" : ""}><div class="vs"><div class="side q"><div class="mono">${esc(b.a.name.slice(0, 1))}</div><div><b>${esc(b.a.name)}</b><span>${esc(b.a.sub ?? "")}</span></div></div><div class="score"><span class="up">${sq}</span><em>–</em><span class="dn">${sc}</span><small>${L("tiêu chí hơn", "criteria ahead")}</small></div><div class="side r"><div><b>${esc(rv.name)}</b><span>${esc(rv.sub ?? "")}</span></div><div class="mono">${esc(rv.name.slice(0, 1))}</div></div></div>
<div class="card" style="padding:6px 18px">${rows.map((r) => r.html).join("")}</div>
${rv.lost != null ? `<h3 class="ask">${L("Store đang chạy về phía ai?", "Which way are stores moving?")}</h3>${B.flowPair({ out: rv.lost, in: rv.won, a: b.a.name, b: rv.name })}<p class="how">${L("Đếm trong 24 tháng, store đổi app trong cùng tháng hoặc tháng sau và vẫn còn hoạt động.", "24 months; stores that switched within the same or next month and are still active.")}</p>` : ""}
${rv.strength ? B.twoCards({ lose: { title: L(`${rv.name} đang hơn ở`, `Where ${rv.name} is ahead`), text: rv.strength }, win: { title: L(`Cách lấy khách của ${rv.name}`, `How to win ${rv.name}'s customers`), text: rv.weakness } }) : ""}</div>`;
  };
  return `<div class="bc" id="${id}"><div class="rivals" role="tablist">${b.rivals.map((r, j) => `<button role="tab" aria-selected="${j === 0}" data-t="${j}"><b>${esc(r.name)}</b><span>${nf(r.stores)} store</span></button>`).join("")}</div>${b.rivals.map(panel).join("")}</div>
<script>(()=>{const r=document.getElementById("${id}");r.querySelectorAll("[data-t]").forEach(t=>t.onclick=()=>{r.querySelectorAll("[data-t]").forEach(x=>x.setAttribute("aria-selected",x===t));r.querySelectorAll(".bc-p").forEach(p=>p.hidden=p.dataset.p!==t.dataset.t)})})()</script>`;
});

// ── document ──────────────────────────────────────────────────────────────────────────────────────
function renderBlocks(list = []) {
  return list.map((b) => {
    if (!B[b.type]) throw new Error(`unknown block type "${b.type}" — run: node render.mjs --blocks`);
    try { return B[b.type](b); } catch (e) { throw new Error(`block "${b.type}": ${e.message}`); }
  }).join("\n");
}
// scoreHead without pass/of takes them from the meters block that follows it
function prepare(blocks = []) {
  blocks.forEach((b, i) => {
    if (b.type === "scoreHead" && b.pass == null) { const m = blocks.slice(i).find((x) => x.type === "meters"); if (m) { b.of = m.items.length; b.pass = m.items.filter((x) => (x.lowerWins ? x.value < x.threshold : x.value >= x.threshold)).length; } }
    if (b.blocks) prepare(b.blocks); if (b.type === "grid") b.cols.forEach(prepare);
  });
  return blocks;
}
export function render(d) {
  LOC = d.lang === "en" ? "en" : "vi";
  if (d.month0) T0 = d.month0.split("-").map(Number);
  const css = readFileSync(join(HERE, "../assets/report.css"), "utf8");
  const pages = d.pages.map((p, i) => `<section class="rp uc" id="${esc(p.id ?? `p${i + 1}`)}"><div class="uc-head">${p.n != null ? `<div class="uc-n">${String(p.n).padStart(2, "0")}</div>` : ""}<div><div class="eyebrow">${esc(p.eyebrow ?? "")}</div><h1 class="serif">${md(p.question ?? p.title)}</h1></div></div>${renderBlocks(prepare(p.blocks))}</section>`);
  const toc = d.pages.length > 2 ? `<nav class="toc">${d.pages.map((p, i) => `<a href="#${esc(p.id ?? `p${i + 1}`)}">${esc(p.short ?? p.title ?? p.question)}</a>`).join("")}</nav>` : "";
  const cav = d.caveats?.length ? `<div class="foot"><b>${L("Lưu ý dữ liệu", "Data notes")}</b><ul>${d.caveats.map((c) => `<li>${md(c)}</li>`).join("")}</ul></div>` : "";
  return `<!doctype html><html lang="${LOC}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.title)}</title>
<style>${css}
body{margin:0;background:#f4f2ed}main{max-width:1180px;margin:0 auto;padding:36px 20px 80px}main>.rp{margin:0 0 26px;box-shadow:0 1px 0 #e6e3dc,0 14px 40px -24px rgba(30,40,60,.28)}
.top{margin:0 4px 20px}.top h1{font:500 38px/1.12 Georgia,serif;margin:6px 0 8px;letter-spacing:-.01em}.top p{color:#4a505a;max-width:820px;margin:0}
.toc{display:flex;flex-wrap:wrap;gap:8px;margin:16px 4px 24px}.toc a{font-size:12.5px;background:#fff;border:1px solid #e6e3dc;border-radius:99px;padding:4px 11px;text-decoration:none;color:#1b1f27}
.foot{font-size:12.5px;color:#6b717c;margin:30px 4px 0}.foot ul{padding-left:18px}.src{font-size:12px;color:#6b717c;margin:16px 4px 0}
.rp a{color:inherit}.rp .bc .rivals{display:flex;gap:8px;overflow-x:auto;padding:4px 0 14px}.rp .bc .rivals button{border:1px solid var(--line);background:#fff;border-radius:12px;padding:7px 12px;text-align:left;cursor:pointer;display:grid;flex:none}
.rp .bc .rivals button b{font-size:13px}.rp .bc .rivals button span{font-size:11px;color:var(--mut)}.rp .bc .rivals button[aria-selected="true"]{border-color:var(--ink);box-shadow:0 0 0 1.5px var(--ink)}
.rp .bc .vs{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;margin:6px 0 14px;padding:16px 18px;border-radius:16px;background:linear-gradient(90deg,#eaf1fd,#fff 45%,#fff 55%,#f4f2ed)}
.rp .bc .side{display:flex;align-items:center;gap:12px}.rp .bc .side.r{justify-content:flex-end;text-align:right}.rp .bc .side b{display:block;font-size:18px}.rp .bc .side span{font-size:12px;color:var(--mut)}.rp .bc .side.q .mono{background:var(--q);color:#fff}
.rp .bc .score{display:flex;align-items:baseline;gap:6px;font:600 34px Georgia,serif;flex-wrap:wrap;justify-content:center}.rp .bc .score em{color:var(--mut);font-style:normal}.rp .bc .score small{flex-basis:100%;text-align:center;font:500 11px ui-sans-serif,sans-serif;color:var(--mut)}
@media (max-width:720px){.rp .bc .vs{grid-template-columns:1fr;text-align:center}.rp .bc .side,.rp .bc .side.r{justify-content:center}.top h1{font-size:28px}}
</style></head><body><main>
<header class="top"><div class="eyebrow" style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6b717c;font-weight:600">${esc(d.eyebrow ?? "StoreLeads")}</div><h1>${md(d.title)}</h1>${d.intro ? `<p>${md(d.intro)}</p>` : ""}</header>
${toc}${pages.join("\n")}${cav}
<p class="src">${esc(d.source ?? L("Nguồn: StoreLeads (nội bộ), 10/2024 – 09/2026, qua Grafana MCP. Chỉ dùng nội bộ.", "Source: StoreLeads (internal), Oct 2024 – Sep 2026, via Grafana MCP. Internal use only."))}</p>
</main></body></html>`;
}

// ── cli ───────────────────────────────────────────────────────────────────────────────────────────
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [inp, outArg] = process.argv.slice(2);
  if (!inp || inp === "--help") { console.log("usage: node render.mjs <report.json> [out.html] | --blocks"); process.exit(inp ? 0 : 1); }
  if (inp === "--blocks") { for (const [k, v] of Object.entries(doc.fields)) console.log(`${k.padEnd(15)} ${v}`); process.exit(0); }
  const d = JSON.parse(readFileSync(inp, "utf8"));
  const slug = (d.slug ?? d.title ?? "report").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  const out = outArg ?? join(homedir(), "Downloads", `storeleads-${slug}.html`);
  mkdirSync(dirname(out), { recursive: true });
  const html = render(d);
  writeFileSync(out, html);
  const unsure = (html.match(/⚠/g) ?? []).length;
  console.log(`✓ ${out} · ${d.pages.length} page(s) · ${(html.length / 1024).toFixed(0)} KB${unsure ? ` · ${unsure} ⚠ marks (say why in the reply)` : ""}`);
}
