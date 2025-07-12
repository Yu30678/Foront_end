import { NextRequest, NextResponse } from 'next/server'

interface LoginCredentials {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json()

    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '電子郵件和密碼為必填',
        },
        { status: 400 }
      )
    }

    // 模擬登入驗證
    if (body.email === 'test@example.com' && body.password === 'password') {
      const user = {
        member_id: 12345,
        name: '測試用戶',
        email: body.email,
        phone: '0912345678',
        address: '台北市信義區',
        create_at: '2025-01-01T10:00:00',
      }

      return NextResponse.json({
        status: 200,
        data: user,
        message: '登入成功',
      })
    }

    return NextResponse.json(
      {
        status: 401,
        data: null,
        message: '電子郵件或密碼錯誤',
      },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        data: null,
        message: '伺服器錯誤',
      },
      { status: 500 }
    )
  }
}