import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('member_id')

    const queryParams = memberId ? `?member_id=${memberId}` : ''
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/orders${queryParams}`,
    )

    const result = await response.json()
    return NextResponse.json(result)
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
