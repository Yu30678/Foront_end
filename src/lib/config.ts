export const API_URL = process.env.NEXT_PUBLIC_API_URL

// 調試：輸出API URL
console.log('API_URL配置:', API_URL)
console.log('環境變數 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)

// 驗證API URL
if (!API_URL) {
  console.error('❌ 環境變數 NEXT_PUBLIC_API_URL 未設置')
} else if (API_URL.includes('%')) {
  console.error('❌ API URL包含無效字符:', API_URL)
} else {
  console.log('✅ API URL配置正確:', API_URL)
}
