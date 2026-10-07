#!/usr/bin/env bash
# StoreLeads cho Claude — cài bằng một dòng:
#   curl -fsSL https://raw.githubusercontent.com/pdtoan2811-bit/storeleads-plugin/main/install.sh | bash
# Script sẽ hỏi token (nhắn Toàn hoặc Đức để xin). Chạy lại bất cứ lúc nào để đổi token hoặc sửa cài đặt.
# Source: qikifyStoreLeadsKnowledge/plugin/install.sh (copied by npm run plugin:build) — edit there.
set -euo pipefail

REPO="${STORELEADS_REPO:-pdtoan2811-bit/storeleads-plugin}"   # STORELEADS_REPO=owner/repo#branch for testing
GRAFANA="https://storedata.ecvision.ai"
say() { printf '\033[1m%s\033[0m\n' "$*"; }
die() { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

command -v claude >/dev/null || die "Chưa có Claude Code. Cài trước: https://claude.com/claude-code rồi chạy lại dòng này."
command -v git >/dev/null || die "Máy chưa có git. Trên Mac: chạy 'xcode-select --install', xong chạy lại dòng này."

# 1 · token: STORELEADS_TOKEN if set, otherwise ask (read from the terminal, since stdin is this script)
TOKEN="${STORELEADS_TOKEN:-}"
if [ -z "$TOKEN" ]; then
  [ -r /dev/tty ] || die "Không hỏi được token. Chạy: STORELEADS_TOKEN=<token> bash install.sh"
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

# 3 · plugin (public repo → HTTPS, no GitHub account needed)
export CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1
if claude plugin marketplace list 2>/dev/null | grep -q "${REPO%%#*}"; then
  claude plugin marketplace update qikify >/dev/null 2>&1 || true
else
  claude plugin marketplace add "$REPO" >/dev/null || die "Không thêm được nguồn plugin từ GitHub."
fi
claude plugin install storeleads@qikify >/dev/null 2>&1 || true
claude plugin update storeleads@qikify >/dev/null 2>&1 || true   # install is a no-op when already installed
claude plugin enable storeleads@qikify >/dev/null 2>&1 || true
printf '{"grafana_token":"%s"}' "$TOKEN" | claude plugin configure storeleads@qikify --values-stdin >/dev/null \
  || die "Lưu token không được. Nhắn Toàn kèm ảnh chụp màn hình này."
say "✓ Plugin StoreLeads đã cài, token lưu trong keychain"

# 4 · pre-approve only this plugin's skill, its read-only Grafana tool, reading its own files and writing report pages
# named ~/Downloads/storeleads-*, so non-technical
# users never meet a permission prompt. Other permissions are left exactly as they were.
SETTINGS="$HOME/.claude/settings.json"
if command -v python3 >/dev/null; then
  python3 - "$SETTINGS" <<'PY' || echo "  (bỏ qua bước cấp quyền — Claude Code sẽ hỏi quyền lần đầu, cứ chọn Yes)"
import json, os, sys
p = sys.argv[1]
s = json.load(open(p)) if os.path.exists(p) and os.path.getsize(p) else {}
allow = s.setdefault("permissions", {}).setdefault("allow", [])
for r in ["Skill(storeleads:*)", "mcp__plugin_storeleads_grafana", "Read(~/.claude/plugins/**)", "Write(~/Downloads/storeleads-*)"]:
    if r not in allow: allow.append(r)
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
