#!/usr/bin/env bash
# StoreLeads cho Claude — cài bằng một dòng:
#   curl -fsSL https://raw.githubusercontent.com/pdtoan2811-bit/storeleads-plugin/main/install.sh | bash
# Without a keyboard prompt (run inside Claude Code, Orca, CI): pass the token as an argument —
#   curl -fsSL …/install.sh | bash -s -- <token>
# (an argument survives where an env var named *TOKEN* may be stripped by a sandbox).
# Script sẽ hỏi token (nhắn Toàn hoặc Đức để xin). Chạy lại bất cứ lúc nào để đổi token hoặc sửa cài đặt.
# Source: qikifyStoreLeadsKnowledge/plugin/install.sh (copied by npm run plugin:build) — edit there.
set -euo pipefail

REPO="${STORELEADS_REPO:-pdtoan2811-bit/storeleads-plugin}"   # STORELEADS_REPO=owner/repo#branch for testing
GRAFANA="https://storedata.ecvision.ai"
say() { printf '\033[1m%s\033[0m\n' "$*"; }
die() { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

command -v claude >/dev/null || die "Chưa có Claude Code. Cài trước: https://claude.com/claude-code rồi chạy lại dòng này."
command -v git >/dev/null || die "Máy chưa có git. Trên Mac: chạy 'xcode-select --install', xong chạy lại dòng này."

# 1 · token: first argument, else STORELEADS_TOKEN, else ask (read from the terminal, since stdin is this script)
TOKEN="${1:-${STORELEADS_TOKEN:-}}"
if [ -z "$TOKEN" ]; then
  { : </dev/tty; } 2>/dev/null || die "Không có bàn phím để hỏi token (đang chạy trong Claude/Orca?). Dán token vào cuối lệnh:
  curl -fsSL https://raw.githubusercontent.com/pdtoan2811-bit/storeleads-plugin/main/install.sh | bash -s -- <token>"
  printf 'Dán token Grafana StoreLeads (bắt đầu bằng glsa_), rồi Enter: '
  IFS= read -rs TOKEN </dev/tty; echo
fi
TOKEN="$(printf '%s' "$TOKEN" | tr -d '[:space:]')"
[ -n "$TOKEN" ] || die "Chưa có token."
code="$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $TOKEN" "$GRAFANA/api/search?limit=1" || true)"
[ "$code" = "200" ] || die "Token không dùng được (Grafana trả $code). Kiểm tra lại hoặc xin token mới."
say "✓ Token hợp lệ"

# 2 · uv (runs the Grafana connector)
if ! command -v uvx >/dev/null && [ ! -x "$HOME/.local/bin/uvx" ]; then
  say "… Cài uv"
  curl -LsSf https://astral.sh/uv/install.sh | sh >/dev/null 2>&1 || die "Cài uv không được. Thử: brew install uv"
fi
say "✓ uv"
UVX="$(command -v uvx || echo "$HOME/.local/bin/uvx")"
mkdir -p "$HOME/.claude" && printf '%s\n' "$UVX" > "$HOME/.claude/storeleads-uvx"   # the MCP wrapper reads this: apps like Orca start Claude without a shell PATH
say "… Tải kết nối Grafana (lần đầu có thể mất 1–2 phút)"
"$UVX" mcp-grafana@2.0.1 --version >/dev/null 2>&1 || die "Tải kết nối Grafana không được. Kiểm tra mạng rồi chạy lại dòng cài."
say "✓ Kết nối Grafana sẵn sàng"

say "✓ Claude Code $(claude --version 2>/dev/null | head -1 | cut -d' ' -f1)"

# 4 · plugin (public repo → HTTPS, no GitHub account needed)
export CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1
if claude plugin marketplace list 2>/dev/null | grep -q "${REPO%%#*}"; then
  claude plugin marketplace update qikify >/dev/null 2>&1 || true
else
  claude plugin marketplace add "$REPO" >/dev/null || die "Không thêm được nguồn plugin từ GitHub."
fi
claude plugin install storeleads@qikify >/dev/null 2>&1 || true
claude plugin update storeleads@qikify >/dev/null 2>&1 || true   # install is a no-op when already installed
claude plugin enable storeleads@qikify >/dev/null 2>&1 || true
say "✓ Plugin StoreLeads đã cài"

# 5 · settings (~/.claude/settings.json): the token + uvx path as env vars the plugin's connector reads (works on every
# Claude Code version and channel; `claude plugin configure` needs 2.1.285+), a 2-min MCP start window, and pre-approval
# of only this plugin's skill, read-only Grafana tool, its own files and report pages ~/Downloads/storeleads-*.
SETTINGS="$HOME/.claude/settings.json"
PY="python3"; python3 -c 1 >/dev/null 2>&1 || PY="$(dirname "$UVX")/uv run --no-project --quiet python"
STORELEADS_TOKEN_VALUE="$TOKEN" STORELEADS_UVX_VALUE="$UVX" $PY - "$SETTINGS" <<'PYCODE' || die "Không ghi được cài đặt vào ~/.claude/settings.json. Nhắn Toàn kèm ảnh chụp màn hình này."
import json, os, sys
p = sys.argv[1]
s = json.load(open(p)) if os.path.exists(p) and os.path.getsize(p) else {}
env = s.setdefault("env", {})
env["STORELEADS_GRAFANA_TOKEN"] = os.environ["STORELEADS_TOKEN_VALUE"]
env["STORELEADS_UVX"] = os.environ["STORELEADS_UVX_VALUE"]
env.setdefault("MCP_TIMEOUT", "120000")
allow = s.setdefault("permissions", {}).setdefault("allow", [])
for r in ["Skill(storeleads:*)", "mcp__plugin_storeleads_grafana", "Read(~/.claude/plugins/**)", "Edit(~/Downloads/storeleads-*)"]:
    if r not in allow: allow.append(r)
allow[:] = [r for r in allow if r != "Write(~/Downloads/storeleads-*)"]   # an earlier, ineffective form
os.makedirs(os.path.dirname(p), exist_ok=True)
json.dump(s, open(p, "w"), indent=2, ensure_ascii=False)
os.chmod(p, 0o600)
PYCODE
say "✓ Token và quyền đã lưu vào cài đặt Claude Code"

echo
say "Xong! Mở lại Claude Code (gõ: claude) và hỏi thử:"
echo "  Klaviyo đang có bao nhiêu store, bao nhiêu % là Shopify Plus?"
echo
echo "Hướng dẫn: https://github.com/${REPO%%#*}#readme · Plugin tự cập nhật mỗi ngày."
