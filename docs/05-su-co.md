# Sự cố & câu hỏi thường gặp

Trang này giúp bạn tự gỡ các lỗi hay gặp trước khi nhắn Toàn.

## Bảng nhanh

| Triệu chứng | Cách sửa |
|---|---|
| Lỗi khi cài | Chạy lại dòng cài ở [trang cài đặt](../README.md). Vẫn lỗi: chụp màn hình gửi Toàn. |
| "Không có bàn phím để hỏi token" | Bạn đang chạy trong Claude/Orca. Dán token vào cuối lệnh: `… install.sh \| bash -s -- <token>` |
| Windows: `The '<' operator is reserved`, `WSL … getpwuid failed`, `/bin/bash: No such file` | Bạn đang dùng lệnh cho Mac. Trên Windows dùng lệnh PowerShell: `irm …/install.ps1 \| iex` (xem [trang cài đặt](../README.md)). |
| Lỗi 401 / unauthorized | Token sai hoặc hết hạn. Xin token mới (nhắn Toàn hoặc Đức), rồi chạy lại dòng cài: nó sẽ hỏi token mới. |
| Claude không dùng dữ liệu StoreLeads | Gõ `/plugin`, xem storeleads có ở trạng thái **enabled** không. Thử hỏi "theo dữ liệu StoreLeads, …" |
| Plugin bị tắt (disabled) | Chạy lại dòng cài, rồi mở lại Claude Code. |
| Không thấy bản mới của plugin | Plugin tự cập nhật mỗi ngày một lần, bản mới có hiệu lực ở lần mở Claude Code kế tiếp. Muốn ngay: chạy lại dòng cài. |
| Câu trả lời chậm | Xem bên dưới |
| Số trông sai | Xem "Số khác với website StoreLeads / dashboard" bên dưới. Vẫn nghi ngờ thì chụp màn hình gửi Toàn |
| Dashboard hiện ô lỗi đỏ | Tải lại trang một lần. Vẫn lỗi thì chụp màn hình gửi Toàn |

## Câu hỏi thường gặp

### Vì sao câu trả lời chậm?

Một số câu cần đọc nhiều dữ liệu, nhất là câu về stack (app đi cùng nhau) hay churn, nên thường mất vài chục giây, câu khó có thể hơn một phút. Cứ đợi. Nếu quá vài phút, bấm Esc, hỏi lại ngắn hơn: thêm tên app, một khoảng thời gian, một quốc gia. Câu hẹp luôn nhanh hơn câu rộng.

### Claude trả lời mà không thấy chạy truy vấn dữ liệu?

Đó là dấu hiệu Claude đang trả lời bằng kiến thức chung, không phải dữ liệu của mình. Con số như vậy không đáng tin. Hãy gõ: "Hãy tra dữ liệu StoreLeads rồi trả lời lại." Câu trả lời đúng luôn có mốc snapshot và dòng nguồn ("Source: StoreLeads (internal), Oct 2024 – Sep 2026, via Grafana"). Không thấy hai thứ đó thì đừng dùng. Nếu lặp lại, kiểm tra plugin còn **enabled**.

### Số khác với website StoreLeads?

Khác một chút là bình thường, vì hai nơi đếm khác nhau. Mình đếm mỗi shop một lần dù shop có nhiều domain, chỉ tính store Shopify đang hoạt động, và dùng ảnh chụp theo tháng. Website StoreLeads đếm từng domain và luôn hiện số mới nhất, còn ở đây là snapshot cuối tháng 9/2026. Chi tiết: [Đọc số cho đúng](./03-doc-so-cho-dung.md). Đừng đặt hai con số cạnh nhau trong cùng một bảng so sánh.

### Số khác với dashboard Grafana?

Hai nơi dùng chung dữ liệu nên đáng ra phải khớp. Nguyên nhân thường gặp: (1) bạn chọn khác mốc thời gian hoặc khác bộ lọc (Plus, quốc gia); (2) tên app trùng và hai bên chọn hai app khác nhau; (3) "hiện nay" của Claude là snapshot cuối, còn dashboard đang xem một tháng khác. Hãy cho Claude biết bộ lọc bạn đang để trên dashboard và so lại. Vẫn lệch thì gửi cả hai ảnh chụp cho Toàn.

### Vì sao không có dữ liệu trước 10/2024?

Mình chỉ có 24 snapshot hàng tháng, từ 10/2024 đến 9/2026. Dữ liệu cũ hơn chưa được nạp, nên Claude sẽ nói "không có" thay vì đoán. Cần mốc xa hơn thì hỏi Toàn xem có nạp thêm được không.

### Dữ liệu có cập nhật hàng ngày không?

Không. Mỗi tháng một snapshot. "Hiện nay" luôn là snapshot mới nhất đã nạp.

### Tôi có xin được danh sách store đầy đủ không?

Claude chỉ cho đếm và một danh sách ngắn để phân tích. Cần bản đầy đủ: nhắn Toàn trên Slack, ghi rõ bộ lọc (app, quốc gia, Plus hay không) và dùng để làm gì. Danh sách này chỉ dùng phân tích nội bộ, không outreach (điều khoản StoreLeads §2).

### Tôi dán số vào slide gửi đối tác ngoài được không?

Không. Số liệu chỉ dùng nội bộ. Trong slide nội bộ, luôn ghi mốc snapshot và giữ các lưu ý. Xem mục cuối của [Đọc số cho đúng](./03-doc-so-cho-dung.md).

### Token của tôi có an toàn không? Tôi có làm hỏng dữ liệu được không?

Token chỉ đọc, không sửa hay xoá được gì. Token nằm trong keychain của máy bạn. Đừng gửi token cho ai, đừng dán vào chat hay vào tài liệu. Nếu lỡ lộ, nhắn Toàn để đổi token.

### Dùng được trên claude.ai (bản web) không?

Chưa. Hiện chỉ dùng được trong Claude Code. Dashboard Grafana thì dùng được trên trình duyệt.

## Ai giúp được

**Toàn** (hoặc Đức) trên Slack. Khi nhắn, gửi kèm: câu bạn đã hỏi, ảnh chụp màn hình câu trả lời hoặc lỗi, và bạn đang dùng Claude hay Grafana. Có ba thứ đó thì thường xử lý được trong một lượt.

Quay lại: [Cài đặt](../README.md) · [Cách hỏi](./01-cach-hoi.md) · [Đọc số cho đúng](./03-doc-so-cho-dung.md) · [Dashboard](./04-dashboard.md)
