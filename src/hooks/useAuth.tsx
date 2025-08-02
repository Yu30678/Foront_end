'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  ReactNode,
} from 'react'
import {
  AuthState,
  Member,
  LoginForm,
  RegisterForm,
  AdminLoginForm,
} from '@/types/auth'
import { authAPI } from '@/lib/api'

const AUTH_STORAGE_KEY = 'auth_state'

// 安全的localStorage操作
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(key)
      } catch (error) {
        console.error('localStorage getItem error:', error)
        return null
      }
    }
    return null
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value)
      } catch (error) {
        console.error('localStorage setItem error:', error)
      }
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error('localStorage removeItem error:', error)
      }
    }
  },
}

interface AuthContextType {
  authState: AuthState
  login: (
    credentials: LoginForm,
  ) => Promise<{ success: boolean; message: string }>
  adminLogin: (
    credentials: AdminLoginForm,
  ) => Promise<{ success: boolean; message: string }>
  register: (
    userData: RegisterForm,
  ) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isAdmin: () => boolean
  isMember: () => boolean
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    userType: null,
  })
  const [isInitialized, setIsInitialized] = useState(false)

  // 使用useLayoutEffect確保在DOM更新前完成狀態初始化
  useLayoutEffect(() => {
    const savedAuth = safeLocalStorage.getItem(AUTH_STORAGE_KEY)
    console.log('AuthProvider: 初始化 - 載入localStorage數據:', savedAuth)

    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth)
        console.log('AuthProvider: 初始化 - 解析後的數據:', parsedAuth)
        setAuthState(parsedAuth)
      } catch (error) {
        console.error('Failed to parse auth state:', error)
        safeLocalStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }

    setIsInitialized(true)
    console.log('AuthProvider: 初始化完成')
  }, [])

  // 儲存認證狀態到localStorage
  const saveAuthState = useCallback((newState: AuthState) => {
    console.log('AuthProvider: 儲存新狀態:', newState)

    // 先同步更新localStorage
    safeLocalStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState))
    console.log('AuthProvider: localStorage已更新')

    // 驗證localStorage是否正確儲存
    const saved = safeLocalStorage.getItem(AUTH_STORAGE_KEY)
    console.log('AuthProvider: 驗證localStorage:', saved)

    // 使用函數式更新確保狀態正確設置
    setAuthState((prevState) => {
      console.log(
        'AuthProvider: 準備更新React狀態，從:',
        prevState,
        '到:',
        newState,
      )
      return { ...newState }
    })
    console.log('AuthProvider: React狀態已更新')
  }, [])

  // 會員登入
  const login = async (credentials: LoginForm) => {
    try {
      console.log('AuthProvider: 開始會員登入，發送數據:', credentials)
      const response = await authAPI.login(credentials)
      console.log('AuthProvider: API原始回應:', response)
      console.log('AuthProvider: API回應類型:', typeof response)
      console.log(
        'AuthProvider: API回應詳細:',
        JSON.stringify(response, null, 2),
      )

      // 檢查response的結構
      if (response) {
        console.log('AuthProvider: response.status:', response.status)
        console.log('AuthProvider: response.data:', response.data)
        console.log('AuthProvider: response.message:', response.message)
      }

      // 檢查API回傳格式 {status, data, message}
      if (response && response.status === 200 && response.data) {
        console.log('AuthProvider: 進入成功邏輯分支')
        console.log('AuthProvider: response.data內容:', response.data)

        const user: Member = {
          member_id: response.data.member_id,
          name: response.data.name || credentials.email,
          email: credentials.email,
          phone: response.data.phone || '',
          address: response.data.address || '',
          create_at: response.data.create_at,
        }

        console.log('AuthProvider: 構建的user對象:', user)

        const newAuthState = {
          isLoggedIn: true,
          user,
          userType: 'member' as const,
        }

        console.log('AuthProvider: 準備保存認證狀態:', newAuthState)

        // 立即保存狀態
        saveAuthState(newAuthState)

        return { success: true, message: response.message || '登入成功' }
      } else {
        console.log('AuthProvider: 登入失敗 - 條件不滿足')
        console.log('AuthProvider: response存在嗎?', !!response)
        console.log(
          'AuthProvider: response.status === 200?',
          response?.status === 200,
        )
        console.log('AuthProvider: response.data存在嗎?', !!response?.data)
      }

      return { success: false, message: response?.message || '登入失敗' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: '登入失敗，請檢查帳號密碼' }
    }
  }

  // 管理員登入
  const adminLogin = async (credentials: AdminLoginForm) => {
    try {
      console.log('AuthProvider: 開始管理員登入')
      const response = await authAPI.adminLogin(credentials)
      console.log('AuthProvider: API回應:', response)

      if (response && response.status === 200 && response.data) {
        const user: Member = {
          member_id: response.data.member_id,
          name: response.data.name || credentials.account,
          email: response.data.email || credentials.account,
          phone: response.data.phone || '',
          address: response.data.address || '',
          create_at: response.data.create_at,
        }

        const newAuthState = {
          isLoggedIn: true,
          user,
          userType: 'admin' as const,
        }

        console.log('AuthProvider: 準備保存認證狀態:', newAuthState)
        saveAuthState(newAuthState)

        return { success: true, message: response.message || '管理員登入成功' }
      }

      return { success: false, message: response?.message || '管理員登入失敗' }
    } catch (error) {
      console.error('Admin login error:', error)
      return { success: false, message: '管理員登入失敗，請檢查帳號密碼' }
    }
  }

  // 註冊
  const register = async (userData: RegisterForm) => {
    try {
      const response = await authAPI.register(userData)

      if (response && response.status === 200) {
        return {
          success: true,
          message: response.message || '註冊成功，請登入',
        }
      }

      return { success: false, message: response?.message || '註冊失敗' }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, message: '註冊失敗，請稍後再試' }
    }
  }

  // 登出
  const logout = useCallback(() => {
    console.log('AuthProvider: 執行登出')
    saveAuthState({
      isLoggedIn: false,
      user: null,
      userType: null,
    })
  }, [saveAuthState])

  // 檢查是否為管理員
  const isAdmin = useCallback(() => {
    return authState.userType === 'admin'
  }, [authState.userType])

  // 檢查是否為會員
  const isMember = useCallback(() => {
    return authState.userType === 'member'
  }, [authState.userType])

  // 調試用：監控authState變化
  useEffect(() => {
    console.log('AuthProvider: authState已更新:', authState)
    console.log('AuthProvider: isInitialized:', isInitialized)
  }, [authState, isInitialized])

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        adminLogin,
        register,
        logout,
        isAdmin,
        isMember,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
