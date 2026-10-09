---
description: Báo cáo HTML chia sẻ được (StoreLeads)
allowed-tools: Skill, Read, Write, WebFetch, Bash(node *render.mjs*), mcp__plugin_storeleads_grafana
argument-hint: <loại báo cáo> <app, hãng hoặc category>
---

Use the storeleads-reports skill (and the storeleads-grafana skill for the data rules).

Ask: $ARGUMENTS

If the ask is empty, ask in one short question what the report is about and list the eleven report types. Otherwise pick the
report type(s) from the skill's table, run every recipe it needs, write the document and render it with the skill's
scripts/render.mjs. Reply with the file path, one line per page headline, and why any ⚠ appears. Internal use only.
