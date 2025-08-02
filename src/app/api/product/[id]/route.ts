import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params
    const productId = parseInt(params.id)

    const products = [
      {
        product_id: 1,
        name: 'iPhone 15',
        price: '30000',
        soh: 50,
        category_id: 1,
        is_active: true,
        image_url: '/uploads/sample-phone.jpg',
      },
      {
        product_id: 2,
        name: 'MacBook Pro',
        price: '60000',
        soh: 20,
        category_id: 1,
        is_active: true,
        image_url: '/uploads/sample-laptop.jpg',
      },
      {
        product_id: 8,
        name: 'iPad Pro',
        price: '35000',
        soh: 15,
        category_id: 1,
        is_active: true,
        image_url: null,
      },
      {
        product_id: 46,
        name: 'Apple Watch Ultra',
        price: '25000',
        soh: 30,
        category_id: 3,
        is_active: true,
        image_url: null,
      },
    ]

    const product = products.find((p) => p.product_id === productId)

    if (!product) {
      return NextResponse.json(
        {
          status: 404,
          data: null,
          message: '商品不存在',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      status: 200,
      data: product,
      message: '成功取得商品資料',
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
