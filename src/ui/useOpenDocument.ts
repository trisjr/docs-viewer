// AI Coding
/**
 * @file useOpenDocument.ts
 * @description Presentation hook — đường mở tài liệu dùng chung cho UploadZone (dropzone) lẫn nút "Mở file"
 * trên shell (UC-02 A2). Dispatch OPEN_STARTED → open() → SESSION_OPENED + EXTRACTION_READY / ERROR.
 * Lưu ý: extract 'Empty'/'Failed' KHÔNG phải lỗi mở tài liệu — vẫn đi qua EXTRACTION_READY (non-blocking, D7),
 * chỉ lỗi mở thật (UploadRejectedError / CORRUPT) mới rơi vào ERROR.
 */
import { useAppStore } from 'app/state/store'
import { UploadRejectedError } from 'app/validation'

export function useOpenDocument(): (file: File) => Promise<void> {
  const { dispatch, services } = useAppStore()

  return async (file: File): Promise<void> => {
    dispatch({ type: 'OPEN_STARTED', fileName: file.name, fileSize: file.size })
    try {
      const session = await services.documentService.open(file)
      dispatch({ type: 'SESSION_OPENED', session })
      dispatch({ type: 'EXTRACTION_READY', extracted: services.documentService.getExtracted(session.id) })
    } catch (error) {
      if (error instanceof UploadRejectedError) {
        dispatch({ type: 'ERROR', error: { kind: error.kind, message: error.message } })
      } else {
        dispatch({
          type: 'ERROR',
          error: {
            kind: 'CORRUPT',
            message: 'Không mở được file. File có thể bị hỏng hoặc không đọc được.',
          },
        })
      }
    }
  }
}
