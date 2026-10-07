# Dùng dashboard Grafana

Trang này giúp bạn tự bấm xem số liệu StoreLeads trên Grafana, không cần Claude, và biết lúc nào nên dùng cái nào.

## Grafana hay hỏi Claude?

| Bạn muốn | Dùng |
|---|---|
| Một câu trả lời cụ thể ("Judge.me tăng bao nhiêu trong 6 tháng?") | Hỏi Claude |
| Một trang tổng hợp có giải thích, brief, post-mortem | Hỏi Claude |
| Lang thang xem, bấm thử app khác, chuyển category, không biết trước mình tìm gì | Grafana |
| Xem biểu đồ theo tháng, để họp hoặc chụp màn hình nội bộ | Grafana |
| Một lát cắt lạ mà dashboard không có | Hỏi Claude |

Hai nơi dùng cùng một dữ liệu, nên số khớp nhau. Claude cũng thường gửi kèm link dashboard tương ứng, bấm vào là mở đúng app bạn hỏi.

## Đăng nhập

Mở https://storedata.ecvision.ai, chọn đăng nhập bằng Slack, vào thư mục **StoreLeads**. Chỉ xem được, không sửa được gì. Chưa vào được: xem [Sự cố](./05-su-co.md).

## Hai cửa

Dashboard chia thành hai cửa. Mỗi cửa có một dải tab ở đầu trang, bấm tab để đổi góc nhìn mà vẫn giữ nguyên app hay category đang chọn.

### Cửa 1: App deep-dive (xem một app)


| Tab | Trả lời câu hỏi gì | Điều khiển chính |
|---|---|---|
| Overview | App này lớn cỡ nào, bao nhiêu store, bao nhiêu Plus, xu hướng gần đây | Chọn app |
| Growth | Tăng hay giảm theo tháng, riêng Plus | Chọn app, **Compare** để đặt thêm một app lên cùng biểu đồ |
| Stack | Store của app này còn dùng app nào | Chọn app, "And also has" để thêm app thứ hai |
| Competition | Ai cùng category, ai đang thắng, ai đang thua | **Compare to** để chọn mốc so sánh |
| Geo | Mạnh ở nước nào, so với mặt bằng | Chọn app |
| Merchants | Merchant của app là ai: theme, store mới mở, danh sách ngắn | Chọn app |
| Churn | Store bỏ app thì đi đâu, gỡ thật hay store rời dữ liệu | Chọn app |


Tab **Stack** cho thấy các app đi cùng, xếp thành bảng xếp hạng. Chọn thêm một app ở "And also has" để xem những store có cả hai còn dùng gì. Đây là quan hệ "đi cùng nhau", không nói gì về thứ tự cài.


Tab **Competition** so số store bây giờ với một mốc trong quá khứ.


Tab **Churn** tách "gỡ app thật" khỏi "store rời dữ liệu" và chỉ ra app mà người bỏ app đã chuyển sang.


### Cửa 2: Category overview (xem một ngành hàng)


| Tab | Trả lời câu hỏi gì |
|---|---|
| Map | Bức tranh toàn cảnh: category nào lớn, nhóm nào chiếm nhiều store |
| Momentum | Category nào đang lên nhanh hơn thị trường, app nào tăng nhiều nhất |
| Leaders | Ai dẫn từng category, dẫn chắc hay yếu, category nào phân mảnh |
| Entrants | App mới lên App Store và đã kéo được bao nhiêu store |
| Geo | Khoảng trống: store Plus ở từng nước chưa có app nào trong category |
| Stacks | Các app trong category hay đi cùng app nào |

Phần lớn tab này dùng được cho kiểu câu hỏi "có nên làm app trong category này không".

## Cách thao tác

**Đổi app.** Ở cửa App deep-dive, dùng ô chọn app trên đầu trang. Hoặc bấm vào một thanh trong biểu đồ (ví dụ trong tab Competition) để nhảy sang app đó. Tab đang mở vẫn giữ nguyên.

**So sánh hai app.** Tab Growth có ô **Compare**, chọn app thứ hai để hai đường nằm cùng biểu đồ. Tab Stack có "And also has" cho một việc khác: tìm store có cả hai app.

**Đổi khoảng thời gian.** Dùng ô thời gian ở góc trên phải, và với tab Competition dùng ô **Compare to** (1, 3, 6, 12, 24 tháng trước). Nhớ dữ liệu chỉ có 24 tháng.

**Khoan sâu vào một category.** Phạm vi chọn theo ba bậc nối nhau: **Level 1 → Level 2 → Category**. Chọn Level 1 trước, danh sách Level 2 thu hẹp lại, rồi đến Category. Có thể bấm thẳng vào một ô trong biểu đồ Map để chọn nhanh. Level 1 và Level 2 là nhóm tạm (draft) của team, xem [Đọc số cho đúng](./03-doc-so-cho-dung.md).

**Giữ lại lựa chọn.** Link trên thanh địa chỉ đã chứa app, category và khoảng thời gian bạn chọn. Gửi link đó trong Slack nội bộ, người nhận sẽ thấy đúng màn hình của bạn (nếu họ có quyền).

## Lưu ý

- Mỗi biểu đồ nặng có thể mất vài giây mới hiện. Đợi hết vòng xoay trước khi đổi tiếp.
- Tab nào hiện ô lỗi đỏ: chụp màn hình gửi Toàn.
- Chụp màn hình để họp nội bộ được, nhưng chưa được đăng ra ngoài. Xem mục cuối [Đọc số cho đúng](./03-doc-so-cho-dung.md).

Tiếp theo: [Sự cố & câu hỏi thường gặp](./05-su-co.md) · [Cách hỏi Claude](./01-cach-hoi.md)
