import { NextRequest, NextResponse } from 'next/server'

interface Product {
  product_id?: number
  name: string
  price: string
  soh: number
  category_id: number
  is_active?: boolean
  image_url?: string
}

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

export async function POST(request: NextRequest) {
  try {
    const body: Product = await request.json()

    if (!body.name || !body.price || !body.soh || !body.category_id) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '商品名稱、價格、庫存數量及類別編號為必填',
        },
        { status: 400 },
      )
    }

    const newProduct = {
      product_id: Math.floor(Math.random() * 10000),
      name: body.name,
      price: body.price,
      soh: body.soh,
      category_id: body.category_id,
      is_active: true,
      image_url: body.image_url || null,
    }

    return NextResponse.json({
      status: 201,
      data: newProduct,
      message: '商品新增成功',
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

export async function PUT(request: NextRequest) {
  try {
    const body: Product = await request.json()

    if (!body.product_id) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '商品編號為必填',
        },
        { status: 400 },
      )
    }

    const updatedProduct = {
      product_id: body.product_id,
      name: body.name,
      price: body.price,
      soh: body.soh,
      category_id: body.category_id,
      is_active: body.is_active,
      image_url: body.image_url,
    }

    return NextResponse.json({
      status: 200,
      data: updatedProduct,
      message: '商品更新成功',
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

export async function DELETE(request: NextRequest) {
  try {
    const body: Pick<Product, 'product_id'> = await request.json()

    if (!body.product_id) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '商品編號為必填',
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      status: 200,
      data: { product_id: body.product_id },
      message: '商品刪除成功',
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
