import { NextRequest, NextResponse } from 'next/server'

interface Category {
  category_id?: number
  name: string
}

export async function GET() {
  try {
    return NextResponse.json({
      status: 200,
      data: [
        { category_id: 1, name: '電子產品' },
        { category_id: 2, name: '服裝' },
        { category_id: 3, name: '手錶' },
      ],
      message: '成功取得商品類別列表',
    })
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

export async function POST(request: NextRequest) {
  try {
    const body: Category = await request.json()

    if (!body.name) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '類別名稱為必填',
        },
        { status: 400 },
      )
    }

    const newCategory = {
      category_id: Math.floor(Math.random() * 10000),
      name: body.name,
    }

    return NextResponse.json({
      status: 201,
      data: newCategory,
      message: '商品類別新增成功',
    })
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

export async function PUT(request: NextRequest) {
  try {
    const body: Category = await request.json()

    if (!body.category_id || !body.name) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '類別編號和名稱為必填',
        },
        { status: 400 },
      )
    }

    const updatedCategory = {
      category_id: body.category_id,
      name: body.name,
    }

    return NextResponse.json({
      status: 200,
      data: updatedCategory,
      message: '商品類別更新成功',
    })
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

export async function DELETE(request: NextRequest) {
  try {
    const body: Pick<Category, 'category_id'> = await request.json()

    if (!body.category_id) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '類別編號為必填',
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      status: 200,
      data: { category_id: body.category_id },
      message: '商品類別刪除成功',
    })
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