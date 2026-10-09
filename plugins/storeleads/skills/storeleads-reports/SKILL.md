---
name: storeleads-reports
allowed-tools: Read, Write, Bash(node *render.mjs*), WebFetch, mcp__plugin_storeleads_grafana, mcp__grafana
description: Deliver a finished, shareable StoreLeads REPORT as one self-contained HTML page — portfolio scorecard (every app of a vendor vs its category), competitor report (scorecard + battlecards), growth check, category scan, app idea check, churn post-mortem, Plus gap, geo expansion, stack & partnership, newcomer watch, customer profile vs rivals. Use when someone asks for a "report", "báo cáo", "brief", "one-pager", "phân tích đối thủ", "make this a page I can share", or any of those ten questions as a deliverable rather than a quick chat answer. Data via the Grafana MCP (datasource storeleads-ch, database slim); the queries and data rules come from the storeleads-grafana skill. Internal use only.
---

# StoreLeads reports

You turn StoreLeads data into a report people **read at a glance**: every block opens with the question it answers,
every chart says how to read it, every number sits next to what it is compared with, and ⚠ marks what the data can't
tell. The look is fixed (approved 2026-10-08) and lives in the renderer — you write a JSON document, never HTML or CSS.

## The eleven reports

| Type | Question | Detail |
|---|---|---|
| 1 Competitor report | Winning or losing in each area, against whom? | scorecard of all the vendor's apps + per app: rivals table, battlecard, moves |
| 2 Growth check | Growing or shrinking, and why? | verdict, trend, real uninstalls vs stores leaving |
| 3 Category scan | Heating up, who is winning? | KPIs vs a year ago, share stack, gainers/losers |
| 4 App idea check | Should we build here? | score ring + six go/no-go meters, incumbents |
| 5 Churn post-mortem | Where do leavers go? | fan-out to same-job rivals, both-way net bars |
| 6 Plus gap | Plus stores with no app in the category? | big number + by country |
| 7 Geo expansion | Strong or thin where? | reach index vs platform, share by country |
| 8 Stack & partnership | What else do its stores run? | co-install share + lift, partner cards |
| 9 Newcomer watch | Which new apps to watch? | cards + stores gained per month since launch |
| 10 Customer profile vs rivals | Whose customers are bigger? | revenue-mix bars, % Plus, median revenue |
| 11 Portfolio scorecard | Which of our apps fall behind their category? | one table: status, gap bar vs category, share, leader |

Blocks, order and the text to write for each: `references/report-types.md`. Queries: `references/recipes.md`.

## Workflow

1. **Pin the ask.** Subject (app, vendor or category) and which report(s). Unclear subject → one short question; a type
   not named → pick from the table and say which. An ask that spans two types ("đang tăng hay giảm, và khách gỡ thì đi
   đâu" = 2 + 5) → ONE document, one page per type. A name that fits several apps → the one with most stores, say so.
2. **Pull the data** with `query_sql` (recipes R0–R9). Resolve keys first (R0), merge old + new category names (R1).
   Save every result you use; never type a number you did not get from a query or a listing page.
3. **Read listings** only when the type needs them (1, 4): WebFetch the App Store page; failures stay `null`.
4. **Write the document** (`report.json`, format below). The short text is the work — see Writing rules.
5. **Render:** `node <skill dir>/scripts/render.mjs report.json [out.html]` → default `~/Downloads/storeleads-<slug>.html`
   (`--blocks` lists every block and field). An error names the block; fix the JSON and rerun.
6. **Deliver:** the file path, the headline of each page in one line each, and why any ⚠ appears (the renderer prints
   how many). Offer to open it. Don't paste the numbers again in chat.

## Document format

```json
{
  "title": "Đang thắng hay thua ở từng mảng?", "slug": "doi-thu", "lang": "vi",
  "eyebrow": "Hãng X · đối thủ theo từng mảng · StoreLeads 09/2026", "intro": "One sentence on how to read the whole report.",
  "pages": [
    { "id": "app-a", "short": "App A", "n": 1, "eyebrow": "Growth check · cho PM", "question": "Headline ≤ 12 words",
      "blocks": [ { "type": "verdict", "tone": "warn", "label": "Chưa chắc", "line": "…", "proof": "…" },
                  { "type": "kpis", "items": [ { "k": "Store đang dùng", "v": 1234, "s": "tháng 09/2026" } ] } ] }
  ],
  "caveats": ["Only the caveats that apply to THIS report."]
}
```
Numbers: give raw numbers; the renderer formats them (`vi`: 12.943 and 5,4%; `en`: 12,943 and 5.4%). A KPI value is a
number, a string (an app name), or `{ "n": 1.2, "fmt": "pct+" }` (int, num, pct, pct+, usd, x, star, bool, int+).
Percent formats take the PERCENT (19.0 → "19%"), never the ratio. Series: always the raw 24 monthly values (month 0…23).
Row shapes: `fanOut.rows` `{label, v, note}` · `netBars.rows` `{label, lost, won}` · table cell `{growth: {series}}`.

## Writing rules (from the approved rounds — they are why the report reads well)

- **Headline = what is happening**, ≤ 12 words, plain words: "Category đông lên, app đang mất chỗ đứng". Not a
  topic ("Phân tích Slide Cart").
- **Open each section with its question** (`ask`): "Ai đang cạnh tranh, và họ lớn hay nhỏ đi?", not "Đối thủ".
- **Every visual gets a `how`** line: what one bar/dot/ribbon is, what the colour means, the threshold if any.
- **Every number has its comparison**: "4,2% · hai năm trước 6,0%", "3,1% · mặt bằng Shopify 2,0%", "hạng 4/11" (illustrative numbers).
- **Moves = `do` ≤ 10 words + `why` with one number**: "Xin badge Built for Shopify — vì N trên M đối thủ đã có".
- No jargon or field names on the page (`dropped_app`, `m23`, `switch_to_index`, "12th"): say "gỡ app thật",
  "tháng 09/2026", "× bình thường", "12 tháng".
- Long analysis, if any, goes in a `details` block at the end of the page — never as paragraphs between visuals.
- Vietnamese by default (the team's language); English if the person writes in English (`"lang": "en"`).

## Data rules the renderer enforces (and you must explain)

- **12-month growth is robust**: 3-month median now vs the same 3 months a year ago — for the app AND the category.
  Pass series (`series`, `catSeries`), never s23/s11: one crawl spike in month 11 or 23 flips the conclusion.
- **⚠ = can't tell**: a series that doubles or halves in a month (crawl / attribution jumps) and never returns to its old
  level, or whose end months swing. Say why in the reply ("StoreLeads gán nhầm store giữa các app cùng hãng").
- **Monthly bars flag outlier months** (> 3× usual) automatically.
- **Same-job rivals only** in switching charts (popular apps like Klaviyo, Judge.me top every leaver list).
- **A vendor's own apps** are never rivals; their switching numbers are an artefact.
- Store lists: at most 100 rows; full lists → "DM Toàn (Thomas)". No outreach exports. Internal use only (StoreLeads ToS §2).
- The data: 24 monthly snapshots, Oct 2024 → Sep 2026, active Shopify stores. Nothing before Oct 2024.
