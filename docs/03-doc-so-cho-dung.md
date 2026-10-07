# Đọc số cho đúng

Trang này giúp bạn hiểu mỗi con số Claude đưa ra có giới hạn gì, để không nói quá lên khi chia sẻ cho sếp hay đồng nghiệp.

Claude luôn kèm lưu ý (caveat) cuối câu trả lời. Dưới đây là ý nghĩa từng lưu ý và việc bạn nên làm. Cách hỏi: [Cách hỏi](./01-cach-hoi.md).

## 1. "Hiện nay" là snapshot mới nhất

Snapshot là một ảnh chụp: tại một thời điểm, store nào đang cài app nào. Mình có 24 ảnh, mỗi tháng một ảnh, từ 10/2024 đến 9/2026. "Hiện nay", "tháng này" và "tháng trước" đều là ảnh cuối (9/2026), không phải hôm nay. "30 ngày qua" cũng đếm lùi từ ngày chụp ảnh cuối, không từ hôm nay.

Ví dụ: bạn hỏi "Loox có bao nhiêu store?" vào tháng 12, câu trả lời vẫn là con số của ảnh tháng 9.

**Việc cần làm:** khi trích số, luôn ghi "theo snapshot 9/2026".

## 2. Không có dữ liệu trước 10/2024

Hỏi "Klaviyo năm 2022 thế nào?" thì Claude sẽ nói không có. Đừng nhờ Claude "ước chừng". Nếu cần xu hướng dài hơn 2 năm, hãy dùng nguồn khác và nói rõ đó là nguồn khác.

## 3. Tên app hay trùng nhau

Cùng một cái tên có thể là hai app khác nhau, hoặc app của Shopify trùng tên với app bên thứ ba. Nếu Claude hỏi "ý bạn là app nào?", đó là Claude đang giúp bạn, đừng bỏ qua. Chọn sai app thì mọi con số sau đó đều đúng cho app khác.

**Việc cần làm:** đọc kỹ tên nhà phát hành (vendor) và category mà Claude liệt kê rồi mới chọn.

## 4. "Mất store" chưa chắc là gỡ app

Khi một store không còn app nữa, có hai khả năng rất khác nhau:

- **Churn thật:** store vẫn đang hoạt động nhưng đã gỡ app. Đây là tín hiệu merchant không hài lòng hoặc đã chuyển sang app khác.
- **Store rời dữ liệu:** store đóng cửa, tạm dừng, hoặc StoreLeads không còn thu thập được. Merchant không "bỏ" app, store biến mất.

Số "mất store" gộp cả hai. Ví dụ: app có "mất" rất nhiều store trong một tháng, nhưng phần lớn có thể là store đóng cửa, không phải merchant chê app.

**Việc cần làm:** khi nói về churn, hỏi rõ "gỡ app thật, store vẫn hoạt động". Tab Churn trên dashboard cũng tách hai loại này.

## 5. Store đếm một lần dù có nhiều domain

Một shop có thể có nhiều tên miền. Mình đếm mỗi shop một lần, nên số store của một app thường thấp hơn một chút so với con số trên website StoreLeads. Đây không phải lỗi, chỉ là cách đếm khác nhau.

**Việc cần làm:** đừng đặt hai con số này cạnh nhau như thể cùng một thước đo.

## 6. Vài tháng dữ liệu nhảy bất thường

Do cách StoreLeads thu thập, có vài tháng số liệu nhảy hoặc tụt mà không phải thị trường thật sự đổi: số store Plus tụt vào 2/2025 và 2/2026, số store nhảy vào 11/2025, một số app nhảy vào 9/2026.

Ví dụ: đường tăng trưởng của một app có một "vết gãy" ở đúng 2/2026, nhiều khả năng đó là cách thu thập, không phải tin xấu.

**Việc cần làm:** nếu khoảng thời gian bạn xem có đi qua những tháng này, nói điều đó khi trình bày, và đừng đọc thành xu hướng.

## 7. Nhóm Level 1 / Level 2 là nhóm tạm

Các nhóm như "Marketing and conversion" hay "Social trust" là cách nhóm tạm (draft) của team, không phải phân loại của Shopify. Category gốc của từng app thì lấy từ app listing. Mỗi app chỉ tính vào một category chính, nên các category cộng lại không bị đếm đôi.

**Việc cần làm:** khi dùng kết luận về một nhóm lớn, ghi "theo cách nhóm draft của team".

## 8. Chỉ dùng nội bộ

Điều khoản StoreLeads §2: không xuất danh sách store để outreach, không đăng số liệu ra ngoài (blog, bài PR, pitch với khách). Cần danh sách đầy đủ cho việc nội bộ: nhắn Toàn.

## Bốn điều dễ nhầm khác

**Số store không phải "installs" của StoreLeads.** Mình đếm store đang hoạt động có app. StoreLeads có một con số riêng gọi là installs (đếm theo mọi domain, và các bản 30 ngày / 90 ngày là thay đổi ròng, không phải số cài mới). Đừng trộn hai thứ trong một so sánh.

**App "mới" có thể vào dữ liệu muộn hơn ngày lên store.** Một app lên App Store từ lâu nhưng chỉ bắt đầu được StoreLeads phát hiện trên store sau đó. Khi Claude nói "app mới nổi", đó là app có ngày listing gần đây, nhưng đường tăng của nó có thể bị cắt đầu.

**Đi cùng nhau không có nghĩa là cài trước sau.** Trong tab Stack, "hay đi cùng" chỉ nói hai app cùng xuất hiện trên một store. Không nói app nào cài trước, cũng không nói app này kéo app kia. Chỉ số lift cho biết cặp đó đi cùng nhau nhiều hơn mức ngẫu nhiên bao nhiêu lần (lớn hơn 1 là hợp nhau hơn mặt bằng).

**Reach index** (chỉ số độ phủ) trong tab Geo: so mức app mạnh ở một nước với mức app mạnh trên toàn nền tảng. Lớn hơn 1 nghĩa là app mạnh ở nước đó hơn mặt bằng chung của chính nó.

## Cách trích số khi chia sẻ

Một câu mẫu, gồm số, mốc thời gian, nguồn và giới hạn:

> "Theo snapshot 9/2026 (StoreLeads, nội bộ), app X có … store, trong đó … là Plus. Số store đếm mỗi shop một lần."

Luôn kèm: (1) mốc snapshot, (2) khoảng thời gian so sánh, (3) lưu ý Claude đã ghi. Câu trả lời của Claude thường có dòng "Source: StoreLeads (internal), Oct 2024 – Sep 2026, via Grafana", hãy giữ nguyên dòng đó.

## Tiếp theo

[Dùng dashboard Grafana](./04-dashboard.md) · [Sự cố & câu hỏi thường gặp](./05-su-co.md)
