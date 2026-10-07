---
description: Khoảng trống Shopify Plus (StoreLeads)
allowed-tools: Skill, Read, Write(~/Downloads/storeleads-*), mcp__plugin_storeleads_grafana
argument-hint: <category or idea>
---

Use the storeleads-grafana skill (use case `plus-gap` in its references/use-cases.md).

Subject: $ARGUMENTS

Task: Plus stores with no app in the category, by country. Counts only — no lists for outreach.

Run recipes 6 from the skill.
If the subject is empty, ask for it in one short question. Otherwise never stop to ask: if a name fits several apps,
take the one with the most stores, say so in one line, and go on. Run every recipe listed, every query in it; if one fails or
you skip it, say which in one line. The audience is a teammate at Qikify / Ownego: no personal or project context beyond this data.

Answer in the language the person writes in, in plain words for a non-technical reader. Quote numbers exactly as the
queries return them, with the snapshot (Sep 2026). Say these caveats where they apply:
- "Now" is the latest snapshot (month 23, Sep 2026); "last N days" counts back from 2026-09-27.
- Internal analysis only (StoreLeads ToS §2); store lists capped, never for outreach.

End with a link to the dashboard: https://storedata.ecvision.ai/d/sl-cat-geo and offer to turn the answer into one shareable HTML page.
