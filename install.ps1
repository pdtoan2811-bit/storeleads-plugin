# StoreLeads cho Claude — cài trên Windows (PowerShell), một dòng:
#   irm https://raw.githubusercontent.com/pdtoan2811-bit/storeleads-plugin/main/install.ps1 | iex
# Script sẽ hỏi token (nhắn Toàn hoặc Đức để xin). Không có ô nhập (chạy trong Claude/Orca): truyền token vào —
#   & ([scriptblock]::Create((irm https://raw.githubusercontent.com/pdtoan2811-bit/storeleads-plugin/main/install.ps1))) <token>
# Không cần bash hay WSL. Source: qikifyStoreLeadsKnowledge/plugin/install.ps1 (copied by npm run plugin:build).
# Works on Windows PowerShell 5.1 and PowerShell 7. Never `exit` (irm | iex runs in the user's own shell): return.

function Install-StoreLeads {
  param([string]$Token)
  $Repo = 'pdtoan2811-bit/storeleads-plugin'
  $Grafana = 'https://storedata.ecvision.ai'
  $Pkg = 'mcp-grafana@2.0.1'
  function Say($m) { Write-Host $m -ForegroundColor Green }
  function Fail($m) { Write-Host "✗ $m" -ForegroundColor Red }

  if (-not (Get-Command claude -ErrorAction SilentlyContinue)) { Fail 'Chưa có Claude Code. Cài trước: https://claude.com/claude-code rồi chạy lại.'; return }
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Fail 'Máy chưa có Git. Cài Git for Windows (https://git-scm.com/download/win) rồi chạy lại.'; return }

  # 1 · token: argument, else STORELEADS_TOKEN, else ask (hidden input)
  if (-not $Token) { $Token = $env:STORELEADS_TOKEN }
  if (-not $Token) {
    try {
      $sec = Read-Host 'Dán token Grafana StoreLeads (bắt đầu bằng glsa_), rồi Enter' -AsSecureString
      $Token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
    } catch { Fail 'Không hỏi được token. Truyền token vào cuối lệnh (xem README).'; return }
  }
  $Token = ($Token -replace '\s', '')
  if (-not $Token) { Fail 'Chưa có token.'; return }
  try { Invoke-RestMethod -Uri "$Grafana/api/search?limit=1" -Headers @{ Authorization = "Bearer $Token" } -TimeoutSec 20 | Out-Null }
  catch { Fail 'Token không dùng được. Kiểm tra lại hoặc xin token mới.'; return }
  Say '✓ Token hợp lệ'

  # 2 · uv (runs the Grafana connector), then pre-download the pinned connector
  $uvx = (Get-Command uvx -ErrorAction SilentlyContinue).Source
  if (-not $uvx) {
    $uvx = Join-Path $HOME '.local\bin\uvx.exe'
    if (-not (Test-Path $uvx)) {
      Say '… Cài uv'
      powershell -NoProfile -ExecutionPolicy ByPass -Command 'irm https://astral.sh/uv/install.ps1 | iex' *> $null
    }
    if (-not (Test-Path $uvx)) { Fail 'Cài uv không được. Thử: winget install astral-sh.uv rồi chạy lại.'; return }
  }
  Say '✓ uv'
  Say '… Tải kết nối Grafana (lần đầu có thể mất 1–2 phút)'
  & $uvx $Pkg --version *> $null
  if ($LASTEXITCODE -ne 0) { Fail 'Tải kết nối Grafana không được. Kiểm tra mạng rồi chạy lại.'; return }
  New-Item -ItemType Directory -Force -Path (Join-Path $HOME '.claude') | Out-Null
  Set-Content -Path (Join-Path $HOME '.claude\storeleads-uvx') -Value $uvx -Encoding ASCII
  Say '✓ Kết nối Grafana sẵn sàng'

  # 3 · Claude Code must be new enough to save plugin settings (`claude plugin configure`); update it if not
  claude plugin configure --help *> $null
  if ($LASTEXITCODE -ne 0) {
    Say '… Cập nhật Claude Code (bản trên máy quá cũ)'
    claude update *> $null
    claude plugin configure --help *> $null
    if ($LASTEXITCODE -ne 0) { Fail 'Claude Code quá cũ và tự cập nhật không được. Chạy: claude update  (cài qua npm thì: npm i -g @anthropic-ai/claude-code@latest), rồi chạy lại dòng cài.'; return }
  }
  Say ('✓ Claude Code ' + ((claude --version 2>$null | Select-Object -First 1) -split ' ')[0])

  # 4 · plugin (public repo → HTTPS, no GitHub account needed)
  $env:CLAUDE_CODE_PLUGIN_PREFER_HTTPS = '1'
  $known = (claude plugin marketplace list 2>$null | Out-String)
  if ($known -match [regex]::Escape($Repo)) { claude plugin marketplace update qikify *> $null }
  else {
    claude plugin marketplace add $Repo *> $null
    if ($LASTEXITCODE -ne 0) { Fail 'Không thêm được nguồn plugin từ GitHub.'; return }
  }
  claude plugin install storeleads@qikify *> $null
  claude plugin update storeleads@qikify *> $null   # install is a no-op when already installed
  claude plugin enable storeleads@qikify *> $null
  $values = @{ grafana_token = $Token; uvx_path = $uvx } | ConvertTo-Json -Compress
  $values | claude plugin configure storeleads@qikify --values-stdin *> $null
  if ($LASTEXITCODE -ne 0) { Fail 'Lưu token không được. Nhắn Toàn kèm ảnh chụp màn hình này.'; return }
  Say '✓ Plugin StoreLeads đã cài, token lưu an toàn'

  # 5 · pre-approve only this plugin's skill, its read-only Grafana tool, reading its own files and writing report
  # pages named ~/Downloads/storeleads-*; wait up to 2 min for the connector to start. Nothing else is touched.
  try {
    $p = Join-Path $HOME '.claude\settings.json'
    $s = if ((Test-Path $p) -and (Get-Item $p).Length -gt 0) { Get-Content $p -Raw | ConvertFrom-Json } else { [pscustomobject]@{} }
    if (-not $s.PSObject.Properties['permissions']) { $s | Add-Member permissions ([pscustomobject]@{}) }
    if (-not $s.permissions.PSObject.Properties['allow']) { $s.permissions | Add-Member allow @() }
    $allow = @($s.permissions.allow)
    foreach ($r in 'Skill(storeleads:*)', 'mcp__plugin_storeleads_grafana', 'Read(~/.claude/plugins/**)', 'Edit(~/Downloads/storeleads-*)') {
      if ($allow -notcontains $r) { $allow += $r }
    }
    $s.permissions.allow = @($allow | Where-Object { $_ -ne 'Write(~/Downloads/storeleads-*)' })
    if (-not $s.PSObject.Properties['env']) { $s | Add-Member env ([pscustomobject]@{}) }
    if (-not $s.env.PSObject.Properties['MCP_TIMEOUT']) { $s.env | Add-Member MCP_TIMEOUT '120000' }
    $json = $s | ConvertTo-Json -Depth 50
    [IO.File]::WriteAllText($p, $json, (New-Object Text.UTF8Encoding $false))
    Say '✓ Đã cho phép plugin chạy không cần hỏi'
  } catch { Write-Host '  (bỏ qua bước cấp quyền — Claude Code sẽ hỏi quyền lần đầu, cứ chọn Yes)' }

  Write-Host ''
  Say 'Xong! Mở lại Claude Code (gõ: claude) và hỏi thử:'
  Write-Host '  Klaviyo đang có bao nhiêu store, bao nhiêu % là Shopify Plus?'
  Write-Host ''
  Write-Host "Hướng dẫn: https://github.com/$Repo#readme · Plugin tự cập nhật mỗi ngày."
}

Install-StoreLeads -Token $(if ($args.Count -gt 0) { $args[0] } else { '' })
