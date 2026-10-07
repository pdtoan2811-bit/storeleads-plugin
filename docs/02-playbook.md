# Playbook theo việc

Trang này giúp bạn tìm đúng câu để hỏi cho việc bạn đang làm. Copy câu mẫu, đổi tên app
hoặc category, rồi hỏi Claude. Mỗi mục có lưu ý cần nhớ và dashboard để xem thêm.

Chưa cài? Xem [hướng dẫn cài](../README.md). Hỏi sao cho tốt: [Cách hỏi](./01-cach-hoi.md).

- [Đánh giá đối thủ](#đánh-giá-đối-thủ)
- [Tìm cơ hội app mới](#tìm-cơ-hội-app-mới)
- [Theo dõi tăng trưởng](#theo-dõi-tăng-trưởng)
- [Hiểu churn](#hiểu-churn)
- [Plus & thị trường theo nước](#plus--thị-trường-theo-nước)
- [Số liệu cho pitch & chiến lược](#số-liệu-cho-pitch--chiến-lược)

## Đánh giá đối thủ

_Biết một app lớn cỡ nào, đang lên hay xuống, thắng ai, thua ai._

### Một app lớn cỡ nào

**Dành cho:** PM, Marketing, Leadership

**Hỏi như này:**

> Klaviyo đang có bao nhiêu store, bao nhiêu % là Shopify Plus?
> Loox đứng thứ mấy trong tất cả app Shopify?

<details><summary>English</summary>

> How many active stores run Klaviyo, and what share are on Plus?

> Where does Loox rank among all Shopify apps?

</details>

**Bạn nhận được:** Số store đang dùng app ở snapshot mới nhất, tỷ lệ Plus, thứ hạng, và xu hướng vài tháng gần đây.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Tên app hay trùng nhau. Nếu Claude hỏi lại "ý bạn là app nào", hãy chọn đúng app.
- Một shop nhiều domain chỉ tính một lần, nên số store thấp hơn số StoreLeads công bố một chút.

**Xem trên dashboard:** [Overview](https://storedata.ecvision.ai/d/sl-app-overview)

### Ai đang cạnh tranh với app này

**Dành cho:** PM, Marketing

**Hỏi như này:**

> Ai là đối thủ của Judge.me trong cùng category, ai đang thắng 12 tháng qua?

<details><summary>English</summary>

> Who competes with Judge.me in its category, and who gained most over the last 12 months?

</details>

**Bạn nhận được:** Bảng các app cùng category: số store bây giờ và N tháng trước, ai tăng, ai giảm, thị phần.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Tên app hay trùng nhau. Nếu Claude hỏi lại "ý bạn là app nào", hãy chọn đúng app.
- Có vài tháng dữ liệu nhảy bất thường do cách StoreLeads thu thập (Plus 2/2025, 2/2026; 11/2025; 9/2026).

**Xem trên dashboard:** [Competition](https://storedata.ecvision.ai/d/sl-app-competition)

### Brief đối thủ một trang

**Dành cho:** PM, Leadership

**Hỏi như này:**

> Làm brief đối thủ cho Yotpo.

<details><summary>English</summary>

> Write a competitor brief on Yotpo.

</details>

**Hoặc gõ lệnh:** `/storeleads:competitor-brief …`

**Bạn nhận được:** Một trang: quy mô & xu hướng, thắng/thua ai, app hay đi kèm, mạnh ở nước nào, churn đi đâu, 3 điều cần theo dõi.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Tên app hay trùng nhau. Nếu Claude hỏi lại "ý bạn là app nào", hãy chọn đúng app.
- "Mất store" gồm cả store đóng cửa/rời dữ liệu, không chỉ gỡ app. Muốn số gỡ thật, hỏi rõ "gỡ app thật".
- Có vài tháng dữ liệu nhảy bất thường do cách StoreLeads thu thập (Plus 2/2025, 2/2026; 11/2025; 9/2026).

**Xem trên dashboard:** [Overview → all tabs](https://storedata.ecvision.ai/d/sl-app-overview)

### Merchant của app này dùng thêm gì

**Dành cho:** PM, Marketing

**Hỏi như này:**

> Store dùng cả Klaviyo và Judge.me thì hay dùng thêm app gì?

<details><summary>English</summary>

> Among stores running both Klaviyo and Judge.me, what else do they most often have?

</details>

**Bạn nhận được:** Danh sách app hay đi cùng, với tỷ lệ store có cả hai và mức "hợp nhau" so với mặt bằng (lift).

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Tên app hay trùng nhau. Nếu Claude hỏi lại "ý bạn là app nào", hãy chọn đúng app.

**Xem trên dashboard:** [Stack](https://storedata.ecvision.ai/d/sl-app-stack)

## Tìm cơ hội app mới

_Tìm category đông khách mà leader yếu, hoặc nhóm merchant chưa ai phục vụ._

### Category đông nhưng leader yếu

**Dành cho:** PM, Leadership

**Hỏi như này:**

> Category nào nhiều store dùng nhưng app dẫn đầu rating thấp hoặc chưa ai thống trị?

<details><summary>English</summary>

> Which categories are crowded but have a weak or fragmented leader?

</details>

**Bạn nhận được:** Danh sách category: số store, thị phần leader, rating leader, mức phân mảnh.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Nhóm Level 1 / Level 2 là cách nhóm tạm (draft) của team, không phải của Shopify.

**Xem trên dashboard:** [Leaders](https://storedata.ecvision.ai/d/sl-cat-leaders)

### Kiểm tra một ý tưởng app

**Dành cho:** PM, Leadership

**Hỏi như này:**

> Mình định làm app upsell. Thị trường này có đáng làm không?

<details><summary>English</summary>

> We're thinking of an upsell app. Is it worth it?

</details>

**Hoặc gõ lệnh:** `/storeleads:app-idea-check …`

**Bạn nhận được:** Kết luận làm / cân nhắc / không, kèm quy mô nhu cầu, độ bão hoà, leader mạnh hay yếu, newcomer làm được gì, giá, khoảng trống Plus, 3 app phải vượt.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Nhóm Level 1 / Level 2 là cách nhóm tạm (draft) của team, không phải của Shopify.

**Xem trên dashboard:** [Map](https://storedata.ecvision.ai/d/sl-cat-map)

### App mới nổi

**Dành cho:** PM, Marketing

**Hỏi như này:**

> App nào mới lên App Store trong 12 tháng qua mà đã có nhiều store nhất trong category upsell?

<details><summary>English</summary>

> Which app listed in the last 12 months has the most stores in upsell and cross-sell?

</details>

**Bạn nhận được:** Các app mới, ngày lên store, số store hiện tại, category.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Nhóm Level 1 / Level 2 là cách nhóm tạm (draft) của team, không phải của Shopify.

**Xem trên dashboard:** [Entrants](https://storedata.ecvision.ai/d/sl-cat-entrants)

### Quét một category

**Dành cho:** PM, Leadership

**Hỏi như này:**

> Quét giúp mình category Marketing and conversion.

<details><summary>English</summary>

> Scan the Marketing and conversion category for me.

</details>

**Hoặc gõ lệnh:** `/storeleads:category-scan …`

**Bạn nhận được:** Quy mô & tăng trưởng so với thị trường, ai dẫn và chắc cỡ nào, chỗ phân mảnh, newcomer nhanh, khoảng trống Plus, app hay đi kèm.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Nhóm Level 1 / Level 2 là cách nhóm tạm (draft) của team, không phải của Shopify.
- Có vài tháng dữ liệu nhảy bất thường do cách StoreLeads thu thập (Plus 2/2025, 2/2026; 11/2025; 9/2026).

**Xem trên dashboard:** [Momentum](https://storedata.ecvision.ai/d/sl-cat-momentum)

## Theo dõi tăng trưởng

_Xem app và category nào đang tăng nhanh, so với thị trường._

### App này tăng hay giảm

**Dành cho:** PM, Marketing, Leadership

**Hỏi như này:**

> PageFly tăng bao nhiêu % store trong 6 tháng qua?
> So sánh tăng trưởng Klaviyo và Omnisend.

<details><summary>English</summary>

> How much did PageFly grow over the last 6 months?

> Compare Klaviyo's and Omnisend's growth.

</details>

**Hoặc gõ lệnh:** `/storeleads:growth-check …`

**Bạn nhận được:** Biểu đồ theo tháng, % tăng trong khoảng thời gian, tách riêng Plus; có thể so 2 app.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Có vài tháng dữ liệu nhảy bất thường do cách StoreLeads thu thập (Plus 2/2025, 2/2026; 11/2025; 9/2026).
- Không có dữ liệu trước 10/2024 — hỏi xa hơn thì Claude sẽ nói là không có.

**Xem trên dashboard:** [Growth](https://storedata.ecvision.ai/d/sl-app-growth)

### Ai tăng nhanh nhất

**Dành cho:** PM, Leadership

**Hỏi như này:**

> App nào tăng nhiều store Plus nhất 12 tháng qua?
> Trong nhóm Social trust, app nào tăng nhiều nhất?

<details><summary>English</summary>

> Which app gained the most Plus stores over the last 12 months?

</details>

**Bạn nhận được:** Top app theo số store tăng thêm (hoặc %), trong toàn thị trường hoặc một nhóm.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Có vài tháng dữ liệu nhảy bất thường do cách StoreLeads thu thập (Plus 2/2025, 2/2026; 11/2025; 9/2026).
- Nhóm Level 1 / Level 2 là cách nhóm tạm (draft) của team, không phải của Shopify.

**Xem trên dashboard:** [Momentum](https://storedata.ecvision.ai/d/sl-cat-momentum)

## Hiểu churn

_Store bỏ app thì đi đâu, tỷ lệ bỏ bao nhiêu, phân biệt gỡ thật với store đóng cửa._

### Bỏ app này thì đi đâu

**Dành cho:** PM, Marketing

**Hỏi như này:**

> Khi bỏ Klaviyo, merchant chuyển sang app email nào nhiều nhất?

<details><summary>English</summary>

> When merchants drop Klaviyo, which email app do they switch to?

</details>

**Bạn nhận được:** Số store gỡ thật (store vẫn hoạt động), và các app cùng category mà họ chuyển sang.

**Lưu ý:**

- "Mất store" gồm cả store đóng cửa/rời dữ liệu, không chỉ gỡ app. Muốn số gỡ thật, hỏi rõ "gỡ app thật".
- Tên app hay trùng nhau. Nếu Claude hỏi lại "ý bạn là app nào", hãy chọn đúng app.

**Xem trên dashboard:** [Churn](https://storedata.ecvision.ai/d/sl-app-churn)

### Post-mortem churn

**Dành cho:** PM, Leadership

**Hỏi như này:**

> Làm post-mortem churn cho Loox.

<details><summary>English</summary>

> Do a churn post-mortem for Loox.

</details>

**Hoặc gõ lệnh:** `/storeleads:churn-postmortem …`

**Bạn nhận được:** Tỷ lệ bỏ theo tháng, gỡ thật vs store biến mất, đối thủ nhận store, khác biệt theo Plus và quốc gia.

**Lưu ý:**

- "Mất store" gồm cả store đóng cửa/rời dữ liệu, không chỉ gỡ app. Muốn số gỡ thật, hỏi rõ "gỡ app thật".
- Có vài tháng dữ liệu nhảy bất thường do cách StoreLeads thu thập (Plus 2/2025, 2/2026; 11/2025; 9/2026).

**Xem trên dashboard:** [Churn](https://storedata.ecvision.ai/d/sl-app-churn)

## Plus & thị trường theo nước

_Shopify Plus, quốc gia, theme, store mới mở._

### App mạnh ở nước nào

**Dành cho:** Marketing, PM

**Hỏi như này:**

> Klaviyo có nhiều store nhất ở 2 nước nào?
> Judge.me mạnh ở UK hay Úc hơn, so với độ phủ chung?

<details><summary>English</summary>

> Which countries hold most Klaviyo stores?

> Is Judge.me stronger in the UK or Australia relative to its reach?

</details>

**Bạn nhận được:** Top quốc gia theo số store và chỉ số "mạnh hơn mặt bằng" (reach index).

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Tên app hay trùng nhau. Nếu Claude hỏi lại "ý bạn là app nào", hãy chọn đúng app.

**Xem trên dashboard:** [Geo](https://storedata.ecvision.ai/d/sl-app-geo)

### Khoảng trống Shopify Plus

**Dành cho:** PM, Marketing, Leadership

**Hỏi như này:**

> Bao nhiêu store Plus ở Mỹ chưa có app review nào?

<details><summary>English</summary>

> How many US Plus stores have no reviews app?

</details>

**Hoặc gõ lệnh:** `/storeleads:plus-gap …`

**Bạn nhận được:** Số store Plus chưa có app nào trong category, theo quốc gia.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.
- Chỉ dùng nội bộ. Không xuất danh sách store để outreach, không đăng số liệu ra ngoài.

**Xem trên dashboard:** [Geo](https://storedata.ecvision.ai/d/sl-cat-geo)

### Store mới mở dùng gì

**Dành cho:** Marketing, PM

**Hỏi như này:**

> Bao nhiêu % store mở trong 90 ngày qua dùng Klaviyo?

<details><summary>English</summary>

> What share of stores created in the last 90 days run Klaviyo?

</details>

**Bạn nhận được:** Tỷ lệ store mới dùng app / category, so với toàn thị trường.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.

**Xem trên dashboard:** [Merchants](https://storedata.ecvision.ai/d/sl-app-merchants)

### Merchant của app dùng theme gì

**Dành cho:** Marketing

**Hỏi như này:**

> Merchant của Judge.me dùng theme nào nhiều nhất?

<details><summary>English</summary>

> Which theme do Judge.me merchants use most?

</details>

**Bạn nhận được:** Top theme của merchant dùng app, so với mặt bằng.

**Lưu ý:**

- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.

**Xem trên dashboard:** [Merchants](https://storedata.ecvision.ai/d/sl-app-merchants)

## Số liệu cho pitch & chiến lược

_Một trang tổng hợp gửi được cho sếp hoặc đối tác nội bộ._

### Gộp thành một trang để gửi

**Dành cho:** PM, Leadership

**Hỏi như này:**

> Gộp các câu trả lời ở trên thành một trang báo cáo gửi sếp.

<details><summary>English</summary>

> Turn the answers above into one report page.

</details>

**Bạn nhận được:** Một trang HTML có biểu đồ, bảng và đủ lưu ý, gửi được trong nội bộ.

**Lưu ý:**

- Chỉ dùng nội bộ. Không xuất danh sách store để outreach, không đăng số liệu ra ngoài.
- "Hiện nay" = snapshot mới nhất (9/2026), không phải hôm nay. Dữ liệu có 24 tháng, 10/2024 → 9/2026.

### Danh sách store (giới hạn)

**Dành cho:** PM

**Hỏi như này:**

> Cho mình 20 store Plus ở Đức đang dùng Klaviyo nhưng chưa có Shopify Inbox.

<details><summary>English</summary>

> Show 20 German Plus stores running Klaviyo but not Shopify Inbox.

</details>

**Bạn nhận được:** Số đếm + một danh sách ngắn để phân tích. Cần bản đầy đủ thì nhắn Toàn.

**Lưu ý:**

- Chỉ dùng nội bộ. Không xuất danh sách store để outreach, không đăng số liệu ra ngoài.

**Xem trên dashboard:** [Stores list](https://storedata.ecvision.ai/d/sl-app-merchants)

---
_Trang này được sinh từ `src/data/guide-cases.ts`. Đọc số cho đúng: [lưu ý chi tiết](./03-doc-so-cho-dung.md)._
