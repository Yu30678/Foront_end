// API回應基本結構
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 會員資料
export interface Member {
  member_id: number
  name: string
  email: string
  phone: string
  address: string
  create_at?: string
}

// 登入表單
export interface LoginForm {
  email: string
  password: string
}

// 管理員登入表單
export interface AdminLoginForm {
  account: string
  password: string
}

// 註冊表單
export interface RegisterForm {
  name: string
  email: string
  password: string
  phone: string
  address: string
}

// 登入狀態
export interface AuthState {
  isLoggedIn: boolean
  user: Member | null
  userType: 'member' | 'admin' | null
}

// 產品資料
export interface Product {
  product_id: number
  name: string
  price: number
  soh: number
  category_id: number
  is_active?: boolean
}

// 購物車項目
export interface CartItem {
  member_id: number
  product_id: number
  quantity: number
}

// 訂單
export interface Order {
  order_id?: number
  member_id: number
  create_at?: string
}
