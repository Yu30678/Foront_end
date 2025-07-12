import axios from 'axios'
import { API_URL } from './config'
import { ApiResponse } from '@/types/auth'

// 設定axios預設值
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 回應攔截器處理錯誤
api.interceptors.response.use(
  (response) => {
    // 檢查API回傳格式 {status, data, message} 並轉換為 {code, data, message}
    if (response.data && typeof response.data === 'object') {
      // 如果後端返回的是status，轉換為code
      if (response.data.status && !response.data.code) {
        response.data.code = response.data.status
      }
      console.log('API攔截器: 處理後的回應:', response.data)
      return response.data // 直接返回 {code, data, message}
    }
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)

    // 如果後端有返回錯誤訊息，保持格式一致
    if (error.response?.data) {
      const errorData = error.response.data
      // 轉換status為code
      if (errorData.status && !errorData.code) {
        errorData.code = errorData.status
      }
      return Promise.resolve(errorData)
    }

    // 否則回傳統一格式
    return Promise.resolve({
      code: error.response?.status || 500,
      data: null,
      message: error.message || '請求失敗',
    })
  },
)

// 通用API呼叫
export const getAPI = async (path: string): Promise<ApiResponse> => {
  const response = await api.get(path)
  return response as unknown as ApiResponse // 攔截器已處理格式
}

export const postAPI = async (
  path: string,
  data: unknown,
): Promise<ApiResponse> => {
  const response = await api.post(path, data)
  return response as unknown as ApiResponse // 攔截器已處理格式
}

export const putAPI = async (
  path: string,
  data: unknown,
): Promise<ApiResponse> => {
  const response = await api.put(path, data)
  return response as unknown as ApiResponse // 攔截器已處理格式
}

export const deleteAPI = async (
  path: string,
  data?: unknown,
): Promise<ApiResponse> => {
  const response = await api.delete(path, { data })
  return response as unknown as ApiResponse // 攔截器已處理格式
}

// 認證相關API
export const authAPI = {
  // 會員註冊
  register: async (userData: {
    name: string
    email: string
    password: string
    phone: string
    address: string
  }) => {
    return await postAPI('/member', userData)
  },

  // 會員登入
  login: async (credentials: { email: string; password: string }) => {
    return await postAPI('/member/login', credentials)
  },

  // 管理員登入
  adminLogin: async (credentials: { account: string; password: string }) => {
    return await postAPI('/user/users/login', credentials)
  },

  // 管理員功能 - 取得會員列表
  getMembers: async (memberId?: string) => {
    const path = memberId
      ? `/user/members?member_id=${memberId}`
      : '/user/members'
    return await getAPI(path)
  },

  // 管理員功能 - 新增會員
  createMember: async (memberData: unknown) => {
    return await postAPI('/user/members', memberData)
  },

  // 管理員功能 - 更新會員
  updateMember: async (memberData: unknown) => {
    return await putAPI('/user/members', memberData)
  },

  // 管理員功能 - 刪除會員
  deleteMember: async (memberData: unknown) => {
    return await deleteAPI('/user/members', memberData)
  },
}

// 會員相關API (前台使用)
export const memberAPI = {
  // 取得會員資料
  getMemberData: async (memberId: number) => {
    return await getAPI(`/member?member_id=${memberId}`)
  },

  // 更新會員資料
  updateMemberData: async (memberData: unknown) => {
    return await putAPI('/member', memberData)
  },

  // 修改會員密碼
  changePassword: async (passwordData: {
    member_id: number
    old_password: string
    new_password: string
  }) => {
    return await putAPI('/member/password', passwordData)
  },

  // 刪除會員帳號
  deleteMemberAccount: async (memberData: unknown) => {
    return await deleteAPI('/member', memberData)
  },
}

// 產品相關API
export const productAPI = {
  // 取得產品列表
  getProducts: async () => {
    return await getAPI('/product')
  },

  // 取得單一產品
  getProduct: async (productId: number) => {
    return await getAPI(`/product/${productId}`)
  },

  // 管理員功能 - 取得所有產品
  getAdminProducts: async () => {
    return await getAPI('/user/products')
  },

  // 管理員功能 - 新增產品
  createProduct: async (productData: unknown) => {
    return await postAPI('/user/products', productData)
  },

  // 管理員功能 - 更新產品
  updateProduct: async (productData: unknown) => {
    return await putAPI('/user/products', productData)
  },

  // 管理員功能 - 刪除產品
  deleteProduct: async (productData: unknown) => {
    return await deleteAPI('/user/products', productData)
  },
}

// 購物車相關API
export const cartAPI = {
  // 加入購物車
  addToCart: async (cartData: {
    member_id: number
    product_id: number
    quantity: number
  }) => {
    return await postAPI('/cart', cartData)
  },

  // 取得購物車
  getCart: async (memberId: number) => {
    return await getAPI(`/cart?member_id=${memberId}`)
  },

  // 更新購物車
  updateCart: async (cartData: {
    member_id: number
    product_id: number
    quantity: number
  }) => {
    return await putAPI('/cart', cartData)
  },

  // 移除購物車商品
  removeFromCart: async (memberId: number, productId: number) => {
    return await deleteAPI(
      `/cart?member_id=${memberId}&product_id=${productId}`,
    )
  },
}

// 類別相關API
export const categoryAPI = {
  // 管理員功能 - 取得所有類別
  getCategories: async () => {
    return await getAPI('/user/categories')
  },

  // 管理員功能 - 新增類別
  createCategory: async (categoryData: { name: string }) => {
    return await postAPI('/user/categories', categoryData)
  },

  // 管理員功能 - 更新類別
  updateCategory: async (categoryData: {
    category_id: number
    name: string
  }) => {
    return await putAPI('/user/categories', categoryData)
  },

  // 管理員功能 - 刪除類別
  deleteCategory: async (categoryData: { category_id: number }) => {
    return await deleteAPI('/user/categories', categoryData)
  },
}

// 檔案上傳相關API
export const uploadAPI = {
  // 上傳圖片
  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response as unknown as ApiResponse
  },
}

// 訂單相關API
export const orderAPI = {
  // 建立訂單
  createOrder: async (orderData: { member_id: number }) => {
    return await postAPI('/order', orderData)
  },

  // 取得訂單 (會員專用)
  getOrders: async (memberId?: number) => {
    const path = memberId
      ? `/user/orders?member_id=${memberId}`
      : '/user/orders'
    return await getAPI(path)
  },
}
