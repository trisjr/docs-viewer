// AI Coding
/**
 * @file normalize.ts
 * @description Core — chuẩn hóa chuỗi cho search: NFD + bỏ combining marks (U+0300–U+036F) + lowercase + đ→d.
 * BR-006-4 (case & diacritic insensitive, substring). đ/Đ KHÔNG decompose dưới NFD nên cần bước replace riêng.
 * Vd: "da nang" khớp "Đà Nẵng", "bao cao" khớp "Báo Cáo". Contracts §4.3.
 */
export function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
}
