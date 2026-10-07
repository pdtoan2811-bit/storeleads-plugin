#!/usr/bin/env bash
# SessionStart: at most once a day, pull the latest StoreLeads plugin in the background (applies next session).
# Replaces the "Enable auto-update" menu step, which has no CLI flag. Prints nothing: SessionStart output enters context.
# Every session: if the pinned Grafana connector isn't cached yet, fetch it in the background, so a teammate who
# installed before the installer pre-downloaded it never waits on a 15 MB download inside the 30 s MCP start window.
PKG="mcp-grafana@2.0.1"
for c in "$(cat "$HOME/.claude/storeleads-uvx" 2>/dev/null)" "$(command -v uvx 2>/dev/null)" "$HOME/.local/bin/uvx" /opt/homebrew/bin/uvx /usr/local/bin/uvx; do
  if [ -n "$c" ] && [ -x "$c" ]; then
    "$c" --offline "$PKG" --version >/dev/null 2>&1 || ( "$c" "$PKG" --version >/dev/null 2>&1 </dev/null & )
    break
  fi
done

stamp="${CLAUDE_PLUGIN_DATA:-$HOME/.claude/plugins/data/storeleads-qikify}/last-update"
mkdir -p "$(dirname "$stamp")" 2>/dev/null
[ -f "$stamp" ] && [ -n "$(find "$stamp" -mmin -1440 2>/dev/null)" ] && exit 0
touch "$stamp"
CL=""
for c in "$(command -v claude 2>/dev/null)" "$HOME/.local/bin/claude" "$HOME/.claude/local/claude" /opt/homebrew/bin/claude /usr/local/bin/claude; do
  if [ -n "$c" ] && [ -x "$c" ]; then CL="$c"; break; fi
done
[ -n "$CL" ] || exit 0
( export CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1
  "$CL" plugin marketplace update qikify && "$CL" plugin update storeleads@qikify ) >/dev/null 2>&1 </dev/null &
disown 2>/dev/null
exit 0
