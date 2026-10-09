#!/usr/bin/env bash
# SessionStart: check the Grafana token the connector will use, and say what to do ONLY when it is broken.
# Without this, a missing or revoked token surfaces as Grafana's bare "401 Invalid API key" mid-question.
# Runs in Git Bash on Windows too. Never prints the token. Silent on success and when offline.
URL="https://storedata.ecvision.ai/api/user"
MAC='curl -fsSL https://raw.githubusercontent.com/pdtoan2811-bit/storeleads-plugin/main/install.sh | bash'
WIN='irm https://raw.githubusercontent.com/pdtoan2811-bit/storeleads-plugin/main/install.ps1 | iex'
T="$(printf %s "${STORELEADS_GRAFANA_TOKEN:-}" | tr -d '[:space:]')"

if [ -z "$T" ]; then
  cat <<EOF
⚠ StoreLeads: Claude Code chưa nạp token Grafana (biến STORELEADS_GRAFANA_TOKEN trống), nên mọi câu hỏi dữ liệu sẽ báo "401 Invalid API key".
Hãy nói người dùng: nếu vừa cài hoặc cập nhật plugin, thoát HẲN Claude Code (Windows: Task Manager → kết thúc mọi tiến trình claude / Code / Claude) rồi mở lại. Vẫn vậy thì chạy lại lệnh cài — Mac: $MAC · Windows PowerShell: $WIN — và dán token Toàn (Thomas) gửi.
EOF
  exit 0
fi

code="$(curl -s -o /dev/null -w '%{http_code}' -m 5 -H "Authorization: Bearer $T" "$URL" 2>/dev/null)"
case "$code" in
  401|403) cat <<EOF
⚠ StoreLeads: token Grafana trên máy này không còn dùng được (Grafana trả $code), nên câu hỏi dữ liệu sẽ lỗi.
Hãy nói người dùng: xin token mới từ Toàn (Thomas), rồi chạy lại lệnh cài để dán token — Mac: $MAC · Windows PowerShell: $WIN — rồi thoát hẳn và mở lại Claude Code. Đừng dán token vào chat. Nếu còn biến STORELEADS_GRAFANA_TOKEN cũ trong Environment Variables của Windows hoặc trong file settings của project, xoá nó đi.
EOF
  ;;
esac
exit 0
