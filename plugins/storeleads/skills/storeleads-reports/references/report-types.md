# The 10 report types

Each type = one page (or a set of pages) of blocks. Recipes are in `recipes.md`, blocks in `node scripts/render.mjs --blocks`.
"Write" = the short text the agent must write; every one carries a number from the queries. Order of blocks is the
approved order — keep it.

| # | Type | Question | For | Recipes |
|---|---|---|---|---|
| 1 | Competitor report | Are we winning or losing in each area, and against whom? | product + marketing | R0 R1 R2 R3 R5 R9 + listings |
| 2 | Growth check | Is the app growing or shrinking, and why? | the app's PM | R0 R1 R3 R4 |
| 3 | Category scan | Is this category heating up, and who is winning? | founder, PM | R1 R2 R3 |
| 4 | App idea check | Should we build in this category? | founder | R1 R2 R6 + leader listing |
| 5 | Churn post-mortem | Where do stores go after dropping the app? | PM, CS | R0 R4 R5 |
| 6 | Plus gap | How many Plus stores have no app in the category? | sales, marketing | R1 R6 |
| 7 | Geo expansion | Where is the app strong or thin? | marketing | R0 R7 |
| 8 | Stack & partnership | What else do the app's stores run? | BD, marketing | R0 R8 |
| 9 | Newcomer watch | Which new apps should we watch? | PM, founder | R1 R2 (newcomers) |
| 10 | Customer profile vs rivals | How do our customers differ from our rivals'? | marketing, sales | R0 R2 R9 |
| 11 | Portfolio scorecard | Which of our apps are falling behind their category? | founder, leads | R0 R1 R3 R10 |

Several types on one subject = one document with one page each (a "pack"); the renderer adds a table of contents.

---

## 1 · Competitor report (Scorecard + Battlecard)

For a VENDOR with several apps (e.g. "Qikify"), or one app. Pages:

**Overview page** (only with 2+ apps): `scoreTable` — one row per app: `area` (≤ 3 words), `stores`, `series` (24 months,
from R3) or `growth`, `catGrowth` (category installs 12-month %, R1), `share` (app stores ÷ category installs × 100),
`leader` + `leaderStores`, `href` to its page, and `catSeries` (24 category installs, R1) — never a single `catGrowth`
number unless you have no series. The table computes status (Vượt / Giữ nhịp / Tụt lại / Số chưa chắc / Còn
nhỏ) and the gap bar itself, and prints the legend. Then `how`.

**One page per app** (`id` = the href). Add `vsCategory` after the KPIs when the app's growth story matters.
1. `question` = the headline (write: ≤ 12 words, what is happening), `lede` = one sentence why (write).
2. `kpis` ×5: stores · share (with "two years ago: X") · rank ("on N apps of its kind") · category 12-month growth · % Plus.
3. `ask` "Ai đang cạnh tranh, và họ lớn hay nhỏ đi?" → `table`: rival · `{bar}` size · `{growth:{series}}` · stores lost to
   them (R5) · Built for Shopify · free plan; subject row first with `hi: true`. Then `how` (define "lấy khách").
4. `ask` "Qikify đấu với từng đối thủ" → `battlecard`: criteria (stores, % Plus, median store revenue, rating, reviews,
   cheapest paid plan `lowerWins`, Built for Shopify), one rival per tab with `lost`/`won` (R5 both ways) and
   `strength` / `weakness` (write: one or two sentences each, with numbers).
5. `ask` "Nên làm gì tiếp?" → `moves`: Sản phẩm / Định vị & giá / Marketing, 2–3 each, `do` ≤ 10 words + `why` with a number.
6. `details` "Đọc phân tích đầy đủ" for the long analysis, if any.

Choosing the 10 rivals: same job in the category set (leaders) + where the app's leavers went (R5, index > 1) + fast
risers/newcomers. A rival is "direct" (same job) or "adjacent" (overlapping suite). Fewer than 10 real ones → fewer.

