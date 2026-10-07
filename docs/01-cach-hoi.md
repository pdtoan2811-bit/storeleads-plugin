# Cách hỏi để có câu trả lời tốt

Trang này giúp bạn hỏi Claude sao cho lần đầu đã ra đúng thứ mình cần, và biết trước Claude sẽ từ chối gì.

Chưa cài plugin? Xem [trang cài đặt](../README.md). Muốn xem ví dụ theo từng việc cụ thể: [Playbook](./02-playbook.md).

## 1. Sáu thói quen nhỏ

**Gọi tên app rõ ràng.** Viết "Judge.me", "Klaviyo", đừng viết "app review" hay "app email". Đó là tên một nhóm, không phải một app. Nếu bạn viết tên chung, Claude sẽ liệt kê vài app và hỏi lại. Tên app cũng hay trùng nhau (ví dụ "Product Reviews" là app của chính Shopify), nên khi Claude hỏi "ý bạn là app nào?", hãy chọn đúng một app rồi trả lời.

**Nói rõ khoảng thời gian.** "Trong 6 tháng qua", "so với 12 tháng trước". Không nói thì Claude sẽ tự chọn một mốc và ghi rõ mốc đó ra, nhưng tốt nhất bạn tự chọn. Lưu ý: "hiện nay", "tháng này", "tháng trước" đều nghĩa là snapshot mới nhất (9/2026), vì đó là dữ liệu mới nhất mình có.

**Nói tất cả store hay chỉ Plus.** Plus là gói Shopify Plus, gói cao nhất của Shopify, thường là các store lớn. Nếu bạn quan tâm store lớn, hãy viết "chỉ store Plus". Không nói thì Claude trả cả hai.

**Nói quốc gia** nếu bạn chỉ quan tâm một thị trường: "ở Mỹ", "ở Úc".

**So hai app trong một câu.** "So sánh tăng trưởng Klaviyo và Omnisend." Claude sẽ đặt hai app cạnh nhau, tách cả phần Plus.

**Hỏi tiếp.** Claude nhớ câu trước trong cùng cuộc trò chuyện. Sau câu trả lời bạn có thể gõ "còn ở Mỹ thì sao?", "chỉ tính Plus thôi", "so với Omnisend". Không cần hỏi lại từ đầu.

## 2. Gộp thành một trang để gửi

Sau vài câu hỏi, gõ: **"Gộp các câu trả lời ở trên thành một trang báo cáo gửi sếp."** Claude sẽ làm một trang HTML có biểu đồ, bảng và đủ lưu ý, lưu thành file trên máy bạn: mở bằng trình duyệt, gửi file đó cho người cần xem. Trang này chỉ gửi trong nội bộ, xem [Đọc số cho đúng](./03-doc-so-cho-dung.md) để biết cách trích số liệu khi chia sẻ.

## 3. Sáu lệnh có sẵn

Gõ lệnh, rồi thêm tên app hoặc category. Lệnh giúp Claude đi qua đủ các bước, bạn không phải nhớ cần hỏi gì.

| Lệnh | Dùng khi | Ví dụ |
|---|---|---|
| `/storeleads:competitor-brief` | Cần một trang tổng quan về một app đối thủ | `/storeleads:competitor-brief Yotpo` |
| `/storeleads:growth-check` | Muốn biết một app đang tăng hay giảm | `/storeleads:growth-check PageFly` |
| `/storeleads:churn-postmortem` | Muốn hiểu store bỏ app này rồi đi đâu | `/storeleads:churn-postmortem Loox` |
| `/storeleads:category-scan` | Muốn quét cả một category: ai dẫn, ai mới nổi | `/storeleads:category-scan Marketing and conversion` |
| `/storeleads:app-idea-check` | Đang cân nhắc làm app mới, cần kết luận làm / cân nhắc / không | `/storeleads:app-idea-check upsell` |
| `/storeleads:plus-gap` | Tìm chỗ store Plus chưa có app nào | `/storeleads:plus-gap review, Mỹ` |

## 4. Câu hỏi yếu và câu hỏi tốt

| Yếu | Tốt | Vì sao |
|---|---|---|
| "Reviews app nào tốt?" | "Judge.me đang có bao nhiêu store, bao nhiêu % là Plus?" | Một app cụ thể, một câu hỏi cụ thể |
| "Klaviyo tăng không?" | "Klaviyo tăng bao nhiêu % store trong 6 tháng qua?" | Có khoảng thời gian |
| "Đối thủ của Loox?" | "Ai cạnh tranh với Loox trong cùng category, ai tăng nhiều nhất 12 tháng qua?" | Nói rõ "đối thủ" là gì và so theo mốc nào |
| "Cho mình danh sách khách hàng" | "Bao nhiêu store Plus ở Đức dùng Klaviyo mà chưa có Shopify Inbox?" | Đếm trước, danh sách là chuyện sau |
| "Khi bỏ Klaviyo thì sao?" | "Khi bỏ Klaviyo, merchant chuyển sang app email nào nhiều nhất? Tính cả gỡ thật, không tính store đóng cửa." | Tách gỡ thật khỏi store rời dữ liệu |

## 5. Claude sẽ từ chối hoặc nói "không có" khi nào

- **Dữ liệu trước 10/2024.** Mình chỉ có 24 tháng, 10/2024 đến 9/2026. Hỏi xa hơn thì Claude nói thẳng là không có, và không đoán.
- **Danh sách store đầy đủ.** Claude chỉ cho tối đa một danh sách ngắn để phân tích. Cần bản đầy đủ thì nhắn Toàn trên Slack, kèm bộ lọc bạn muốn. Lý do: điều khoản StoreLeads cấm dùng danh sách này để outreach.
- **Thứ dữ liệu không có.** Ví dụ doanh thu của một app, số tiền merchant trả cho app, lý do merchant gỡ app, store nào cài app trước hay sau. Dữ liệu chỉ cho biết store nào đang có app nào trong từng tháng.
- **Số liệu "đang xảy ra hôm nay".** Dữ liệu là ảnh chụp theo tháng, snapshot cuối là 9/2026.

Khi Claude từ chối, thường nó sẽ gợi ý một câu hỏi gần nhất mà dữ liệu trả lời được. Hãy dùng gợi ý đó.

## Tiếp theo

- [Đọc số cho đúng](./03-doc-so-cho-dung.md), trước khi bạn dán số vào slide.
- [Dùng dashboard Grafana](./04-dashboard.md), khi bạn muốn tự bấm xem.
- [Sự cố & câu hỏi thường gặp](./05-su-co.md).
