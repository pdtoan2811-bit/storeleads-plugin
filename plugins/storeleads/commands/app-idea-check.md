---
description: Kiểm tra một ý tưởng app (StoreLeads)
argument-hint: <category or idea>
---

Use the storeleads-grafana skill (use case `idea-check` in its references/use-cases.md).

Subject: $ARGUMENTS

Task: Pick the matching categories, then size, saturation, leader strength, newcomers, price points, Plus whitespace; end with a go/maybe/no verdict.

Run recipes 3, 6, 8 from the skill.
If the subject is empty, ask for it in one short question.

Answer in the language the person writes in, in plain words for a non-technical reader. Quote numbers exactly as the
queries return them, with the snapshot (Sep 2026). Say these caveats where they apply:
- "Now" is the latest snapshot (month 23, Sep 2026); "last N days" counts back from 2026-09-27.
- Level 1 / Level 2 is a DRAFT grouping — say so whenever an answer leans on it.

End with a link to the dashboard: https://storedata.ecvision.ai/d/sl-cat-map and offer to turn the answer into one shareable HTML page.
