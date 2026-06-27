## ADDED Requirements

### Requirement: Unified Viewer Format Dispatch
Unified Viewer SHALL tự nhận diện `FileFormat` của tài liệu đã bàn giao và dispatch đúng renderer trong cùng một giao diện xem thống nhất. Khi không có renderer hoạt động cho định dạng, hệ thống MUST hiển thị trạng thái "định dạng không được hỗ trợ" thay vì hiển thị nội dung sai.

#### Scenario: Nhận diện định dạng và chọn renderer
- **WHEN** một tài liệu PDF hợp lệ được bàn giao cho Unified Viewer
- **THEN** hệ thống xác định `FileFormat` là PDF và chọn PDF renderer
- **AND** hiển thị tài liệu trong giao diện xem thống nhất

#### Scenario: Không có renderer phù hợp
- **WHEN** một tài liệu có định dạng chưa có renderer hoạt động được bàn giao
- **THEN** hệ thống hiển thị trạng thái "định dạng không được hỗ trợ" thay vì khung trống hoặc nội dung sai

### Requirement: PDF Page Rendering & First-Page Performance
Hệ thống SHALL render tài liệu PDF và hiển thị trang đầu. Thời gian mở và hiển thị trang đầu của file baseline (NFR-01 §4.2) MUST ≤ 3 giây (KR1.3).

#### Scenario: Render và hiển thị trang đầu
- **WHEN** một file PDF hợp lệ được render
- **THEN** trang đầu hiển thị trong giao diện xem

#### Scenario: Hiệu năng mở trang đầu của baseline
- **WHEN** người dùng mở file PDF baseline
- **THEN** trang đầu hiển thị trong vòng ≤ 3 giây

### Requirement: PDF Pagination
Hệ thống SHALL cho phép điều hướng next/prev giữa các trang của PDF nhiều trang và hiển thị đúng trang tương ứng.

#### Scenario: Điều hướng trang kế tiếp / trước đó
- **WHEN** người dùng điều hướng tới trang kế tiếp hoặc trang trước
- **THEN** hệ thống hiển thị đúng trang tương ứng và cập nhật chỉ số trang hiện tại

### Requirement: Basic Zoom
Hệ thống SHALL cho phép phóng to / thu nhỏ trang PDF, giữ độ trung thực render ở mức chấp nhận được (KR1.2).

#### Scenario: Zoom in/out
- **WHEN** người dùng phóng to hoặc thu nhỏ trang đang xem
- **THEN** nội dung trang được scale tương ứng mà vẫn giữ độ trung thực chấp nhận được

### Requirement: Consistent Navigation Shell
Unified Viewer SHALL cung cấp shell điều hướng nhất quán: các điều khiển dùng chung (mở file mới, ô tìm kiếm, đóng tài liệu) đặt cùng vị trí và cùng icon; các điều khiển đặc thù định dạng (phân trang/zoom cho PDF) hiển thị nhất quán trong khu vực điều hướng. Shell MUST được thiết kế để host cả ba định dạng (PDF/`.docx`/`.xlsx`) dù Sprint 1 chỉ kiểm chứng với PDF.

#### Scenario: Toolbar và shared controls nhất quán
- **WHEN** người dùng xem một tài liệu PDF trong Unified Viewer
- **THEN** thanh công cụ và các điều khiển dùng chung xuất hiện ở vị trí cố định
- **AND** layout sẵn sàng tái dùng cho `.docx`/`.xlsx` ở các sprint sau mà không đổi vị trí điều khiển dùng chung

### Requirement: Open New Document While Viewing
Khi đang xem một tài liệu, hệ thống SHALL cho phép mở một file hợp lệ khác và thay thế nội dung đang xem bằng tài liệu mới (UC-02 A2).

#### Scenario: Mở tài liệu mới khi đang xem
- **WHEN** người dùng đưa vào một file hợp lệ khác trong khi đang xem một tài liệu
- **THEN** hệ thống thay nội dung đang xem bằng tài liệu mới

### Requirement: Render Failure Handling
Khi PDF hỏng/không parse được hoặc render lỗi nghiêm trọng, hệ thống SHALL hiển thị trạng thái lỗi tường minh và MUST NOT hiển thị nội dung sai lệch một cách âm thầm (BR-004-2).

#### Scenario: PDF hỏng / không parse được
- **WHEN** hệ thống cố render một PDF có nội dung hỏng
- **THEN** hệ thống hiển thị thông báo lỗi và không render nội dung sai

#### Scenario: Render lỗi nghiêm trọng / vỡ layout
- **WHEN** một trang PDF render lỗi nghiêm trọng (mất nội dung hoặc vỡ layout nặng)
- **THEN** hệ thống thông báo trạng thái lỗi thay vì hiển thị nội dung sai lệch âm thầm
