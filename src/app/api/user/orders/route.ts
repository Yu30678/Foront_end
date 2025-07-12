import { NextRequest, NextResponse } from 'next/server'

interface Order {
  order_id: number
  member_id: number
  total_amount: number
  create_at: string
  order_details?: OrderDetail[]
}

interface OrderDetail {
  product_id: number
  product_name: string
  quantity: number
  price: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('member_id')

    const queryParams = memberId ? `?member_id=${memberId}` : ''
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/orders${queryParams}`)
    
    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
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