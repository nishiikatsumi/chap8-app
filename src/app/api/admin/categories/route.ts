
import { prisma } from '@/app/_libs/prisma'
import { NextResponse, NextRequest } from 'next/server'
import { CategoriesIndexResponse } from '../../../_types/PrismaTypes'
import { supabaseServer } from '@/app/_libs/supabaseServer'

export const GET = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''
  
    // supabaseに対してtokenを送る
    const { error } = await supabaseServer.auth.getUser(token)
  
    // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
    if (error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  
    // tokenが正しい場合、以降が実行される
  
  try {
    // カテゴリーの一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc', // 作成日時の降順で取得
      },
    })

    // レスポンスを返す
    return NextResponse.json<CategoriesIndexResponse>({ categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// カテゴリーの作成時に送られてくるリクエストのbodyの型
export type CreateCategoryRequestBody = {
  name: string
}

// カテゴリー作成APIのレスポンスの型
export type CreateCategoryResponse = {
  id: number
}

export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''

	// supabaseに対してtokenを送る
  const { error } = await supabaseServer.auth.getUser(token)

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  // tokenが正しい場合、以降が実行される

  try {
    // リクエストのbodyを取得
    const body = await request.json()

    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body

    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    })

    // レスポンスを返す
    return NextResponse.json<CreateCategoryResponse>({
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}
