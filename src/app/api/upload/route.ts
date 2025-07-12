import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { status: 400, data: null, message: '未選擇檔案' },
        { status: 400 },
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { status: 400, data: null, message: '只能上傳圖片檔案' },
        { status: 400 },
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { status: 400, data: null, message: '檔案大小不能超過 5MB' },
        { status: 400 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const filepath = join(uploadDir, filename)

    try {
      await writeFile(filepath, buffer)
    } catch (writeError) {
      await require('fs').promises.mkdir(uploadDir, { recursive: true })
      await writeFile(filepath, buffer)
    }

    const imageUrl = `/uploads/${filename}`

    return NextResponse.json({
      status: 200,
      data: {
        url: imageUrl,
        filename: filename,
        originalName: file.name,
        size: file.size,
      },
      message: '圖片上傳成功',
    })
  } catch (error) {
    console.error('圖片上傳錯誤:', error)
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
