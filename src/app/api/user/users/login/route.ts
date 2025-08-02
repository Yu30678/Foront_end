import { NextRequest, NextResponse } from 'next/server'

interface LoginCredentials {
  account: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json()

    if (!body.account || !body.password) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '帳號和密碼為必填',
        },
        { status: 400 },
      )
    }

    // 模擬管理員登入驗證
    if (
      (body.account === 'admin' && body.password === 'admin123') ||
      (body.account === '000' && body.password === '000')
    ) {
      const user = {
        userId: 1,
        account: body.account,
        name: body.account === '000' ? 'yu' : '系統管理員',
        password: body.password,
        level: 1,
      }

      return NextResponse.json({
        status: 200,
        data: user,
        message: '管理員登入成功',
      })
    }

    return NextResponse.json(
      {
        status: 401,
        data: null,
        message: '帳號或密碼錯誤',
      },
      { status: 401 },
    )
  } catch {
    return NextResponse.json(
      {
        status: 500,
        data: null,
        message: '伺服器錯誤',
      },
      { status: 500 },
    )
  }
}
