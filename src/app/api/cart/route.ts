import { NextRequest, NextResponse } from 'next/server'

interface CartItem {
  member_id: number
  product_id: number
  quantity: number
  create_at: string
  product_name: string
  product_price: number
  image_url: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('member_id')

    if (!memberId) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '會員編號為必填',
        },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart?member_id=${memberId}`)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.member_id || !body.product_id || !body.quantity) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '會員編號、商品編號和數量為必填',
        },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.member_id || !body.product_id || !body.quantity) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '會員編號、商品編號和數量為必填',
        },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('member_id')
    const productId = searchParams.get('product_id')

    if (!memberId || !productId) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '會員編號和商品編號為必填',
        },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart?member_id=${memberId}&product_id=${productId}`, {
      method: 'DELETE',
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