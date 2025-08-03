import { NextRequest, NextResponse } from 'next/server'

interface PasswordChangeRequest {
  member_id: number
  old_password: string
  new_password: string
}

export async function PUT(request: NextRequest) {
  try {
    const body: PasswordChangeRequest = await request.json()

    if (!body.member_id || !body.old_password || !body.new_password) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '會員編號、舊密碼和新密碼為必填',
        },
        { status: 400 },
      )
    }

    // 模擬密碼變更邏輯
    // 在實際應用中，這裡應該連接到資料庫進行驗證和更新

    // 模擬檢查舊密碼
    if (body.old_password !== 'oldpassword123') {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '舊密碼不正確',
        },
        { status: 400 },
      )
    }

    // 模擬密碼更新成功
    return NextResponse.json({
      status: 200,
      data: {
        member_id: body.member_id,
        message: '密碼已成功更新',
      },
      message: '密碼變更成功',
    })
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