## 11 · Portfolio scorecard (Thomas: "I love this one", 2026-10-09)
Every app of a vendor on one page, each against ITS OWN category. One page, `question` "N mảng, mảng nào đang tụt lại?",
blocks: `scoreTable` (subject = the vendor) → `how` (share = app stores ÷ category installs; click a name to jump).
Rows need, per app: `area` (≤ 3 words), `stores` (month 23), `series` (24, R3), `catSeries` (24, R10 — the app's
merged category set), `share`, `leader` + `leaderStores` (biggest app in the set, R2). Merge duplicate listings first (R0).
The table prints the status legend, computes status and the gap bar, and sorts by stores. Add `href` to rows only when the
document has a page with that `id` (as in the competitor report, where this is the overview page).

## 2 · Growth check
`verdict` (tone from the data: ⚠ "Chưa chắc" when the series jumps — the renderer shades those months) → `kpis` (stores now ·
real uninstalls 12 months · stores that left the data · category 12 months) → `ask` "X tăng nhanh hay chậm hơn cả
category?" + `vsCategory` (app series + catSeries: both indexed to 100, gap in points for 12 and 24 months) + `how` →
`ask` + `card[areaTrend]` + `how` →
`ask` "Store mất đi là do gỡ app hay do store đóng cửa?" + `card[monthBars]` (R4) + `how`.

## 3 · Category scan
`kpis` (installs, apps, growth, Plus — each with "12 tháng trước: X") → `lede` (write: what the KPIs mean together) →
`ask` "Ai đang nắm thị trường?" + `card[shareStack]` (top 5 + subject `hi` + `rest: true` part) + `how` (leader ≥ 20% = led,
< 20% = fragmented) → `ask` gainers/losers + `grid` of two `barList` (net store change 12 months, apps ≥ 300 stores,
`warn: true` where the series jumps) + `how`.

## 4 · App idea check
`scoreHead` (label + line + proof: write; pass/of computed) → `ask` + `meters` with these six, thresholds as default:
demand (category installs ≥ 50.000) · growth (category 12 months ≥ +10%) · fragmentation (leader share < 20%, lowerWins) ·
weak leader (leader rating < 4,5★, lowerWins) · Plus room (US Plus stores without an app ≥ 50%) · newcomer traction
(best newcomer ≥ 300 stores) → `how` → `ask` "Ai đang đứng sẵn ở đó?" + `appCards` (top 5: stores, rating · reviews, price).

## 5 · Churn post-mortem
`kpis` (droppers 24 months · moved to same-job apps · top destination) → `ask` + `card[fanOut]` (8 same-job destinations,
note "N× bình thường") + `how` (name the popular non-rival apps in one line) → `ask` "Tính cả hai chiều" + `card[netBars]`
(same rows, same order) + `how`.

## 6 · Plus gap
`grid`: `bigNumber` (sum of `without_one` over the top 10 countries + base) | `card[barList]` (country, `without_one`, note
pill "% chưa có") → `how` with the licence line: lists capped at 100 rows, full list = "DM Toàn (Thomas)", internal only.

## 7 · Geo expansion
`ask` + `card[indexBars]` (top 10 countries by stores, note "N store") + `how` → `ask` share by country + `card[barList]`
(`fmt: "pct"`, note "app / category installs") + `how`.

## 8 · Stack & partnership
`ask` + `card[barList]` (`fmt: "pct"`, share of stack; note = lift pill text "2,4× thường") + `how` (≥ 2× = a real pair; own
apps removed) → `ask` partners + `appCards` (top 3 by lift with ≥ 100 shared stores: big = lift, sub = stores · category).

## 9 · Newcomer watch
`lede` (write: name the fastest and what it means) → `appCards` (badge "Ra mắt N tháng trước", big = stores, sub = "≈ N
store mới mỗi tháng · N store Plus", tags rating / "Từ $X/tháng" / "Chưa có đánh giá") → `ask` "Mỗi tháng có thêm bao nhiêu
store?" + `card[barList]` (stores ÷ months since listed, sorted, fastest `hi`) + `how`.

## 10 · Customer profile vs rivals
`kpis` (share of stores ≥ $10k/month with "hạng N/M" · median store revenue · % Plus · apps per store) → `ask` "Ai đang giữ
khách lớn?" + `card[mixBars]` (subject + rivals, subject `hi`) + `how` → `grid` of two `barList`: % Plus and median store
revenue (`fmt: "usd"`), subject `hi` → `how`.
