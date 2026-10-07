---
description: Quét một category (StoreLeads)
allowed-tools: Read, mcp__plugin_storeleads_grafana
argument-hint: <category or idea>
---

Use the storeleads-grafana skill (use case `category-scan` in its references/use-cases.md).

Subject: $ARGUMENTS

Task: Category door end to end over the WHOLE scope (expand a Level 1 / Level 2 name to all its leaves via references/categories.md): momentum vs market, leaders, fragmentation, entrants, Plus whitespace, stacks. If the scope is incomplete, say so first.

Run recipes 6, 8 from the skill.
If the subject is empty, ask for it in one short question. Otherwise never stop to ask: if a name fits several apps,
take the one with the most stores, say so in one line, and go on. Run every recipe listed; if one fails or you
skip it, say which. The audience is a teammate at Qikify / Ownego: no personal or project context beyond this data.

Answer in the language the person writes in, in plain words for a non-technical reader. Quote numbers exactly as the
queries return them, with the snapshot (Sep 2026). Say these caveats where they apply:
- "Now" is the latest snapshot (month 23, Sep 2026); "last N days" counts back from 2026-09-27.
- Level 1 / Level 2 is a DRAFT grouping — say so whenever an answer leans on it.
- Crawl artefacts: Plus dips Feb 2025 / Feb 2026, store jump Nov 2025, some app spikes Sep 2026 — flag them.

End with a link to the dashboard: https://storedata.ecvision.ai/d/sl-cat-momentum and offer to turn the answer into one shareable HTML page.
