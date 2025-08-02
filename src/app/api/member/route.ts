import { NextRequest, NextResponse } from 'next/server'

interface Member {
  member_id: number
  name: string
  email: string
  password: string
  phone: string
  address: string
  create_at: string
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
        { status: 400 },
      )
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/member?member_id=${memberId}`,
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

export async function POST(request: NextRequest) {
  try {
    const body: Member = await request.json()

    if (
      !body.name ||
      !body.email ||
      !body.password ||
      !body.phone ||
      !body.address
    ) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '所有欄位皆為必填',
        },
        { status: 400 },
      )
    }

    const newMember = {
      member_id: Math.floor(Math.random() * 100000),
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      create_at: new Date().toISOString(),
    }

    return NextResponse.json({
      status: 201,
      data: newMember,
      message: '會員註冊成功',
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
    const body = await request.json()

    if (!body.member_id) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '會員編號為必填',
        },
        { status: 400 },
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.member_id) {
      return NextResponse.json(
        {
          status: 400,
          data: null,
          message: '會員編號為必填',
        },
        { status: 400 },
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

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
