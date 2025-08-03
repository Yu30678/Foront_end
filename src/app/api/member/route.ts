import { NextRequest, NextResponse } from 'next/server'

interface Member {
  member_id: number
  name: string
  email: string
  phone: string
  address: string
  create_at: string
}

interface MemberRegistration {
  name: string
  email: string
  password: string
  phone: string
  address: string
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

    // 模擬會員資料查詢
    const mockMember: Member = {
      member_id: parseInt(memberId),
      name: '張三',
      email: 'zhang@example.com',
      phone: '0912345678',
      address: '台北市信義區',
      create_at: new Date().toISOString(),
    }

    return NextResponse.json({
      status: 200,
      data: mockMember,
      message: '成功取得會員資料',
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
    const body: MemberRegistration = await request.json()

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

    // 模擬會員資料更新
    const updatedMember: Member = {
      member_id: body.member_id,
      name: body.name || '張三',
      email: body.email || 'zhang@example.com',
      phone: body.phone || '0912345678',
      address: body.address || '台北市信義區',
      create_at: new Date().toISOString(),
    }

    return NextResponse.json({
      status: 200,
      data: updatedMember,
      message: '會員資料更新成功',
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

    // 模擬會員刪除
    return NextResponse.json({
      status: 200,
      data: { member_id: body.member_id },
      message: '會員刪除成功',
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
