# Qikify plugins cho Claude

Plugin nội bộ cho team Qikify / Ownego. Hiện có một plugin:

**StoreLeads**: hỏi Claude về app Shopify và store bằng tiếng thường, ví dụ "Klaviyo có bao nhiêu store, bao nhiêu
% là Plus?", "Ai đang cạnh tranh với Judge.me?", "Store bỏ Loox thì chuyển sang app nào?". Claude đọc dữ liệu
StoreLeads (24 snapshot theo tháng, 10/2024 → 9/2026) qua Grafana của team, chỉ đọc, không sửa được gì.

> ⚠️ **Chỉ dùng nội bộ.** Không xuất danh sách store để đi outreach, không công bố số liệu ra ngoài (điều khoản
> StoreLeads §2).

## Cài đặt (2 bước, khoảng 2 phút)

Cần có **Claude Code** (app terminal `claude`). Bản web claude.ai chưa dùng được, sẽ có sau.

**1. Xin token.** Nhắn Toàn hoặc Đức trên Slack: "cho mình xin token StoreLeads". Token bắt đầu bằng `glsa_`.
Đừng gửi token này cho ai khác.

**2. Mở Terminal, dán dòng này rồi Enter.** Khi được hỏi, dán token vào (chữ sẽ không hiện ra, cứ dán rồi Enter):

```bash
curl -fsSL https://raw.githubusercontent.com/pdtoan2811-bit/storeleads-plugin/main/install.sh | bash
```

Xong. Mở lại Claude Code (`claude`) và hỏi thử:

```
Klaviyo đang có bao nhiêu store, và bao nhiêu % trong số đó là Shopify Plus?
```

Plugin tự cập nhật mỗi ngày, không cần làm gì thêm. Đổi token: chạy lại dòng ở bước 2.

## Hướng dẫn chi tiết

1. [Cách hỏi để có câu trả lời tốt](docs/01-cach-hoi.md)
2. [Playbook theo việc](docs/02-playbook.md): 18 việc thường gặp, mỗi việc có câu mẫu để copy
3. [Đọc số cho đúng](docs/03-doc-so-cho-dung.md)
4. [Dùng dashboard Grafana](docs/04-dashboard.md)
5. [Sự cố & câu hỏi thường gặp](docs/05-su-co.md)

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
| Lỗi khi cài | Chạy lại dòng ở bước 2; vẫn lỗi thì chụp màn hình gửi Toàn |
| Lỗi 401 / unauthorized | Token sai hoặc hết hạn: xin token mới, chạy lại dòng ở bước 2 |
| Claude không dùng dữ liệu StoreLeads | Gõ `/plugin`, kiểm tra storeleads đang **enabled**; hỏi rõ "theo dữ liệu StoreLeads…" |
| Câu trả lời có vẻ sai | Chụp màn hình gửi Toàn |

Dashboard (không cần Claude, đăng nhập bằng Slack): **[bắt đầu ở đây](https://storedata.ecvision.ai/d/sl-app-overview)** cho một app, hoặc [bản đồ category](https://storedata.ecvision.ai/d/sl-cat-map) cho cả thị trường. Thanh tab trên cùng dẫn sang các trang còn lại.

---
_Repo này được sinh tự động từ `qikifyStoreLeadsKnowledge` (`npm run plugin:build`). Đừng sửa trực tiếp ở đây._
