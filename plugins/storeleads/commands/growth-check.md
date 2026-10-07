---
description: App này tăng hay giảm (StoreLeads)
allowed-tools: Skill, Read, mcp__plugin_storeleads_grafana
argument-hint: <app name>
---

Use the storeleads-grafana skill (use case `app-growth` in its references/use-cases.md).

Subject: $ARGUMENTS

Task: Month-by-month stores (all + Plus), percent change over the window; flag crawl artefacts inside it.

Run recipes 0, 1 from the skill (recipe 0 first: resolve the app; if the name is ambiguous, ask which one).
If the subject is empty, ask for it in one short question. Otherwise never stop to ask: if a name fits several apps,
take the one with the most stores, say so in one line, and go on. Run every recipe listed; if one fails or you
skip it, say which. The audience is a teammate at Qikify / Ownego: no personal or project context beyond this data.

Answer in the language the person writes in, in plain words for a non-technical reader. Quote numbers exactly as the
queries return them, with the snapshot (Sep 2026). Say these caveats where they apply:
- "Now" is the latest snapshot (month 23, Sep 2026); "last N days" counts back from 2026-09-27.
- Crawl artefacts: Plus dips Feb 2025 / Feb 2026, store jump Nov 2025, some app spikes Sep 2026 — flag them.
- No data before Oct 2024 — say so, never extrapolate.

End with a link to the dashboard: https://storedata.ecvision.ai/d/sl-app-growth and offer to turn the answer into one shareable HTML page.
