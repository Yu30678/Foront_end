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

export async function POST(request: NextRequest) {
  try {
    const body: { member_id: number } = await request.json()

    if (!body.member_id) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '會員編號為必填',
        },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
      method: 'POST',
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