## ADDED Requirements

### Requirement: File Intake (Picker & Drag-Drop)
Hệ thống SHALL cho phép người dùng đưa một file vào DocsViewer qua chọn file (file picker) hoặc kéo-thả (drag-and-drop), và xử lý file giống nhau ở cả hai cách.

#### Scenario: Chọn file qua picker
- **WHEN** người dùng chọn một file qua file picker
- **THEN** hệ thống tiếp nhận file và chuyển sang bước validate

#### Scenario: Kéo-thả file vào vùng upload
- **WHEN** người dùng kéo một file và thả vào vùng upload
- **THEN** hệ thống nhận diện file giống thao tác chọn qua picker và chuyển sang bước validate

### Requirement: Validation Gate (Format & Size)
Hệ thống SHALL validate `FileFormat` và dung lượng (`MAX_FILE_SIZE`) của file TRƯỚC khi bàn giao cho pipeline View/Extract. Ở Sprint 1 định dạng được hỗ trợ đầy đủ là PDF với ngưỡng `MAX_FILE_SIZE` = 25 MB. Việc validate MUST hoàn tất thành công trước khi `DocumentSession` được khởi tạo.

#### Scenario: File PDF hợp lệ trong ngưỡng dung lượng
- **WHEN** người dùng đưa vào một file PDF trong ngưỡng `MAX_FILE_SIZE`
- **THEN** hệ thống chấp nhận file và cho phép khởi tạo phiên xem

#### Scenario: Validate hoàn tất trước khi bàn giao
- **WHEN** một file vừa được tiếp nhận
- **THEN** hệ thống hoàn tất kiểm tra định dạng và dung lượng
- **AND** chỉ bàn giao tài liệu cho pipeline View/Extract sau khi validate thành công

#### Scenario: Định dạng không được hỗ trợ bị từ chối
- **WHEN** người dùng đưa vào một file có định dạng không nhận diện được (ví dụ `.pptx`)
- **THEN** hệ thống từ chối file
- **AND** hiển thị thông báo nêu rõ các định dạng được hỗ trợ

#### Scenario: File vượt ngưỡng dung lượng bị từ chối
- **WHEN** người dùng đưa vào một file vượt `MAX_FILE_SIZE`
- **THEN** hệ thống từ chối upload
- **AND** hiển thị thông báo nêu rõ giới hạn dung lượng và dung lượng thực tế của file

### Requirement: Session Initialization & Handoff
Sau khi validate thành công, hệ thống SHALL khởi tạo một `DocumentSession` và bàn giao tài liệu cho pipeline View/Extract.

#### Scenario: Khởi tạo phiên và bàn giao pipeline
- **WHEN** một file PDF hợp lệ đã qua validate thành công
- **THEN** hệ thống khởi tạo `DocumentSession` cho file đó
- **AND** bàn giao tài liệu cho lớp xử lý để render và trích xuất
