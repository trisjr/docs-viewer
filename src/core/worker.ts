// AI Coding
/**
 * @file worker.ts
 * @description Core — Web Worker entry cho heavy parsing off-main-thread (NFR-01/07). postMessage boundary skeleton.
 * NOTE: DocxAdapter.render (docx-preview) là NGOẠI LỆ có chủ đích — chạy main thread vì cần `document`
 * (SDD §4 NOTE, Integration Spec §7). Worker chỉ phục vụ parse/extract nặng của PDF/XLSX.
 */
import type { FileFormat } from 'domain/FileFormat'

export type WorkerRequest =
  | { type: 'render'; format: FileFormat }
  | { type: 'extract'; format: FileFormat }

export type WorkerResponse =
  | { type: 'result'; payload: unknown }
  | { type: 'error'; message: string }

interface WorkerScope {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null
  postMessage: (message: WorkerResponse) => void
}

const workerScope = self as unknown as WorkerScope

workerScope.onmessage = (event: MessageEvent<WorkerRequest>): void => {
  workerScope.postMessage({
    type: 'error',
    message: `Worker chưa hiện thực (scaffold): ${event.data.type}`,
  })
}
