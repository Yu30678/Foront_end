import { NextRequest, NextResponse } from 'next/server'

interface User {
  userId?: number
  account: string
  password?: string
  name: string
  level?: number
}

export async function GET() {
  try {
    return NextResponse.json({
      status: 200,
      data: [
        {
          userId: 1,
          name: 'yu',
          password: '000',
          account: '000',
          level: 1,
        },
        {
          userId: 2,
          name: 'admin',
          password: 'admin123',
          account: 'admin',
          level: 1,
        },
        {
          userId: 3,
          name: 'manager',
          password: 'manager123',
          account: 'manager',
          level: 2,
        },
      ],
      message: '成功取得管理員列表',
    })
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
    const body: User = await request.json()

    if (!body.account || !body.password || !body.name || body.level === undefined) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '所有欄位皆為必填',
        },
        { status: 400 }
      )
    }

    const newUser = {
      userId: Math.floor(Math.random() * 10000),
      account: body.account,
      name: body.name,
      password: body.password,
      level: body.level,
    }

    return NextResponse.json({
      status: 201,
      data: newUser,
      message: '管理員新增成功',
    })
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
    const body: User = await request.json()

    if (!body.userId) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '管理員編號為必填',
        },
        { status: 400 }
      )
    }

    const updatedUser = {
      userId: body.userId,
      account: body.account,
      name: body.name,
      password: body.password,
      level: body.level,
    }

    return NextResponse.json({
      status: 200,
      data: updatedUser,
      message: '管理員更新成功',
    })
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
    const body: Pick<User, 'userId'> = await request.json()

    if (!body.userId) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '管理員編號為必填',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      status: 200,
      data: { userId: body.userId },
      message: '管理員刪除成功',
    })
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