// AI Coding
/**
 * @file SearchBar.tsx
 * @description Presentation — ô tìm kiếm in-document + điều hướng kết quả (FR-09/10). Scaffold placeholder.
 */
export function SearchBar() {
  return (
    <input
      data-testid="search-bar"
      type="search"
      disabled
      placeholder="Tìm trong tài liệu… (scaffold placeholder)"
      className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
    />
  )
}
