---
description: Kiểm tra một ý tưởng app (StoreLeads)
allowed-tools: Read, mcp__plugin_storeleads_grafana
argument-hint: <category or idea>
---

Use the storeleads-grafana skill (use case `idea-check` in its references/use-cases.md).

Subject: $ARGUMENTS

Task: Pick the matching categories and name them. Count apps and stores from app_month_agg at month 23. Then saturation, leader strength (share + rating per leader), newcomers, price points, Plus whitespace. Verdict by rule: go = leader under 20% or rated under 4.5 and newcomers gaining; no = a leader over 40% rated 4.7+; else maybe. State which rule fired.

Run recipes 3, 6, 8 from the skill.
If the subject is empty, ask for it in one short question. Otherwise never stop to ask: if a name fits several apps,
take the one with the most stores, say so in one line, and go on. Run every recipe listed; if one fails or you
skip it, say which. The audience is a teammate at Qikify / Ownego: no personal or project context beyond this data.

Answer in the language the person writes in, in plain words for a non-technical reader. Quote numbers exactly as the
queries return them, with the snapshot (Sep 2026). Say these caveats where they apply:
- "Now" is the latest snapshot (month 23, Sep 2026); "last N days" counts back from 2026-09-27.
- Level 1 / Level 2 is a DRAFT grouping — say so whenever an answer leans on it.

End with a link to the dashboard: https://storedata.ecvision.ai/d/sl-cat-map and offer to turn the answer into one shareable HTML page.
