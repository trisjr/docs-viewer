// AI Coding
/**
 * @file store.tsx
 * @description Application — React Context + useReducer cho app state; mang theo services đã inject từ composition root.
 * Đây là điểm cắm DI cho Presentation: UI gọi services qua useAppStore (feature M1 dùng), không tự khởi tạo Core/Data.
 */
import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import { appReducer, initialState } from './reducer'
import type { AppAction, AppState } from './reducer'
import type { DocumentService } from 'app/DocumentService'
import type { SearchService } from 'app/SearchService'

export interface AppServices {
  documentService: DocumentService
  searchService: SearchService
}

interface AppStore {
  state: AppState
  dispatch: Dispatch<AppAction>
  services: AppServices
}

const AppStoreContext = createContext<AppStore | undefined>(undefined)

export function AppStoreProvider({
  services,
  children,
}: {
  services: AppServices
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppStoreContext.Provider value={{ state, dispatch, services }}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore(): AppStore {
  const store = useContext(AppStoreContext)
  if (!store) {
    throw new Error('useAppStore phải được dùng bên trong <AppStoreProvider>')
  }
  return store
}
