#!/usr/bin/env bash
# Start the team Grafana MCP (read-only flags). Finds uvx even when Claude Code's PATH misses ~/.local/bin or Homebrew.
for d in "" "$HOME/.local/bin/" "/opt/homebrew/bin/" "/usr/local/bin/" "$HOME/.cargo/bin/"; do
  if command -v "${d}uvx" >/dev/null 2>&1; then
    exec "${d}uvx" mcp-grafana --enabled-tools search,datasource,dashboard,folder,navigation,sql --disable-write --enable-query
  fi
done
echo "uvx not found — run the StoreLeads installer again (it installs uv)" >&2
exit 1
