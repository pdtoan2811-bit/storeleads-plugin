# Report recipes — the queries behind every report

Run each with the Grafana MCP tool `query_sql`, datasource uid `storeleads-ch`, database `slim` (read-only).
Replace the values in CAPS. **Pass `limit`** (max 1000): the tool appends `LIMIT 100` by default and cuts silently —
24 months × several apps needs more. Let SQL do every sum (totals, KPIs that add rows), never add by hand. Months are 0–23 (0 = Oct 2024, 23 = Sep 2026, the latest). Always alias CTE columns
explicitly (`l.store_id AS store_id`) or ClickHouse reports "correlated subquery". All tested on 2026-10-07/08.

## R0 · Resolve the subject

App(s) by name, or every app of a vendor:
```sql
SELECT d.app_id, d.app_key, d.name, d.vendor_name, d.primary_category, sum(a.stores) AS stores_now
FROM slim.app_dim d LEFT JOIN slim.app_month_agg a ON a.app_id = d.app_id AND a.month = 23
WHERE d.name ILIKE '%NAME%' OR d.vendor_name ILIKE '%NAME%' GROUP BY 1,2,3,4,5 ORDER BY stores_now DESC LIMIT 30
```
- Two listings with almost the same stores are often ONE app re-listed: check overlap
  (`SELECT count() … WHERE store_id IN (other app's stores)`) and keep the bigger key.
- An app's listing URL = `https://apps.shopify.com/` + app_key without the `1.` prefix (it can 404 after a re-list).

## R1 · The category set (old + new names)

Shopify renamed categories; older apps sit under OLD names that hold ~200 apps (`popups`, `language and translation`,
`upselling and cross-selling`), newer ones under the current name (`pop-ups`, `currency and translation`,
`upsell and cross-sell`). **Always merge an app's primary category with its siblings**, or the real rivals vanish:
```sql
SELECT d.primary_category AS cat, count() AS apps, sum(a.stores) AS installs
FROM slim.app_dim d JOIN slim.app_month_agg a ON a.app_id = d.app_id AND a.month = 23
WHERE match(d.primary_category, '(?i)WORD1|WORD2') GROUP BY cat ORDER BY installs DESC
```
Run it with 2–4 words of the JOB (cart drawer → `cart|drawer`; contact form → `form|contact`), look at the result and keep
the names that mean the same job (cart drawer = `cart customization`, `cart modification`, `add to cart`). Call this list CATS.
A sibling can be tiny (a few dozen installs) — fine. **Some big rivals sit outside CATS** (Shopify Forms is under `email marketing`):
after R5, add same-job apps from the leavers' list to a RIVALS list by hand and say so in the caveats.

Category totals, now / 12 months ago / 24 months ago:
```sql
SELECT a.month AS month, sum(a.stores) AS installs, sumIf(a.stores, a.is_plus = 1) AS plus, uniqExact(a.app_id) AS apps
FROM slim.app_month_agg a JOIN slim.app_dim d ON d.app_id = a.app_id
WHERE d.primary_category IN (CATS) AND a.month IN (0, 11, 23) GROUP BY month ORDER BY month
```

## R2 · Apps in the set: size, growth inputs, listing facts

```sql
SELECT d.app_key, d.name, d.vendor_name, d.primary_category, toString(d.created_at) AS listed,
  sumIf(a.stores, a.month = 23) AS s23, sumIf(a.stores, a.month = 11) AS s11, sumIf(a.stores, a.month = 0) AS s0,
  sumIf(a.stores, a.month = 23 AND a.is_plus = 1) AS plus23, any(m.average_rating) AS rating, any(m.review_count) AS reviews,
  any(m.min_price_cents) / 100 AS min_price, any(m.max_price_cents) / 100 AS max_price
FROM slim.app_month_agg a JOIN slim.app_dim d ON d.app_id = a.app_id
LEFT JOIN (SELECT * FROM slim.app_month WHERE month = 23) m ON m.app_id = d.app_id
WHERE d.primary_category IN (CATS) GROUP BY 1,2,3,4,5 ORDER BY s23 DESC LIMIT 40
```
Newcomers: add `AND d.created_at >= toDate('2025-09-27')` and `HAVING s23 >= 50`.

## R3 · Monthly series (24 values per app)

