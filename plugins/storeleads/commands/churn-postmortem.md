---
description: Post-mortem churn (StoreLeads)
allowed-tools: Read, mcp__plugin_storeleads_grafana
argument-hint: <app name>
---

Use the storeleads-grafana skill (use case `churn-postmortem` in its references/use-cases.md).

Subject: $ARGUMENTS

Task: Separate real drops from stores leaving; monthly drop rate; destinations by plan and country.

Run recipes 7 from the skill.
If the subject is empty, ask for it in one short question. Otherwise never stop to ask: if a name fits several apps,
take the one with the most stores, say so in one line, and go on. Run every recipe listed; if one fails or you
skip it, say which. The audience is a teammate at Qikify / Ownego: no personal or project context beyond this data.

Answer in the language the person writes in, in plain words for a non-technical reader. Quote numbers exactly as the
queries return them, with the snapshot (Sep 2026). Say these caveats where they apply:
- losses include stores that left the data; real uninstalls = recipe 7 dropped_app (store still active).
- Crawl artefacts: Plus dips Feb 2025 / Feb 2026, store jump Nov 2025, some app spikes Sep 2026 — flag them.

End with a link to the dashboard: https://storedata.ecvision.ai/d/sl-app-churn and offer to turn the answer into one shareable HTML page.
