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
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const result = await response.json()
    return NextResponse.json(result)
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