```sql
SELECT d.app_key, a.month, sum(a.stores) AS s, sumIf(a.stores, a.is_plus = 1) AS p
FROM slim.app_month_agg a JOIN slim.app_dim d ON d.app_id = a.app_id
WHERE d.app_key IN ('KEY1','KEY2') GROUP BY 1, 2 ORDER BY 1, 2
```
Give the renderer the raw 24 values (`series`): it computes robust growth and the ⚠ itself. Never compute
"12-month growth" as s23/s11 for a table — one crawl spike in month 11 or 23 makes it absurd (a five-digit % has happened).

## R4 · Churn per month: real uninstalls vs stores leaving the data

```sql
WITH (SELECT app_id FROM slim.app_dim WHERE app_key = 'KEY') AS a,
  l AS (SELECT store_id, bitAnd(bitAnd(bitShiftLeft(months, 1), bitNot(months)), 16777214) AS lost FROM slim.store_app WHERE app_id = a AND lost != 0),
  la AS (SELECT l.store_id AS store_id, l.lost AS lost, sd.active_months AS act FROM l JOIN slim.store_dim sd ON sd.store_id = l.store_id)
SELECT m AS month, countIf(bitTest(lost, m) AND bitTest(act, m)) AS dropped_app, countIf(bitTest(lost, m) AND NOT bitTest(act, m)) AS store_left_data
FROM la ARRAY JOIN range(1, 24) AS m GROUP BY month ORDER BY month
```
`monthBars` takes `a` = dropped_app, `b` = store_left_data (23 values, month 1…23, `startMonth: 1`).

## R5 · Switching: where droppers went, where new users came from

```sql
WITH l AS (SELECT store_id, bitAnd(bitAnd(bitShiftLeft(months, 1), bitNot(months)), 16777214) AS lost FROM slim.store_app WHERE app_id IN (APP_IDS)),
  dm AS (SELECT l.store_id AS store_id, bitAnd(l.lost, sd.active_months) AS dmask FROM l JOIN slim.store_dim sd ON sd.store_id = l.store_id
         WHERE l.lost != 0 AND bitAnd(l.lost, sd.active_months) != 0)
SELECT d.app_key, any(d.name) AS name, any(d.primary_category) AS cat, count() AS stores
FROM slim.store_app o JOIN dm ON o.store_id = dm.store_id JOIN slim.app_dim d ON d.app_id = o.app_id
WHERE o.app_id NOT IN (APP_IDS) AND bitAnd(bitAnd(o.months, bitNot(bitShiftLeft(o.months, 1))), bitOr(dm.dmask, bitShiftLeft(dm.dmask, 1))) != 0
GROUP BY d.app_key ORDER BY stores DESC LIMIT 60
```
Same-job only (what the charts use): add `AND (d.primary_category IN (CATS) OR d.app_key IN (RIVALS))` to the WHERE.
Total droppers: `WITH … SELECT count() FROM dm`.

**Sources** — stores that ADDED the app and dropped X the same or next month (the "won from them" side):
```sql
WITH ad AS (SELECT s.store_id AS store_id, bitAnd(bitAnd(bitAnd(s.months, bitNot(bitShiftLeft(s.months, 1))), 16777214), sd.active_months) AS amask
            FROM slim.store_app s JOIN slim.store_dim sd ON sd.store_id = s.store_id WHERE s.app_id IN (APP_IDS) AND amask != 0)
SELECT d.app_key, any(d.name) AS name, any(d.primary_category) AS cat, count() AS stores
FROM slim.store_app o JOIN ad ON o.store_id = ad.store_id JOIN slim.app_dim d ON d.app_id = o.app_id
WHERE o.app_id NOT IN (APP_IDS) AND bitAnd(bitAnd(bitAnd(bitShiftLeft(o.months, 1), bitNot(o.months)), 16777214), bitOr(ad.amask, bitShiftLeft(ad.amask, 1))) != 0
GROUP BY d.app_key ORDER BY stores DESC LIMIT 60
```

**"× bình thường"** (how much more than a random store a leaver picks X) =
`(stores ÷ droppers) ÷ (X's adds over months 1–23 × 2 ÷ 23 ÷ active stores)`. The denominator is the chance that any
active store ADDS X within a two-month window (X's install RATE, not its installed base — big old apps have a large base
but few new installs). X's adds: `SELECT sumIf(adds, month BETWEEN 1 AND 23) FROM slim.app_month_agg WHERE app_id = X`;
active stores: `SELECT countIf(bitTest(active_months, 23)) FROM slim.store_dim`. Compute it in SQL.
- **Keep only same-job apps** (in CATS or chosen rivals). Popular apps (Klaviyo, Judge.me, Loox, PageFly) top every
  list because leavers rebuild their store: mention them in one line, never rank them as rivals.
