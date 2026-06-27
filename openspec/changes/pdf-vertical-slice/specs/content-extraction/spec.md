## ADDED Requirements

### Requirement: PDF Text Extraction (Text Layer)
Hệ thống SHALL trích xuất nội dung text từ PDF có text layer. Logic parse/extract MUST chạy độc lập với tầng UI và tầng người dùng (KR3.1, Core purity).

#### Scenario: Trích xuất text từ PDF có text layer
- **WHEN** hệ thống thực hiện trích xuất trên một PDF có text layer
- **THEN** text của tài liệu được bóc tách và hiển thị để người dùng xem lại

#### Scenario: Logic trích xuất tách rời UI
- **WHEN** việc trích xuất chạy
- **THEN** logic parse/extract chạy độc lập, không phụ thuộc trực tiếp vào component UI nào

### Requirement: Basic Reading-Order Preservation
Hệ thống SHALL trả về text theo thứ tự trang và thứ tự đọc cơ bản.

#### Scenario: Trích xuất PDF nhiều trang
- **WHEN** hệ thống trích xuất text từ một PDF nhiều trang có text
- **THEN** text được trả về theo thứ tự trang và thứ tự đọc cơ bản

### Requirement: Extracted Content Availability
Nội dung trích xuất SHALL được hiển thị ở `ExtractedContentPanel` và sẵn sàng cho luồng search và feed AI sau này.

#### Scenario: Hiển thị nội dung trích xuất
- **WHEN** việc trích xuất hoàn tất
- **THEN** nội dung text hiển thị ở `ExtractedContentPanel`
- **AND** nội dung sẵn sàng để feed cho luồng search/AI sau này

### Requirement: No-Text-Layer Handling (Non-Blocking Warning)
Khi PDF là ảnh scan / không có text layer, hệ thống SHALL thông báo "không có text trích xuất được" dưới dạng warning non-blocking, và người dùng MUST vẫn xem (view) được tài liệu bình thường. OCR cho PDF scan nằm ngoài phạm vi (defer M2).

#### Scenario: PDF scan không có text layer
- **WHEN** hệ thống thực hiện trích xuất trên một PDF là ảnh scan không có text layer
- **THEN** hệ thống thông báo "không có text trích xuất được" dưới dạng warning
- **AND** người dùng vẫn xem được tài liệu bình thường

### Requirement: Extraction Error on Corrupt Content
Khi nội dung PDF hỏng khiến parse thất bại, hệ thống SHALL hiển thị thông báo lỗi và MUST NOT tạo ra kết quả trích xuất.

#### Scenario: Lỗi parse do nội dung hỏng
- **WHEN** hệ thống thực hiện trích xuất trên một PDF có nội dung hỏng
- **THEN** hệ thống hiển thị thông báo lỗi và không tạo ra kết quả trích xuất
