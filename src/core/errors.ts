// AI Coding
/**
 * @file errors.ts
 * @description Core — error đánh dấu các điểm scaffold chưa hiện thực (walking skeleton).
 * Feature change M1 sẽ thay thân stub bằng logic thật; grep `NotImplementedError` để tìm chỗ cần fill.
 */
export class NotImplementedError extends Error {
  constructor(feature: string) {
    super(`Chưa hiện thực (scaffold): ${feature}`)
    this.name = 'NotImplementedError'
  }
}
