#!/usr/bin/env bash
# SessionStart: at most once a day, pull the latest StoreLeads plugin in the background (applies next session).
# Replaces the "Enable auto-update" menu step, which has no CLI flag. Prints nothing: SessionStart output enters context.
stamp="${CLAUDE_PLUGIN_DATA:-$HOME/.claude/plugins/data/storeleads-qikify}/last-update"
mkdir -p "$(dirname "$stamp")" 2>/dev/null
[ -f "$stamp" ] && [ -n "$(find "$stamp" -mmin -1440 2>/dev/null)" ] && exit 0
touch "$stamp"
( export CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1
  claude plugin marketplace update qikify && claude plugin update storeleads@qikify ) >/dev/null 2>&1 </dev/null &
disown 2>/dev/null
exit 0
