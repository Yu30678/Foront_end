import { NextRequest, NextResponse } from 'next/server'

interface Member {
  member_id?: number
  name: string
  password: string
  phone: string
  address: string
  email: string
  create_at?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('member_id')

    if (memberId) {
      const member = {
        member_id: parseInt(memberId),
        name: '測試用戶',
        email: 'test@example.com',
        phone: '0912345678',
        address: '台北市信義區',
        create_at: '2025-01-01T10:00:00',
      }

      return NextResponse.json({
        status: 200,
        data: member,
        message: '成功取得會員資料',
      })
    }

    return NextResponse.json({
      status: 200,
      data: [
        {
          member_id: 1,
          name: '張三',
          email: 'zhang@example.com',
          phone: '0912345678',
          address: '台北市信義區',
          create_at: '2025-01-01T10:00:00',
        },
        {
          member_id: 2,
          name: '李四',
          email: 'li@example.com',
          phone: '0987654321',
          address: '新北市板橋區',
          create_at: '2025-01-02T11:00:00',
        },
      ],
      message: '成功取得會員列表',
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
    const body: Member = await request.json()

    if (
      !body.name ||
      !body.password ||
      !body.phone ||
      !body.address ||
      !body.email
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
      create_at: body.create_at || new Date().toISOString(),
    }

    return NextResponse.json({
      status: 201,
      data: newMember,
      message: '會員新增成功',
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
    const body: Member = await request.json()

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

    const updatedMember = {
      member_id: body.member_id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      create_at: body.create_at,
    }

    return NextResponse.json({
      status: 200,
      data: updatedMember,
      message: '會員更新成功',
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
    const body: Pick<Member, 'member_id'> = await request.json()

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
