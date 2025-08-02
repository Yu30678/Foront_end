import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      status: 200,
      data: [
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
          product_id: 3,
          name: 'AirPods Pro',
          price: '8000',
          soh: 30,
          category_id: 1,
          is_active: true,
          image_url: null,
        },
        {
          product_id: 4,
          name: 'Apple Watch',
          price: '12000',
          soh: 25,
          category_id: 3,
          is_active: true,
          image_url: null,
        },
      ],
      message: '成功取得商品列表',
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
