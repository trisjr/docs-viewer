// AI Coding
/**
 * @file limits.ts
 * @description Shared Kernel — ngưỡng dung lượng tối đa khi upload theo định dạng (bytes).
 * SDD §8 / DB-Entity §9.2: PDF 25MB, DOCX 25MB, XLSX 15MB (SheetJS bung cell-objects tốn bộ nhớ hơn).
 */
import { FileFormat } from './FileFormat'

const BYTES_PER_MB = 1024 * 1024

export const MAX_FILE_SIZE: Record<FileFormat, number> = {
  [FileFormat.PDF]: 25 * BYTES_PER_MB,
  [FileFormat.DOCX]: 25 * BYTES_PER_MB,
  [FileFormat.XLSX]: 15 * BYTES_PER_MB,
}
