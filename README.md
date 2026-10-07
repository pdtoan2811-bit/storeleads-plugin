# Qikify plugins cho Claude

Plugin nội bộ cho team Qikify / Ownego. Hiện có một plugin:

**StoreLeads**: hỏi Claude về app Shopify và store bằng tiếng thường, ví dụ "Klaviyo có bao nhiêu store, bao nhiêu
% là Plus?", "Ai đang cạnh tranh với Judge.me?", "Store bỏ Loox thì chuyển sang app nào?". Claude đọc dữ liệu
StoreLeads (24 snapshot theo tháng, 10/2024 → 9/2026) qua Grafana của team, chỉ đọc, không sửa được gì.

> ⚠️ **Chỉ dùng nội bộ.** Không xuất danh sách store để đi outreach, không công bố số liệu ra ngoài (điều khoản
> StoreLeads §2).

## Cài đặt (khoảng 5 phút, làm một lần)

Cần: **Claude Code** (app terminal `claude`). Bản web claude.ai chưa dùng được, sẽ có sau.

**1. Xin token.** Nhắn Toàn hoặc Đức trên Slack: "cho mình xin token Grafana StoreLeads". Token là một chuỗi
bắt đầu bằng `glsa_`. Đừng gửi token này cho ai khác.

**2. Cài `uv`** (công cụ để chạy kết nối Grafana). Mở Terminal, dán:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Đóng Terminal rồi mở lại.

**3. Thêm plugin.** Mở Claude Code (`claude`), gõ lần lượt:

```
/plugin marketplace add pdtoan2811-bit/storeleads-plugin
/plugin install storeleads@qikify
```

Claude Code sẽ hỏi **Grafana token**: dán token ở bước 1 vào. Token được lưu trong keychain của máy, không nằm
trong file nào.

**4. Bật tự cập nhật** (để luôn có bản mới nhất): gõ `/plugin` → tab **Marketplaces** → chọn **qikify** →
**Enable auto-update**.

**5. Khởi động lại Claude Code** và hỏi thử:

```
Klaviyo đang có bao nhiêu store, và bao nhiêu % trong số đó là Shopify Plus?
```

## Hỏi gì cũng được, ví dụ

- Quy mô & tăng trưởng: "PageFly tăng bao nhiêu % store trong 6 tháng qua?"
- Đối thủ: "Trong category email marketing ai dẫn đầu, chiếm bao nhiêu thị phần?"
- App stack: "Store dùng cả Klaviyo và Judge.me thì hay dùng thêm app gì?"
- Churn: "Khi bỏ Klaviyo, merchant chuyển sang app email nào nhiều nhất?"
- Thị trường: "Bao nhiêu store Plus ở Mỹ chưa có app review nào?"

Claude luôn kèm lưu ý (caveat) khi số liệu có giới hạn, hãy giữ lại các lưu ý đó khi chia sẻ.

## Gặp lỗi?

| Triệu chứng | Cách sửa |
|---|---|
| `uvx: command not found` | Làm lại bước 2, rồi mở Terminal mới |
| Lỗi 401 / unauthorized | Token sai hoặc hết hạn: `/plugin` → storeleads → cấu hình lại token |
| Claude không dùng dữ liệu StoreLeads | Gõ `/plugin`, kiểm tra storeleads đang **enabled**; hỏi rõ "theo dữ liệu StoreLeads…" |
| Câu trả lời có vẻ sai | Chụp màn hình gửi Toàn |

Dashboard đầy đủ (không cần Claude): https://storedata.ecvision.ai (đăng nhập bằng Slack), thư mục **StoreLeads**.

---
_Repo này được sinh tự động từ `qikifyStoreLeadsKnowledge` (`npm run plugin:build`). Đừng sửa trực tiếp ở đây._
