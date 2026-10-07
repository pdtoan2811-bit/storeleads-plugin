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

# 3 · Claude Code must be new enough to save plugin settings (`claude plugin configure`); update it if not
if ! claude plugin configure --help >/dev/null 2>&1; then
  say "… Cập nhật Claude Code (bản trên máy quá cũ)"
  claude update >/dev/null 2>&1 || true
  hash -r 2>/dev/null
  claude plugin configure --help >/dev/null 2>&1 || die "Claude Code quá cũ và tự cập nhật không được. Chạy: claude update   (cài qua npm thì: npm i -g @anthropic-ai/claude-code@latest), rồi chạy lại dòng cài."
fi
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
printf '{"grafana_token":"%s","uvx_path":"%s"}' "$TOKEN" "$UVX" | claude plugin configure storeleads@qikify --values-stdin >/dev/null \
  || die "Lưu token không được. Nhắn Toàn kèm ảnh chụp màn hình này."
say "✓ Plugin StoreLeads đã cài, token lưu trong keychain"

# 5 · pre-approve only this plugin's skill, its read-only Grafana tool, reading its own files and writing report pages
# named ~/Downloads/storeleads-*, so non-technical
# users never meet a permission prompt. Other permissions are left exactly as they were.
SETTINGS="$HOME/.claude/settings.json"
if command -v python3 >/dev/null; then
  python3 - "$SETTINGS" <<'PY' || echo "  (bỏ qua bước cấp quyền — Claude Code sẽ hỏi quyền lần đầu, cứ chọn Yes)"
import json, os, sys
p = sys.argv[1]
s = json.load(open(p)) if os.path.exists(p) and os.path.getsize(p) else {}
allow = s.setdefault("permissions", {}).setdefault("allow", [])
s.setdefault("env", {}).setdefault("MCP_TIMEOUT", "120000")   # slow machines / networks: wait up to 2 min for MCP start
for r in ["Skill(storeleads:*)", "mcp__plugin_storeleads_grafana", "Read(~/.claude/plugins/**)", "Edit(~/Downloads/storeleads-*)"]:
    if r not in allow: allow.append(r)
allow[:] = [r for r in allow if r != "Write(~/Downloads/storeleads-*)"]   # an earlier, ineffective form
os.makedirs(os.path.dirname(p), exist_ok=True)
json.dump(s, open(p, "w"), indent=2, ensure_ascii=False)
PY
  say "✓ Đã cho phép plugin chạy không cần hỏi"
fi

echo
say "Xong! Mở lại Claude Code (gõ: claude) và hỏi thử:"
echo "  Klaviyo đang có bao nhiêu store, bao nhiêu % là Shopify Plus?"
echo
echo "Hướng dẫn: https://github.com/${REPO%%#*}#readme · Plugin tự cập nhật mỗi ngày."
