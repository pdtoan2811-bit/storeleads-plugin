#!/usr/bin/env bash
# Start the team Grafana MCP (read-only flags). Finds uvx even when the app that launched Claude Code (Orca, an IDE,
# the Dock) gave it no shell PATH. Pinned version + offline start when cached, so startup never downloads: a first
# download (uv may fetch Python too) can outlast Claude Code's 30 s MCP start timeout. install.sh pre-downloads it.
PKG="mcp-grafana@2.0.1"
FLAGS=(--enabled-tools search,datasource,dashboard,folder,navigation,sql --disable-write --enable-query)
# where uvx is: the path install.sh saved, the usual places, then whatever a login shell knows
UVX=""
for c in "$(cat "$HOME/.claude/storeleads-uvx" 2>/dev/null)" "$(command -v uvx 2>/dev/null)" "$HOME/.local/bin/uvx" \
         /opt/homebrew/bin/uvx /usr/local/bin/uvx "$HOME/.cargo/bin/uvx" \
         "$(zsh -lic 'command -v uvx' 2>/dev/null | tail -1)" "$(bash -lc 'command -v uvx' 2>/dev/null | tail -1)"; do
  if [ -n "$c" ] && [ -x "$c" ]; then UVX="$c"; break; fi
done
if [ -n "$UVX" ]; then
  if "$UVX" --offline "$PKG" --version >/dev/null 2>&1; then exec "$UVX" --offline "$PKG" "${FLAGS[@]}"; fi
  exec "$UVX" "$PKG" "${FLAGS[@]}"
fi
echo "uvx not found — run the StoreLeads installer again (it installs uv)" >&2
exit 1