- **Own-vendor artefact:** a vendor's other apps can show up as huge sources/destinations (StoreLeads swapping stores
  between apps that share a script). Never call them competitors; flag it.

## R6 · Plus gap: Plus stores with no app in the category, by country

```sql
WITH has_c AS (SELECT DISTINCT store_id FROM slim.store_app WHERE leaf IN (CATS) AND bitTest(months, 23))
SELECT country_code AS cc, count() AS plus_stores, countIf(store_id NOT IN has_c) AS without_one
FROM slim.store_dim WHERE bitTest(plus_months, 23) AND country_code != '' GROUP BY cc ORDER BY plus_stores DESC LIMIT 12
```

## R7 · Geo: reach index vs the platform, and share in the category by country

```sql
WITH (SELECT app_id FROM slim.app_dim WHERE app_key = 'KEY') AS a,
  plat AS (SELECT country_code, countIf(bitTest(active_months, 23)) AS n_all FROM slim.store_dim GROUP BY country_code),
  me AS (SELECT country_code, sum(stores) AS n FROM slim.app_month_agg WHERE app_id = a AND month = 23 GROUP BY country_code),
  (SELECT sum(n) FROM me) / (SELECT sum(n_all) FROM plat) AS rate
SELECT country_code AS cc, me.n AS stores, me.n / plat.n_all / rate AS idx
FROM me JOIN plat USING country_code WHERE country_code != '' ORDER BY stores DESC LIMIT 12
```
Share by country: `sum(stores)` of the app ÷ `sum(stores)` of every app in CATS, `GROUP BY country_code`, month 23.

## R8 · Stack: what the app's stores also run, with lift

```sql
WITH coh AS (SELECT store_id FROM slim.store_app WHERE app_id = (SELECT app_id FROM slim.app_dim WHERE app_key = 'KEY') AND bitTest(months, 23)),
  (SELECT count() FROM coh) AS n, (SELECT countIf(bitTest(active_months, 23)) FROM slim.store_dim) AS act
SELECT s.app_id, any(d.name) AS name, any(d.primary_category) AS category, count() AS stores, 100 * stores / n AS share_pct,
  (stores / n) / ((SELECT sum(stores) FROM slim.app_month_agg WHERE month = 23 AND app_id = s.app_id) / act) AS lift
FROM slim.store_app s JOIN slim.app_dim d ON d.app_id = s.app_id
WHERE s.store_id IN coh AND bitTest(s.months, 23) GROUP BY s.app_id ORDER BY stores DESC LIMIT 26
```
Drop the subject itself and the vendor's own apps. Lift ≥ 2 = a real pair.

## R9 · Customer profile: revenue tiers, Plus, apps per store — for the app AND its rivals

```sql
SELECT ad.app_key AS key, any(ad.name) AS name, count() AS n,
  countIf(sd.estimated_sales < 100000) AS t1, countIf(sd.estimated_sales >= 100000 AND sd.estimated_sales < 1000000) AS t2,
  countIf(sd.estimated_sales >= 1000000 AND sd.estimated_sales < 10000000) AS t3, countIf(sd.estimated_sales >= 10000000) AS t4,
  countIf(bitTest(sd.plus_months, 23)) AS plus, quantileExact(0.5)(sd.estimated_sales) / 100 AS med_usd, avg(length(sd.apps_now)) AS apps
FROM slim.store_app s JOIN slim.store_dim sd ON sd.store_id = s.store_id JOIN slim.app_dim ad ON ad.app_id = s.app_id
WHERE ad.app_key IN ('KEY','RIVAL1','RIVAL2') AND bitTest(s.months, 23) AND bitTest(sd.active_months, 23) GROUP BY key ORDER BY n DESC
```
`estimated_sales` is cents/month: t1 < $1k, t2 $1k–10k, t3 $10k–100k, t4 ≥ $100k. `apps_now` is an array — use `length()`.

## Listing facts (not in the data)

Pricing plans, free plan, rating + reviews shown, "Built for Shopify" badge, tagline, 4–6 key features: read the App
Store page (WebFetch; it rate-limits — fetch 2 at a time, retry after a pause). A page that fails → `null`, never a guess.
